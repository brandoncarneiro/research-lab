# Operating Model

Research Lab is a local runtime around a run folder. The filesystem is the source of truth.

## Runtime Surfaces

| Surface | Role |
| --- | --- |
| `00-brief.md` | Human-readable decision, scope, lane table, source pack, budgets, and stop conditions |
| `artifact-profiles/default.json` | Default final/extracted artifact contract used by synthesis and preflight |
| `run.json` | Run lifecycle state, deterministic run ID, max concurrency, artifact paths, usage totals |
| `lanes/*.json` | Lane lifecycle state, executor, provider/model label, attempts, usage, validation state |
| `raw/*.md` | Source-grounded lane artifacts; one lane writes or owns one raw file |
| `extracted/*.md` | Deterministic intermediate extraction from raw lanes |
| `output/*.md` | Final artifact contract: digest, decision brief, durable project doc |
| `logs/*.jsonl` | Append-only run and lane event logs |
| `metrics/token-cost-summary.json` | Per-lane and run token/cost summary |
| `validation/report.json` | Validation result and issue list |

## Lifecycle

1. `research-lab run <run-dir>` reads the brief and lane manifests.
2. The runner creates or refreshes `run.json`.
3. Lanes execute with bounded concurrency.
4. Each lane completes, blocks, or fails with timestamps, attempt metadata, and usage.
5. `research-lab synthesize <run-dir>` reads completed raw lanes and writes extracted files plus exactly three final artifacts.
6. `research-lab validate <run-dir>` checks manifests, logs, metrics, citation references, required artifacts, output count, and concurrency.
7. `research-lab status <run-dir>` prints the current state.

## Executors

- `artifact`: validates a raw lane artifact already present on disk.
- `fixture`: copies a checked local fixture into the lane raw path; used for reproducible examples and tests.
- `command`: runs a local command that must write the lane raw path.

The runtime does not claim that fixture or command lanes are model-backed. Provider/model fields are labels for accounting and audit.

## Concurrency

`maxConcurrency` is stored in `run.json`. The runner starts at most that many lane executions at once. Validation reconstructs active lane counts from JSONL events and fails if observed concurrency exceeds the manifest.

## Parent-Only Synthesis

Synthesis is a separate command. It reads raw lane files after lane execution and writes:

1. `output/RAW_DATA_DIGEST.md`
2. `output/CEO_BRIEF.md`
3. `output/PROJECT_CONTEXT.md`

Raw lane files remain evidence inputs. Final artifacts are deterministic outputs from checked raw files.

Synthesis is mixed only in the sense that lane inputs may come from different executors. The synthesis command itself is deterministic TypeScript code: it parses Markdown sections and tables, normalizes source IDs, builds record/pattern/quantity/contradiction/negative-evidence IDs, writes extracted working notes, and renders the three final artifacts. It does not call a model provider, browse the web, scrape sources, or run background agents.

Model or provider use belongs at the lane boundary. If a project wants model-assisted research, configure a `command` lane that runs the approved local command and writes `raw/<lane>.md`; the resulting raw artifact is then validated and synthesized like any other lane output.

Validation confirms structural and evidence-reference coherence. It does not certify source truth, source completeness, legal sufficiency, or publication-grade expert review.

## Project Profiles Vs Artifact Profiles

Project profiles under `profiles/` set context: project name, decision taxonomy, source rules, backlog, first-run suggestions, and tool/session defaults. They may narrow scope or make evidence rules stricter, but they must not weaken the core research standard.

Artifact profiles under `artifact-profiles/` set output shape. The default profile requires the four extracted files plus exactly three final artifacts. Runtime constants, preflight, and tests validate that this default profile stays aligned with the code contract.

## Non-Goals

- No hidden background process.
- No database.
- No cloud infrastructure.
- No web app.
- No autonomous browsing.
- No generic agent framework.
- No fake benchmarks or fake telemetry.
