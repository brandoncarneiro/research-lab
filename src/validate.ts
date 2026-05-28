import { join } from "node:path";
import type { LaneManifest, LogEntry, RunManifest, ValidationIssue, ValidationReport } from "./contracts.js";
import { EXTRACTED_OUTPUTS, FINAL_OUTPUTS, SCHEMA_VERSION } from "./contracts.js";
import { collectDefinedEvidenceIds, collectReferencedEvidenceIds, validateFinalArtifactText, validateRawLaneText } from "./artifact-checks.js";
import { ensureDir, isInside, listFiles, pathExists, readJson, readText, writeJson } from "./fs.js";
import { writeLog } from "./logging.js";
import { sumUsage } from "./state.js";

export async function validateRun(runDir: string, options: { writeReport?: boolean; updateStatus?: boolean } = {}): Promise<ValidationReport> {
  const issues: ValidationIssue[] = [];
  const checkedAt = new Date().toISOString();
  let run: RunManifest | undefined;
  let lanes: LaneManifest[] = [];

  try {
    run = await readJson<RunManifest>(join(runDir, "run.json"));
  } catch (error) {
    issues.push({
      level: "error",
      code: "run_json.unreadable",
      message: `Cannot read run.json: ${errorMessage(error)}`,
      path: "run.json",
    });
  }

  if (run) {
    validateRunManifest(run, issues);
    lanes = await loadAndValidateLanes(runDir, run, issues);
    await validateArtifacts(runDir, run, lanes, issues);
    await validateLogs(runDir, run, issues);
    await validateMetrics(runDir, run, lanes, issues);
  }

  const errors = issues.filter((issue) => issue.level === "error").length;
  const warnings = issues.filter((issue) => issue.level === "warning").length;
  const report: ValidationReport = {
    schemaVersion: SCHEMA_VERSION,
    runId: run?.runId ?? "unknown",
    checkedAt,
    status: errors === 0 ? "passed" : "failed",
    summary: {
      errors,
      warnings,
      lanes: lanes.length,
      finalArtifacts: FINAL_OUTPUTS.length,
    },
    issues,
  };

  if (options.writeReport ?? true) {
    await ensureDir(join(runDir, "validation"));
    await writeJson(join(runDir, "validation/report.json"), report);
  }

  if (run && options.updateStatus && report.status === "passed") {
    const updated: RunManifest = {
      ...run,
      status: "validated",
      updatedAt: new Date().toISOString(),
    };
    await writeJson(join(runDir, "run.json"), updated);
    await writeLog(join(runDir, "logs/run.jsonl"), {
      runId: run.runId,
      level: "info",
      event: "validation.completed",
      data: {
        status: report.status,
        errors,
        warnings,
      },
    });
  } else if (run) {
    await writeLog(join(runDir, "logs/run.jsonl"), {
      runId: run.runId,
      level: report.status === "passed" ? "info" : "error",
      event: "validation.completed",
      data: {
        status: report.status,
        errors,
        warnings,
      },
    });
  }

  return report;
}

function validateRunManifest(run: RunManifest, issues: ValidationIssue[]): void {
  if (run.schemaVersion !== SCHEMA_VERSION) {
    issues.push({ level: "error", code: "run.schema_version", message: `Unsupported schema version: ${run.schemaVersion}.`, path: "run.json" });
  }

  if (!/^run_[a-f0-9]{16}$/.test(run.runId)) {
    issues.push({ level: "error", code: "run.run_id", message: "runId must be deterministic run_<16 hex chars>.", path: "run.json" });
  }

  if (!Number.isInteger(run.maxConcurrency) || run.maxConcurrency < 1) {
    issues.push({ level: "error", code: "run.max_concurrency", message: "maxConcurrency must be a positive integer.", path: "run.json" });
  }

  if (run.lanes.length === 0) {
    issues.push({ level: "error", code: "run.no_lanes", message: "Run manifest has no lanes.", path: "run.json" });
  }

  if ((run.status === "complete" || run.status === "validated") && !run.completedAt) {
    issues.push({ level: "error", code: "run.completed_at_missing", message: "Complete/validated run must include completedAt.", path: "run.json" });
  }

  if (run.totals.totalTokens !== run.totals.inputTokens + run.totals.outputTokens) {
    issues.push({ level: "error", code: "run.token_math", message: "Run totalTokens must equal inputTokens + outputTokens.", path: "run.json" });
  }

  if (run.totals.estimatedCostUsd < 0) {
    issues.push({ level: "error", code: "run.cost_negative", message: "Run estimatedCostUsd cannot be negative.", path: "run.json" });
  }
}

async function loadAndValidateLanes(runDir: string, run: RunManifest, issues: ValidationIssue[]): Promise<LaneManifest[]> {
  const lanes: LaneManifest[] = [];

  for (const laneRef of run.lanes) {
    const manifestPath = join(runDir, laneRef.manifestPath);

    try {
      const lane = await readJson<LaneManifest>(manifestPath);
      lanes.push(lane);
      validateLaneManifest(runDir, run, lane, issues);
    } catch (error) {
      issues.push({
        level: "error",
        code: "lane_manifest.unreadable",
        message: `Cannot read lane manifest ${laneRef.manifestPath}: ${errorMessage(error)}`,
        path: laneRef.manifestPath,
      });
    }
  }

  return lanes;
}

function validateLaneManifest(runDir: string, run: RunManifest, lane: LaneManifest, issues: ValidationIssue[]): void {
  if (lane.schemaVersion !== SCHEMA_VERSION) {
    issues.push({ level: "error", code: "lane.schema_version", message: `Unsupported lane schema version: ${lane.schemaVersion}.`, path: lane.manifestPath });
  }

  if (lane.runId !== run.runId) {
    issues.push({ level: "error", code: "lane.run_id_mismatch", message: `${lane.laneId} has runId ${lane.runId}, expected ${run.runId}.`, path: lane.manifestPath });
  }

  if (!lane.rawPath.startsWith("raw/") || !isInside(join(runDir, "raw"), join(runDir, lane.rawPath))) {
    issues.push({ level: "error", code: "lane.raw_path", message: `${lane.laneId} rawPath must be inside raw/.`, path: lane.manifestPath });
  }

  if (lane.usage.totalTokens !== lane.usage.inputTokens + lane.usage.outputTokens) {
    issues.push({ level: "error", code: "lane.token_math", message: `${lane.laneId} totalTokens must equal inputTokens + outputTokens.`, path: lane.manifestPath });
  }

  if (lane.usage.estimatedCostUsd < 0) {
    issues.push({ level: "error", code: "lane.cost_negative", message: `${lane.laneId} estimatedCostUsd cannot be negative.`, path: lane.manifestPath });
  }

  if (lane.usage.estimatedCostUsd === 0 && !lane.usage.localOnly && !lane.usage.pricingUnavailableReason) {
    issues.push({ level: "error", code: "lane.cost_unexplained_zero", message: `${lane.laneId} has zero cost without localOnly or pricingUnavailableReason.`, path: lane.manifestPath });
  }

  if (lane.status === "complete" && !lane.completedAt) {
    issues.push({ level: "error", code: "lane.completed_at_missing", message: `${lane.laneId} is complete without completedAt.`, path: lane.manifestPath });
  }

  if (lane.status === "blocked") {
    const attempt = lane.attempts.at(-1);
    if (!attempt?.error?.message) {
      issues.push({ level: "error", code: "lane.blocker_missing", message: `${lane.laneId} is blocked without blocker metadata.`, path: lane.manifestPath });
    }
  }
}

async function validateArtifacts(runDir: string, run: RunManifest, lanes: LaneManifest[], issues: ValidationIssue[]): Promise<void> {
  if (!await pathExists(join(runDir, run.artifacts.brief))) {
    issues.push({ level: "error", code: "artifact.brief_missing", message: "00-brief.md is missing.", path: run.artifacts.brief });
  }

  for (const lane of lanes) {
    const rawPath = join(runDir, lane.rawPath);
    if (!await pathExists(rawPath)) {
      issues.push({ level: "error", code: "artifact.raw_missing", message: `Required raw lane file missing: ${lane.rawPath}.`, path: lane.rawPath });
      continue;
    }

    const rawText = await readText(rawPath);
    issues.push(...validateRawLaneText(lane.rawPath, rawText));
  }

  for (const path of EXTRACTED_OUTPUTS) {
    if (!await pathExists(join(runDir, path))) {
      issues.push({ level: "error", code: "artifact.extracted_missing", message: `Required extracted artifact missing: ${path}.`, path });
      continue;
    }

    const text = await readText(join(runDir, path));
    if (text.trim().length === 0) {
      issues.push({ level: "error", code: "artifact.extracted_empty", message: `Required extracted artifact is empty: ${path}.`, path });
    }
  }

  for (const path of FINAL_OUTPUTS) {
    if (!await pathExists(join(runDir, path))) {
      issues.push({ level: "error", code: "artifact.final_missing", message: `Required final artifact missing: ${path}.`, path });
      continue;
    }

    const text = await readText(join(runDir, path));
    issues.push(...validateFinalArtifactText(path, text));
  }

  await validateNoExtraFinalArtifacts(runDir, issues);
  await validateEvidenceReferences(runDir, issues);
}

async function validateNoExtraFinalArtifacts(runDir: string, issues: ValidationIssue[]): Promise<void> {
  const outputFiles = (await listFiles(join(runDir, "output")))
    .map((file) => file.replace(`${runDir}/`, ""))
    .filter((file) => file.endsWith(".md"));
  const allowed = new Set<string>(FINAL_OUTPUTS);

  for (const file of outputFiles) {
    const basename = file.split("/").at(-1) ?? file;
    if (!allowed.has(file) || /MASTER_RESEARCH|report|synthesis/i.test(basename)) {
      issues.push({ level: "error", code: "artifact.extra_final", message: `Unexpected final artifact in output/: ${file}.`, path: file });
    }
  }
}

async function validateEvidenceReferences(runDir: string, issues: ValidationIssue[]): Promise<void> {
  const digestPath = join(runDir, "output/RAW_DATA_DIGEST.md");

  if (!await pathExists(digestPath)) {
    return;
  }

  const digest = await readText(digestPath);
  const defined = collectDefinedEvidenceIds(digest);
  const requiredKinds = ["S", "R", "P", "C", "N"];

  for (const kind of requiredKinds) {
    if (![...defined].some((id) => id.startsWith(kind))) {
      issues.push({ level: "error", code: "evidence.kind_missing", message: `RAW_DATA_DIGEST.md defines no ${kind}# IDs.`, path: "output/RAW_DATA_DIGEST.md" });
    }
  }

  for (const artifactPath of ["output/CEO_BRIEF.md", "output/PROJECT_CONTEXT.md"]) {
    if (!await pathExists(join(runDir, artifactPath))) {
      continue;
    }

    const text = await readText(join(runDir, artifactPath));
    const refs = collectReferencedEvidenceIds(text);

    for (const ref of refs) {
      if (!defined.has(ref)) {
        issues.push({ level: "error", code: "evidence.unknown_ref", message: `${artifactPath} references undefined evidence ID ${ref}.`, path: artifactPath });
      }
    }
  }
}

async function validateLogs(runDir: string, run: RunManifest, issues: ValidationIssue[]): Promise<void> {
  const runLogPath = join(runDir, "logs/run.jsonl");

  if (!await pathExists(runLogPath)) {
    issues.push({ level: "error", code: "log.run_missing", message: "Run JSONL log is missing.", path: "logs/run.jsonl" });
    return;
  }

  const runEntries = parseJsonl(await readText(runLogPath), "logs/run.jsonl", issues);
  const events = new Set(runEntries.map((entry) => entry.event));

  for (const event of ["run.started", "lane.started", "run.completed"]) {
    if (!events.has(event)) {
      issues.push({ level: "error", code: "log.event_missing", message: `Run log is missing event ${event}.`, path: "logs/run.jsonl" });
    }
  }

  validateConcurrency(runEntries, run, issues);

  for (const laneRef of run.lanes) {
    const laneLog = `logs/${laneRef.laneId}.jsonl`;
    if (!await pathExists(join(runDir, laneLog))) {
      issues.push({ level: "error", code: "log.lane_missing", message: `Lane JSONL log is missing: ${laneLog}.`, path: laneLog });
      continue;
    }

    const entries = parseJsonl(await readText(join(runDir, laneLog)), laneLog, issues);
    if (!entries.some((entry) => entry.laneId === laneRef.laneId)) {
      issues.push({ level: "error", code: "log.lane_id_missing", message: `${laneLog} has no entries for its laneId.`, path: laneLog });
    }
  }
}

function parseJsonl(text: string, path: string, issues: ValidationIssue[]): LogEntry[] {
  const entries: LogEntry[] = [];
  const lines = text.split(/\r?\n/).filter((line) => line.trim().length > 0);

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index] ?? "";

    try {
      const entry = JSON.parse(line) as LogEntry;
      entries.push(entry);

      if (!entry.ts || !entry.runId || !entry.level || !entry.event) {
        issues.push({ level: "error", code: "log.fields_missing", message: `JSONL log line ${index + 1} is missing required fields.`, path });
      }

      if (entry.level === "error" && !entry.error) {
        issues.push({ level: "warning", code: "log.error_metadata_missing", message: `Error log line ${index + 1} has no error metadata.`, path });
      }
    } catch (error) {
      issues.push({ level: "error", code: "log.malformed_jsonl", message: `Malformed JSONL at line ${index + 1}: ${errorMessage(error)}`, path });
    }
  }

  return entries;
}

function validateConcurrency(entries: LogEntry[], run: RunManifest, issues: ValidationIssue[]): void {
  let active = 0;
  let maxActive = 0;

  for (const entry of entries) {
    if (entry.event === "lane.started") {
      active += 1;
      maxActive = Math.max(maxActive, active);
    }

    if (entry.event === "lane.complete" || entry.event === "lane.blocked" || entry.event === "lane.failed") {
      active = Math.max(0, active - 1);
    }
  }

  if (maxActive > run.maxConcurrency) {
    issues.push({ level: "error", code: "log.concurrency_exceeded", message: `Observed concurrency ${maxActive} exceeds maxConcurrency ${run.maxConcurrency}.`, path: "logs/run.jsonl" });
  }
}

async function validateMetrics(runDir: string, run: RunManifest, lanes: LaneManifest[], issues: ValidationIssue[]): Promise<void> {
  if (!await pathExists(join(runDir, run.artifacts.metrics))) {
    issues.push({ level: "error", code: "metrics.missing", message: `Metrics summary is missing: ${run.artifacts.metrics}.`, path: run.artifacts.metrics });
    return;
  }

  const totals = sumUsage(lanes);

  if (totals.inputTokens !== run.totals.inputTokens || totals.outputTokens !== run.totals.outputTokens || totals.totalTokens !== run.totals.totalTokens) {
    issues.push({ level: "error", code: "metrics.totals_mismatch", message: "Run token totals do not match lane sums.", path: "run.json" });
  }

  if (Math.abs(totals.estimatedCostUsd - run.totals.estimatedCostUsd) > 0.000001) {
    issues.push({ level: "error", code: "metrics.cost_mismatch", message: "Run estimated cost does not match lane sums.", path: "run.json" });
  }
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
