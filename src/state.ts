import { basename, join } from "node:path";
import type { LaneDefinition, LaneManifest, RunManifest, Usage } from "./contracts.js";
import { EXTRACTED_OUTPUTS, FINAL_OUTPUTS, SCHEMA_VERSION } from "./contracts.js";
import { ensureDir, hashDirectory, pathExists, readJson, readText, resolveInside, sha256, writeJson } from "./fs.js";
import { estimateTokens, extractBriefTitle, extractProfilePath, parseLaneDefinitions } from "./markdown.js";

export const ZERO_USAGE: Usage = {
  inputTokens: 0,
  outputTokens: 0,
  totalTokens: 0,
  estimatedCostUsd: 0,
  localOnly: true,
};

export async function ensureRunScaffold(runDir: string): Promise<void> {
  for (const child of ["lanes", "logs", "metrics", "validation", "raw", "extracted", "output"]) {
    await ensureDir(join(runDir, child));
  }
}

export async function loadRunManifest(runDir: string): Promise<RunManifest> {
  return readJson<RunManifest>(join(runDir, "run.json"));
}

export async function saveRunManifest(runDir: string, manifest: RunManifest): Promise<void> {
  await writeJson(join(runDir, "run.json"), manifest);
}

export async function loadLaneManifest(runDir: string, manifestPath: string): Promise<LaneManifest> {
  return readJson<LaneManifest>(join(runDir, manifestPath));
}

export async function saveLaneManifest(runDir: string, manifest: LaneManifest): Promise<void> {
  await writeJson(join(runDir, manifest.manifestPath), manifest);
}

export async function initializeRunManifest(
  runDir: string,
  options: { maxConcurrency?: number; force?: boolean },
): Promise<{ run: RunManifest; lanes: LaneManifest[] }> {
  await ensureRunScaffold(runDir);

  const briefPath = join(runDir, "00-brief.md");
  const brief = await readText(briefPath);
  const existingRunPath = join(runDir, "run.json");
  const existingRun = await pathExists(existingRunPath) ? await readJson<RunManifest>(existingRunPath) : undefined;
  const laneDefinitions = await definitionsFromBriefOrExisting(runDir, brief, existingRun);

  if (laneDefinitions.length === 0) {
    throw new Error("No evidence lanes found. Add a lane table to 00-brief.md or checked-in lane manifests under lanes/.");
  }

  const now = new Date().toISOString();
  const runId = existingRun?.runId ?? deterministicRunId(runDir, brief, laneDefinitions);
  const slug = basename(runDir);
  const maxConcurrency = options.maxConcurrency ?? existingRun?.maxConcurrency ?? 4;
  const sourcePackHash = await hashDirectory(join(runDir, "source-pack"));
  const title = extractBriefTitle(brief, slug);
  const profilePath = extractProfilePath(brief);
  const lanes = await Promise.all(laneDefinitions.map((definition) =>
    initializeLaneManifest(runDir, runId, definition, now, Boolean(options.force)),
  ));
  const executionMode = lanes.some((lane) => lane.executor.type === "command")
    ? "mixed"
    : lanes.every((lane) => lane.executor.type === "artifact")
      ? "external"
      : "local";
  const run: RunManifest = {
    schemaVersion: SCHEMA_VERSION,
    runId,
    slug,
    title,
    runDir: ".",
    profilePath,
    status: "planned",
    executionMode,
    ...(sourcePackHash ? { sourcePackHash } : {}),
    createdAt: existingRun?.createdAt ?? now,
    updatedAt: now,
    maxConcurrency,
    lanes: lanes.map((lane) => ({
      laneId: lane.laneId,
      manifestPath: lane.manifestPath,
      rawPath: lane.rawPath,
      required: lane.required,
    })),
    artifacts: {
      brief: "00-brief.md",
      extracted: [...EXTRACTED_OUTPUTS],
      output: [...FINAL_OUTPUTS],
      logs: ["logs/run.jsonl", ...lanes.map((lane) => `logs/${lane.laneId}.jsonl`)],
      metrics: "metrics/token-cost-summary.json",
      validation: "validation/report.json",
    },
    totals: { ...ZERO_USAGE },
  };

  await saveRunManifest(runDir, run);
  await Promise.all(lanes.map((lane) => saveLaneManifest(runDir, lane)));

  return { run, lanes };
}

export function sumUsage(lanes: LaneManifest[]): Usage {
  const totals = lanes.reduce((acc, lane) => ({
    inputTokens: acc.inputTokens + lane.usage.inputTokens,
    outputTokens: acc.outputTokens + lane.usage.outputTokens,
    totalTokens: acc.totalTokens + lane.usage.totalTokens,
    estimatedCostUsd: acc.estimatedCostUsd + lane.usage.estimatedCostUsd,
  }), {
    inputTokens: 0,
    outputTokens: 0,
    totalTokens: 0,
    estimatedCostUsd: 0,
  });

  return {
    ...totals,
    estimatedCostUsd: roundMoney(totals.estimatedCostUsd),
    localOnly: lanes.every((lane) => lane.usage.localOnly),
  };
}

export function usageFromTexts(inputText: string, outputText: string): Usage {
  const inputTokens = estimateTokens(inputText);
  const outputTokens = estimateTokens(outputText);

  return {
    inputTokens,
    outputTokens,
    totalTokens: inputTokens + outputTokens,
    estimatedCostUsd: 0,
    localOnly: true,
  };
}

export function deterministicRunId(runDir: string, brief: string, lanes: LaneDefinition[]): string {
  const laneKey = lanes.map((lane) => `${lane.laneId}:${lane.rawPath}`).join("|");
  return `run_${sha256(`${basename(runDir)}\n${brief}\n${laneKey}`).slice(0, 16)}`;
}

async function definitionsFromBriefOrExisting(
  runDir: string,
  brief: string,
  existingRun: RunManifest | undefined,
): Promise<LaneDefinition[]> {
  const fromBrief = parseLaneDefinitions(brief);

  if (fromBrief.length > 0) {
    return fromBrief;
  }

  if (!existingRun) {
    return [];
  }

  const definitions: LaneDefinition[] = [];

  for (const laneRef of existingRun.lanes) {
    const lane = await loadLaneManifest(runDir, laneRef.manifestPath);
    definitions.push({
      laneId: lane.laneId,
      title: lane.title,
      mission: lane.mission,
      question: lane.question,
      targetSources: lane.targetSources,
      rawPath: lane.rawPath,
      evidenceThreshold: lane.evidenceThreshold,
    });
  }

  return definitions;
}

async function initializeLaneManifest(
  runDir: string,
  runId: string,
  definition: LaneDefinition,
  now: string,
  force: boolean,
): Promise<LaneManifest> {
  const manifestPath = `lanes/${definition.laneId}.json`;
  const absoluteManifestPath = resolveInside(runDir, manifestPath);
  const existing = await pathExists(absoluteManifestPath) ? await readJson<LaneManifest>(absoluteManifestPath) : undefined;
  const executor = existing?.executor ?? { type: "artifact" as const };
  const provider = existing?.provider ?? (executor.type === "command" ? "local-command" : "local");
  const model = existing?.model ?? executor.type;

  return {
    schemaVersion: SCHEMA_VERSION,
    runId,
    laneId: definition.laneId,
    manifestPath,
    rawPath: definition.rawPath,
    required: existing?.required ?? true,
    title: definition.title,
    mission: definition.mission,
    question: definition.question,
    targetSources: definition.targetSources,
    evidenceThreshold: definition.evidenceThreshold,
    provider,
    model,
    executor,
    status: force ? "queued" : existing?.status ?? "queued",
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
    retries: existing?.retries ?? 0,
    attempts: force ? [] : existing?.attempts ?? [],
    validation: force ? { status: "not_run", issueCount: 0 } : existing?.validation ?? { status: "not_run", issueCount: 0 },
    usage: force ? { ...ZERO_USAGE } : existing?.usage ?? { ...ZERO_USAGE },
  };
}

function roundMoney(value: number): number {
  return Math.round(value * 1_000_000) / 1_000_000;
}
