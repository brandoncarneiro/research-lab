import { readFile } from "node:fs/promises";
import assert from "node:assert/strict";
import test from "node:test";
import { DEFAULT_ARTIFACT_PROFILE } from "../src/contracts.js";
import { validateArtifactProfile } from "../src/artifact-checks.js";

test("default artifact profile validates against the runtime contract", async () => {
  const profile = JSON.parse(await readFile("artifact-profiles/default.json", "utf8")) as unknown;
  const issues = validateArtifactProfile("artifact-profiles/default.json", profile);

  assert.deepEqual(issues, []);
});

test("artifact profile validation rejects legacy durable-context artifact names", () => {
  const legacyProjectDoc = ["output", ["CHATGPT", "PROJECT", "DOC.md"].join("_")].join("/");
  const issues = validateArtifactProfile("artifact-profiles/default.json", {
    ...DEFAULT_ARTIFACT_PROFILE,
    finalOutputs: [
      "output/RAW_DATA_DIGEST.md",
      "output/CEO_BRIEF.md",
      legacyProjectDoc,
    ],
  });

  assert.ok(issues.some((issue) => issue.code === "artifact_profile.final_outputs"));
  assert.ok(issues.some((issue) => issue.code === "artifact_profile.old_artifact_name"));
});

test("artifact profile validation rejects nondeterministic synthesis mode", () => {
  const issues = validateArtifactProfile("artifact-profiles/default.json", {
    ...DEFAULT_ARTIFACT_PROFILE,
    synthesisMode: "model",
  });

  assert.ok(issues.some((issue) => issue.code === "artifact_profile.invalid"));
});
