import assert from "node:assert/strict";
import test from "node:test";
import { collectDefinedSourceIds, validateRawLaneText } from "../src/artifact-checks.js";
import { rawLaneText } from "./helpers.js";

test("raw lane validation reports missing required headings", () => {
  const text = rawLaneText().replace(/^## Sources Checked[\s\S]*?^## Blocked Sources/im, "## Blocked Sources");
  const issues = validateRawLaneText("raw/timeline.md", text);

  assert.ok(issues.some((issue) => issue.code === "raw.heading_missing" && issue.message.includes("Sources Checked")));
});

test("raw lane validation enforces FACT source citations", () => {
  const text = rawLaneText().replace("Source: S1. Confidence: high.", "Confidence: high.");
  const issues = validateRawLaneText("raw/timeline.md", text);

  assert.ok(issues.some((issue) => issue.code === "raw.fact_uncited"));
});

test("raw lane validation rejects FACT citations to undefined source IDs", () => {
  const text = rawLaneText().replace("Source: S1. Confidence: high.", "Source: S999. Confidence: high.");
  const issues = validateRawLaneText("raw/timeline.md", text);

  assert.ok(issues.some((issue) => issue.code === "raw.fact_unknown_source"));
});

test("raw lane validation enforces INFERENCE basis", () => {
  const text = rawLaneText().replace("  - Based on: S1\n", "");
  const issues = validateRawLaneText("raw/timeline.md", text);

  assert.ok(issues.some((issue) => issue.code === "raw.inference_basis_missing"));
});

test("raw lane validation warns when SPECULATION is not low confidence", () => {
  const text = rawLaneText().replace("  - Confidence: low", "  - Confidence: medium");
  const issues = validateRawLaneText("raw/timeline.md", text);

  assert.ok(issues.some((issue) => issue.code === "raw.speculation_confidence" && issue.level === "warning"));
});

test("source ID collection reads source tables", () => {
  const sourceIds = collectDefinedSourceIds(rawLaneText("Timeline", "timeline", "S2"));

  assert.deepEqual([...sourceIds], ["S2"]);
});
