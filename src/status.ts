import { join } from "node:path";
import type { LaneManifest, RunManifest } from "./contracts.js";
import { pathExists, readJson } from "./fs.js";

export type RunStatusView = {
  run: RunManifest;
  lanes: LaneManifest[];
};

export async function readStatus(runDir: string): Promise<RunStatusView> {
  const run = await readJson<RunManifest>(join(runDir, "run.json"));
  const lanes: LaneManifest[] = [];

  for (const laneRef of run.lanes) {
    lanes.push(await readJson<LaneManifest>(join(runDir, laneRef.manifestPath)));
  }

  return { run, lanes };
}

export async function renderStatus(runDir: string): Promise<string> {
  if (!await pathExists(join(runDir, "run.json"))) {
    return "No run.json found. Run `research-lab run <run-dir>` first.";
  }

  const { run, lanes } = await readStatus(runDir);
  const lines = [
    `${run.slug} (${run.runId})`,
    `status: ${run.status}`,
    `execution: ${run.executionMode}`,
    `lanes: ${lanes.length} / max concurrency ${run.maxConcurrency}`,
    `tokens: ${run.totals.totalTokens} (${run.totals.inputTokens} in, ${run.totals.outputTokens} out)`,
    `estimated cost: $${run.totals.estimatedCostUsd.toFixed(6)}`,
    "",
    "| Lane | Status | Provider | Model | Tokens | Cost |",
    "| --- | --- | --- | --- | ---: | ---: |",
    ...lanes.map((lane) => `| ${lane.laneId} | ${lane.status} | ${lane.provider} | ${lane.model} | ${lane.usage.totalTokens} | $${lane.usage.estimatedCostUsd.toFixed(6)} |`),
  ];

  return lines.join("\n");
}
