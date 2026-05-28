# Runbook

Use this runbook for local research runs.

## Start From An Existing Example

```bash
npm install
npm run example:run
npm run example:status
```

Inspect:

```text
examples/apollo-13-oxygen-tank-review/run.json
examples/apollo-13-oxygen-tank-review/lanes/*.json
examples/apollo-13-oxygen-tank-review/logs/*.jsonl
examples/apollo-13-oxygen-tank-review/metrics/token-cost-summary.json
examples/apollo-13-oxygen-tank-review/validation/report.json
```

## Create A New Run

```bash
mkdir -p research/runs/YYYY-MM-DD-topic/{lanes,raw,extracted,output,logs,metrics,validation}
cp templates/00-brief.md research/runs/YYYY-MM-DD-topic/00-brief.md
```

Fill the brief. At minimum, include:

- decision affected
- scope and out-of-scope
- source context
- evidence lane table
- required raw output file per lane
- tool/source limits
- stop conditions

Create one `lanes/<lane-id>.json` file per lane.

For a human/model-written lane that will appear in `raw/<lane-id>.md`:

```json
{
  "executor": { "type": "artifact" },
  "provider": "external",
  "model": "manual"
}
```

For a deterministic local command:

```json
{
  "executor": {
    "type": "command",
    "command": "node",
    "args": ["scripts/my-lane-worker.js"],
    "timeoutMs": 30000
  },
  "provider": "local-command",
  "model": "custom"
}
```

## Execute

```bash
npm run research-lab -- run research/runs/YYYY-MM-DD-topic --max-concurrency 4
npm run research-lab -- synthesize research/runs/YYYY-MM-DD-topic
npm run research-lab -- validate research/runs/YYYY-MM-DD-topic
npm run research-lab -- status research/runs/YYYY-MM-DD-topic
```

Use `--force` only when intentionally refreshing runtime state from the current brief and lane manifests.

## Validation Expectations

A standard completed run should have:

- one `run.json`
- one lane manifest per lane under `lanes/`
- one raw artifact per required lane under `raw/`
- one run log plus one lane log per lane under `logs/`
- `metrics/token-cost-summary.json`
- four extracted files under `extracted/`
- exactly three final files under `output/`
- `validation/report.json`

If validation fails, fix the artifact or manifest. Do not paper over failures with prose.

## Stop Conditions

Stop when:

- required sources are unavailable
- a source requires a banned action
- a lane blocks and the brief does not approve partial synthesis
- validation fails on unresolved evidence references
- evidence is too weak for the decision

Record blockers in lane state and raw lane artifacts. Do not invent missing evidence.
