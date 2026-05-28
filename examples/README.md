# Examples

This directory contains deliberately synthetic Research Lab runs prepared for public inspection.

These examples demonstrate workflow shape, artifact quality, evidence labeling, and confidence discipline. They are not real market research, do not cite real companies, and should not be used as evidence for business decisions.

## Included Runs

| Run | Purpose | Notes |
| --- | --- | --- |
| `synthetic-roommate-chore-scan/` | Shows a completed one-lane run from brief to raw evidence to final outputs. | All sources, quotes, counts, and company-like references are fictional and labeled synthetic. |

## How To Read An Example

Start with `00-brief.md`, then inspect the assigned raw lane under `raw/`, the parent extraction notes under `extracted/`, and the final artifacts under `output/`.

The important pattern is:

1. The brief defines the decision, scope, evidence lane, tool posture, and stop conditions.
2. The raw lane records source checks, blocked or weak sources, facts, inferences, speculation, contradictions, negative evidence, and confidence.
3. The digest normalizes evidence into a source-indexed ledger.
4. The brief compresses the ledger into a decision recommendation.
5. The project doc keeps only stable durable context and explicit do-not-overclaim rules.
