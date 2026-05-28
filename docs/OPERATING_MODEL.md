# Operating Model

Research Lab is a local runtime around a run folder. The filesystem is the source of truth.

## Runtime Surfaces

| Surface | Role |
| --- | --- |
| `00-brief.md` | Human-readable decision, scope, lane table, source pack, budgets, and stop conditions |
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
3. `output/CHATGPT_PROJECT_DOC.md`

Raw lane files remain evidence inputs. Final artifacts are deterministic outputs from checked raw files.

## Non-Goals

- No hidden background process.
- No database.
- No cloud infrastructure.
- No web app.
- No autonomous browsing.
- No generic agent framework.
- No fake benchmarks or fake telemetry.
