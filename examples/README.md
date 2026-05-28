# Examples

Examples are checked, reproducible run folders. They should demonstrate the runtime, not marketing claims.

## Included Runs

| Run | Purpose | Notes |
| --- | --- | --- |
| `apollo-13-oxygen-tank-review/` | Public-domain NASA incident-review example with four lanes, manifests, JSONL logs, metrics, synthesis, validation, and a status screenshot. | Uses local fixture execution from a checked source pack. No live web collection and no provider cost. |

## Run The Example

```bash
npm run example:run
npm run example:status
```

Then inspect:

```text
examples/apollo-13-oxygen-tank-review/run.json
examples/apollo-13-oxygen-tank-review/logs/run.jsonl
examples/apollo-13-oxygen-tank-review/metrics/token-cost-summary.json
examples/apollo-13-oxygen-tank-review/validation/report.json
examples/apollo-13-oxygen-tank-review/screenshots/status.svg
```
