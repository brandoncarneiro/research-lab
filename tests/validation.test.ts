import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import assert from "node:assert/strict";
import test from "node:test";
import { runResearch } from "../src/run.js";
import { synthesizeRun } from "../src/synthesize.js";
import { validateRun } from "../src/validate.js";
import { makeRunFixture } from "./helpers.js";

test("validation closes final artifact references against digest evidence IDs", async () => {
  const runDir = await makeCompletedRun();
  await writeFile(join(runDir, "output/PROJECT_CONTEXT.md"), "# Project Context\n\nUnsupported reference P999.\n", "utf8");

  const report = await validateRun(runDir, { writeReport: true, updateStatus: false });

  assert.equal(report.status, "failed");
  assert.ok(report.issues.some((issue) => issue.code === "evidence.unknown_ref" && issue.path === "output/PROJECT_CONTEXT.md"));
});

test("validation reports malformed JSONL logs", async () => {
  const runDir = await makeCompletedRun();
  await writeFile(join(runDir, "logs/run.jsonl"), "{bad jsonl\n", "utf8");

  const report = await validateRun(runDir, { writeReport: true, updateStatus: false });

  assert.equal(report.status, "failed");
  assert.ok(report.issues.some((issue) => issue.code === "log.malformed_jsonl"));
});

test("validation reports lane token math failures", async () => {
  const runDir = await makeCompletedRun();
  const lanePath = join(runDir, "lanes/timeline.json");
  const lane = JSON.parse(await readFile(lanePath, "utf8")) as {
    usage: { inputTokens: number; outputTokens: number; totalTokens: number };
  };
  lane.usage.totalTokens = lane.usage.inputTokens + lane.usage.outputTokens + 1;
  await writeFile(lanePath, JSON.stringify(lane, null, 2), "utf8");

  const report = await validateRun(runDir, { writeReport: true, updateStatus: false });

  assert.equal(report.status, "failed");
  assert.ok(report.issues.some((issue) => issue.code === "lane.token_math"));
});

test("validation reports negative runtime cost", async () => {
  const runDir = await makeCompletedRun();
  const runPath = join(runDir, "run.json");
  const run = JSON.parse(await readFile(runPath, "utf8")) as {
    totals: { estimatedCostUsd: number };
  };
  run.totals.estimatedCostUsd = -1;
  await writeFile(runPath, JSON.stringify(run, null, 2), "utf8");

  const report = await validateRun(runDir, { writeReport: true, updateStatus: false });

  assert.equal(report.status, "failed");
  assert.ok(report.issues.some((issue) => issue.code === "run.cost_negative"));
});

async function makeCompletedRun(): Promise<string> {
  const runDir = await makeRunFixture();
  await runResearch(runDir, { force: true, maxConcurrency: 2 });
  await synthesizeRun(runDir);
  return runDir;
}
