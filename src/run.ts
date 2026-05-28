import { spawn } from "node:child_process";
import { join } from "node:path";
import type { LaneExecutor, LaneManifest, RunManifest } from "./contracts.js";
import { copyTextFile, pathExists, readText, writeText } from "./fs.js";
import { writeLog } from "./logging.js";
import { writeMetrics } from "./metrics.js";
import { validateRawLaneText } from "./artifact-checks.js";
import { initializeRunManifest, loadLaneManifest, saveLaneManifest, saveRunManifest, sumUsage, usageFromTexts, ZERO_USAGE } from "./state.js";

export type RunOptions = {
  force?: boolean;
  maxConcurrency?: number;
};

export async function runResearch(runDir: string, options: RunOptions): Promise<RunManifest> {
  const { run } = await initializeRunManifest(runDir, options);
  const runLog = join(runDir, "logs/run.jsonl");

  if (options.force) {
    await writeText(runLog, "");
    for (const laneRef of run.lanes) {
      await writeText(join(runDir, `logs/${laneRef.laneId}.jsonl`), "");
    }
  }

  const runningRun: RunManifest = {
    ...run,
    status: "running",
    startedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  await saveRunManifest(runDir, runningRun);
  await writeLog(runLog, {
    runId: runningRun.runId,
    level: "info",
    event: "run.started",
    data: {
      lanes: runningRun.lanes.length,
      maxConcurrency: runningRun.maxConcurrency,
      executionMode: runningRun.executionMode,
    },
  });

  const lanes = await runLanePool(runDir, runningRun, Math.max(1, runningRun.maxConcurrency));
  const totals = sumUsage(lanes);
  const hasFailed = lanes.some((lane) => lane.status === "failed");
  const hasBlocked = lanes.some((lane) => lane.required && lane.status === "blocked");
  const status = hasFailed ? "failed" : hasBlocked ? "blocked" : "ready_for_synthesis";
  const finalRun: RunManifest = {
    ...runningRun,
    status,
    totals,
    updatedAt: new Date().toISOString(),
  };

  await writeMetrics(runDir, finalRun, lanes);
  await saveRunManifest(runDir, finalRun);
  await writeLog(runLog, {
    runId: finalRun.runId,
    level: status === "ready_for_synthesis" ? "info" : "warning",
    event: status === "ready_for_synthesis" ? "run.ready_for_synthesis" : `run.${status}`,
    data: {
      inputTokens: totals.inputTokens,
      outputTokens: totals.outputTokens,
      totalTokens: totals.totalTokens,
      estimatedCostUsd: totals.estimatedCostUsd,
    },
  });

  return finalRun;
}

async function runLanePool(runDir: string, run: RunManifest, maxConcurrency: number): Promise<LaneManifest[]> {
  const results: LaneManifest[] = [];
  let cursor = 0;

  async function worker(): Promise<void> {
    while (cursor < run.lanes.length) {
      const laneRef = run.lanes[cursor];
      cursor += 1;

      if (!laneRef) {
        return;
      }

      await writeLog(join(runDir, "logs/run.jsonl"), {
        runId: run.runId,
        level: "info",
        event: "lane.queued",
        laneId: laneRef.laneId,
      });
      results.push(await executeLane(runDir, run, await loadLaneManifest(runDir, laneRef.manifestPath)));
    }
  }

  const workerCount = Math.min(maxConcurrency, run.lanes.length);
  await Promise.all(Array.from({ length: workerCount }, () => worker()));

  return results.sort((a, b) => a.laneId.localeCompare(b.laneId));
}

async function executeLane(runDir: string, run: RunManifest, lane: LaneManifest): Promise<LaneManifest> {
  const runLog = join(runDir, "logs/run.jsonl");
  const laneLog = join(runDir, `logs/${lane.laneId}.jsonl`);
  const startedAt = new Date().toISOString();
  const current: LaneManifest = {
    ...lane,
    status: "running",
    startedAt,
    updatedAt: startedAt,
  };
  await saveLaneManifest(runDir, current);
  await writeLog(runLog, { runId: run.runId, level: "info", event: "lane.started", laneId: lane.laneId });
  await writeLog(laneLog, { runId: run.runId, level: "info", event: "lane.started", laneId: lane.laneId });

  let status: "complete" | "blocked" | "failed" = "complete";
  let usage = { ...ZERO_USAGE };
  let error: { code: string; message: string } | undefined;
  const attempts = [...current.attempts];
  const maxAttempts = Math.max(1, current.retries + 1);

  for (let index = 0; index < maxAttempts; index += 1) {
    const attemptNumber = attempts.length + 1;
    const attemptStartedAt = new Date().toISOString();
    status = "complete";
    usage = { ...ZERO_USAGE };
    error = undefined;

    try {
      usage = await executeLaneBody(runDir, current);
      const rawText = await readText(join(runDir, current.rawPath));
      const laneIssues = validateRawLaneText(current.rawPath, rawText);
      const laneErrors = laneIssues.filter((issue) => issue.level === "error");

      if (laneErrors.length > 0) {
        status = "failed";
        error = {
          code: "lane.validation_failed",
          message: laneErrors.map((issue) => issue.message).join("; "),
        };
      }
    } catch (caught) {
      status = "blocked";
      error = {
        code: "lane.execution_blocked",
        message: caught instanceof Error ? caught.message : String(caught),
      };
    }

    attempts.push({
      attempt: attemptNumber,
      status,
      startedAt: attemptStartedAt,
      completedAt: new Date().toISOString(),
      usage,
      ...(error ? { error } : {}),
    });

    if (status === "complete" || index === maxAttempts - 1) {
      break;
    }

    await writeLog(runLog, {
      runId: run.runId,
      level: "warning",
      event: "lane.retry",
      laneId: current.laneId,
      data: { nextAttempt: attemptNumber + 1, maxAttempts },
      ...(error ? { error } : {}),
    });
    await writeLog(laneLog, {
      runId: run.runId,
      level: "warning",
      event: "lane.retry",
      laneId: current.laneId,
      data: { nextAttempt: attemptNumber + 1, maxAttempts },
      ...(error ? { error } : {}),
    });
  }

  const completedAt = new Date().toISOString();
  const finalLane: LaneManifest = {
    ...current,
    status,
    completedAt,
    updatedAt: completedAt,
    attempts,
    validation: {
      status: status === "complete" ? "passed" : "failed",
      checkedAt: completedAt,
      issueCount: status === "complete" ? 0 : 1,
    },
    usage,
  };

  await saveLaneManifest(runDir, finalLane);
  await writeLog(runLog, {
    runId: run.runId,
    level: status === "complete" ? "info" : "error",
    event: `lane.${status}`,
    laneId: finalLane.laneId,
    ...(error ? { error } : {}),
    data: finalLane.usage,
  });
  await writeLog(laneLog, {
    runId: run.runId,
    level: status === "complete" ? "info" : "error",
    event: `lane.${status}`,
    laneId: finalLane.laneId,
    ...(error ? { error } : {}),
    data: finalLane.usage,
  });

  return finalLane;
}

async function executeLaneBody(runDir: string, lane: LaneManifest) {
  const rawPath = join(runDir, lane.rawPath);
  const executor = lane.executor;

  if (executor.type === "artifact") {
    if (!await pathExists(rawPath)) {
      throw new Error(`Artifact executor expected existing raw output at ${lane.rawPath}.`);
    }

    const rawText = await readText(rawPath);
    if (rawText.trim().length === 0) {
      throw new Error(`Artifact executor found empty raw output at ${lane.rawPath}.`);
    }

    return usageFromTexts("", rawText);
  }

  if (executor.type === "fixture") {
    const fixturePath = join(runDir, executor.inputPath);

    if (!await pathExists(fixturePath)) {
      throw new Error(`Fixture executor cannot read ${executor.inputPath}.`);
    }

    const inputText = await readText(fixturePath);
    await copyTextFile(fixturePath, rawPath);
    const outputText = await readText(rawPath);
    return usageFromTexts(inputText, outputText);
  }

  await runCommand(runDir, lane, executor, rawPath);

  if (!await pathExists(rawPath)) {
    throw new Error(`Command executor completed without writing ${lane.rawPath}.`);
  }

  const rawText = await readText(rawPath);
  return usageFromTexts([executor.command, ...(executor.args ?? [])].join(" "), rawText);
}

async function runCommand(
  runDir: string,
  lane: LaneManifest,
  executor: Extract<LaneExecutor, { type: "command" }>,
  rawPath: string,
): Promise<void> {
  await new Promise<void>((resolve, reject) => {
    const child = spawn(executor.command, executor.args ?? [], {
      cwd: runDir,
      env: {
        ...process.env,
        RESEARCH_LAB_RUN_DIR: runDir,
        RESEARCH_LAB_LANE_ID: lane.laneId,
        RESEARCH_LAB_RAW_PATH: rawPath,
      },
      stdio: ["ignore", "pipe", "pipe"],
    });
    let stderr = "";
    child.stdout.on("data", () => {
      // Drain stdout so verbose local commands cannot block on a full pipe.
    });
    const timeout = executor.timeoutMs
      ? setTimeout(() => {
        child.kill("SIGTERM");
        reject(new Error(`Lane command timed out after ${executor.timeoutMs}ms.`));
      }, executor.timeoutMs)
      : undefined;

    child.stderr.on("data", (chunk: Buffer) => {
      stderr += chunk.toString("utf8");
    });
    child.on("error", reject);
    child.on("close", (code) => {
      if (timeout) {
        clearTimeout(timeout);
      }

      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(`Lane command exited ${code}: ${stderr.trim()}`));
    });
  });
}
