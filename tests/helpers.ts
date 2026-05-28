import { mkdir, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { mkdtemp } from "node:fs/promises";

export async function makeRunFixture(): Promise<string> {
  const runDir = await mkdtemp(join(tmpdir(), "research-lab-test-"));
  await mkdir(join(runDir, "lanes"), { recursive: true });
  await mkdir(join(runDir, "fixtures"), { recursive: true });
  await writeFile(join(runDir, "00-brief.md"), briefText(), "utf8");
  await writeFile(join(runDir, "fixtures/timeline.md"), rawLaneText("Timeline", "timeline", "S1"), "utf8");
  await writeFile(join(runDir, "fixtures/failure.md"), rawLaneText("Failure", "failure", "S1"), "utf8");
  await writeFile(join(runDir, "lanes/timeline.json"), JSON.stringify({
    executor: { type: "fixture", inputPath: "fixtures/timeline.md" },
    provider: "local",
    model: "fixture",
  }), "utf8");
  await writeFile(join(runDir, "lanes/failure.json"), JSON.stringify({
    executor: { type: "fixture", inputPath: "fixtures/failure.md" },
    provider: "local",
    model: "fixture",
  }), "utf8");
  return runDir;
}

export function briefText(): string {
  return `# Test Run

## Project

**Project profile path:** \`profiles/example/PROFILE.md\`

## Research Title

Test source-grounded run

## Evidence Lanes

| Lane | Mission | Lane question | Target sources | Required output file | Evidence threshold |
| --- | --- | --- | --- | --- | --- |
| Timeline | Check event order | What happened first? | Fixture source | \`raw/timeline.md\` | One cited fact |
| Failure | Check causal chain | What caused the issue? | Fixture source | \`raw/failure.md\` | One cited fact |
`;
}

export function rawLaneText(title = "Timeline", laneId = "timeline", sourceId = "S1"): string {
  return `# Lane Output: ${title}

## Lane Name

${laneId}

## Lane Mission

Collect bounded evidence.

## Lane Question

What does the fixture prove?

## Status

- Status: complete
- Overall confidence: high
- Blockers: none

## Sources Checked

| Source ID | Source | URL/reference | Source type | Result | Confidence | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| ${sourceId} | Public source ${laneId} | source-pack/${laneId}.md | primary | useful | high | Supports ${laneId} |

## Blocked Sources

| Source | URL/reference | Attempted access method | Block reason | Rule triggered | Substitute source used | Confidence impact | Decision-quality impact | Follow-up |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| No material finding | n/a | n/a | none | n/a | n/a | none | no | none |

## Quantitative Signals

| Lane Signal ID | Metric | Value | Source ID | Population / corpus | Caveat |
| --- | --- | --- | --- | --- | --- |
| LQ1 | fixture count | 1 | ${sourceId} | fixture | local test only |

## Facts

- \`FACT\`: ${title} fixture contains one useful primary-source claim. Source: ${sourceId}. Confidence: high.

## Inferences

- \`INFERENCE\`: The lane has enough evidence for deterministic synthesis.
  - Based on: ${sourceId}
  - Reasoning: the cited source is primary in this fixture
  - Confidence: medium
  - Limits: test fixture only

## Speculation

- \`SPECULATION\`: A fuller corpus could change the conclusion.
  - Why plausible: this is a fixture
  - What would confirm/reject it: more sources
  - Confidence: low

## Contradictions

| Lane Contradiction ID | Contradiction | Source A | Source B | Stronger evidence | Still unresolved |
| --- | --- | --- | --- | --- | --- |
| LC1 | Fixture has a narrow scope but a complete lane contract | ${sourceId} | ${sourceId} | scope note | broader corpus |

## Negative Evidence

| Lane Negative ID | What weakens the thesis | Source ID | Decision impact |
| --- | --- | --- | --- |
| LN1 | Fixture is not a broad corpus | ${sourceId} | avoid overclaiming |

## What This Lane Proves

- The ${laneId} lane can produce a cited raw artifact from a managed fixture. Source: ${sourceId}.

## What This Lane Does Not Prove

- It does not prove external truth beyond the fixture. Source: ${sourceId}.

## Lane Decision Implication

- Keep the runtime bounded and source-grounded. Source: ${sourceId}.

## Open Questions

- What would a larger corpus change?

## Source List

| Source ID | Source | URL/reference | Source type | Used for |
| --- | --- | --- | --- | --- |
| ${sourceId} | Public source ${laneId} | source-pack/${laneId}.md | primary | finding |

## Completion Checklist

- [x] Lane question answered or blocker recorded
- [x] Sources checked listed, including weak/no-signal sources
- [x] Blocked sources listed with reasons
- [x] Key evidence cited
- [x] Quantitative signals listed or marked no material finding
- [x] Facts, inferences, and speculation separated
- [x] Contradictions recorded
- [x] Negative evidence recorded
- [x] Confidence marked
- [x] What this proves and does not prove stated
- [x] Decision implication stated
`;
}
