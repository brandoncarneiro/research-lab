import { join } from "node:path";
import type { LaneManifest, MetricsSummary, RunManifest } from "./contracts.js";
import { SCHEMA_VERSION } from "./contracts.js";
import { writeJson } from "./fs.js";
import { sumUsage } from "./state.js";

export async function writeMetrics(runDir: string, run: RunManifest, lanes: LaneManifest[]): Promise<MetricsSummary> {
  const totals = sumUsage(lanes);
  const summary: MetricsSummary = {
    schemaVersion: SCHEMA_VERSION,
    runId: run.runId,
    generatedAt: new Date().toISOString(),
    executionMode: run.executionMode,
    lanes: lanes.map((lane) => ({
      laneId: lane.laneId,
      provider: lane.provider,
      model: lane.model,
      localOnly: lane.usage.localOnly,
      inputTokens: lane.usage.inputTokens,
      outputTokens: lane.usage.outputTokens,
      totalTokens: lane.usage.totalTokens,
      estimatedCostUsd: lane.usage.estimatedCostUsd,
    })),
    totals,
  };

  await writeJson(join(runDir, run.artifacts.metrics), summary);
  return summary;
}
