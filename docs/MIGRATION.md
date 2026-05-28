# Migration Notes

This repo used to be an instruction-heavy scaffold. It is now a small runtime.

## Removed

- `prompts/`
- `agents/`
- `docs/RESEARCH_AGENT_PACK_STANDARD.md`
- the legacy long-form synthesis template
- `profiles/example/PROMPT_OVERLAY.md`
- `examples/synthetic-roommate-chore-scan/`

## Replacement

Use run folders with:

```text
00-brief.md
lanes/*.json
raw/*.md
extracted/*.md
output/*.md
logs/*.jsonl
metrics/token-cost-summary.json
validation/report.json
run.json
```

Manual or model-assisted work can still happen, but it should enter the runtime as either:

- an `artifact` lane with a checked `raw/<lane>.md` file, or
- a `command` lane that writes `raw/<lane>.md`.

Public reproducible examples should use `fixture` lanes and label their cost as local-only.

## Artifact Rename

The durable context artifact was renamed from `CHATGPT_PROJECT_DOC.md` to `PROJECT_CONTEXT.md`. New runtime contracts, templates, examples, and validation expect `output/PROJECT_CONTEXT.md`.

## Command Mapping

Old manual workflow:

```text
create folders, paste supervisor instructions, run lanes manually, write synthesis manually
```

Runtime workflow:

```bash
research-lab run <run-dir> --max-concurrency N
research-lab synthesize <run-dir>
research-lab validate <run-dir>
research-lab status <run-dir>
```

The evidence standard did not loosen. Source IDs, confidence, contradictions, negative evidence, blocked-source logs, and raw-before-synthesis still apply.
