# Lane Output

Raw lane output is intermediate evidence only. It is not a final artifact, not a summary report, and not durable project context.

## Lane Name

{lane-name}

## Lane Mission

{mission}

## Lane Question

{specific lane question}

## Decision This Lane Informs

{decision implication}

## Project Profile

- Project: `{project-name}`
- Profile: `{profiles/{profile}/PROFILE.md}`
- Decision owner / audience: `{decision-owner-or-audience}`

## Status

- Status: `{not-started / in-progress / complete / blocked}`
- Overall confidence: `{high / medium / low}`
- Blockers: {none or explicit blocker}

## Tools Used

| Tool | Purpose | Notes |
| --- | --- | --- |
| {tool name} | {purpose} | {limits, failures, or relevant settings} |

## Search / Collection Log

Record enough process to make the lane auditable.

| Step | Query / URL / Actor | Purpose | Result | Follow-up |
| --- | --- | --- | --- | --- |
| {1} | {query/url/tool action} | {why} | {useful/weak/no signal/blocked} | {next step or none} |

## Blocked Sources

Record blocked sources and the exact reason. Do not bypass restrictions.

| Source | URL/reference | Attempted access method | Block reason | Rule triggered | Substitute source used | Confidence impact | Decision-quality impact | Follow-up |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| {source} | {url/reference} | {search/browser/API/listing/local extraction/other} | {captcha/paywall/login/robots/platform/API/tool unavailable/unapproved paid tool/other} | {tool policy or brief rule} | {yes/no + source ID if used} | {none/low/medium/high + why} | {yes/no + why} | {allowed next step or none} |

## Sources Checked

| Source ID | Source | URL/reference | Source type | Result | Confidence | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| S1 | {source name} | {url or local reference} | {primary/secondary/user-generated/scraped/inferred} | {useful/weak/no relevant evidence/blocked} | {high/medium/low} | {what it contributed or why it failed} |

Use stable lane-local Source IDs (`S1`, `S2`, `S3`). The parent synthesis may reconcile duplicate sources across lanes in `RAW_DATA_DIGEST.md`.

## Quantitative Signals

| Lane Signal ID | Metric | Value | Source ID | Population / corpus | Caveat |
| --- | --- | --- | --- | --- | --- |
| LQ1 | {metric} | {value} | S# | {population / corpus} | {caveat} |

## Key Evidence

### Evidence 1

- Claim type: `{FACT / INFERENCE / SPECULATION}`
- What we learned: {finding}
- Why it matters: {decision relevance}
- Decision that should change: {decision implication}
- Source(s): {source IDs and URLs}
- Source type: {primary/secondary/user-generated/scraped/inferred}
- Confidence: {high/medium/low}
- Limits: {what this does not prove}

## Exact Quotes / User Language

Use only short quotes and only when the exact wording matters. For reviews/comments, preserve natural user language.

| Language ID | Exact quote | Source ID | Surface / source context | Category | Profile signal field | Relevance | Confidence |
| --- | --- | --- | --- | --- | --- | --- | --- |
| L1 | "{short exact quote}" | S1 | {surface/source context} | {category} | {yes/no/unclear + reason} | {why it matters} | {high/medium/low} |

## Facts

- `FACT`: {claim}. Source: {S#}. Confidence: {high/medium/low}.

## Inferences

- `INFERENCE`: {inference}
  - Based on: {cited facts/source IDs}
  - Reasoning: {why the inference follows}
  - Confidence: {high/medium/low}
  - Limits: {what this does not prove}

## Speculation

- `SPECULATION`: {possibility}
  - Why plausible: {reason}
  - What would confirm/reject it: {needed evidence}
  - Confidence: low

## Contradictions

| Lane Contradiction ID | Contradiction | Source A | Source B | Stronger evidence | Still unresolved |
| --- | --- | --- | --- | --- | --- |
| LC1 | {conflict} | {S#} | {S#} | {assessment} | {gap} |

## Negative Evidence

List evidence that weakens the hypothesis or sources that did not show expected behavior.

| Lane Negative ID | What weakens the thesis | Source ID | Decision impact |
| --- | --- | --- | --- |
| LN1 | {negative or no-signal evidence} | S# | {why it matters} |

## What This Lane Proves

- {source-grounded conclusion, limited to this lane}

## What This Lane Does Not Prove

- {limit, uncertainty, or unsupported conclusion}

## Lane Decision Implication

If this lane is correct, `{project-name}` should:

- {specific action or decision change}

`{project-name}` should not yet:

- {action not justified by this lane alone}

## Open Questions

- {question}

## Source List

| Source ID | Source | URL/reference | Source type | Used for |
| --- | --- | --- | --- | --- |
| S1 | {source name} | {url/reference} | {source type} | {finding/quote/table} |

## Completion Checklist

- [ ] Lane question answered or blocker recorded
- [ ] Sources checked listed, including weak/no-signal sources
- [ ] Blocked sources listed with reasons
- [ ] Key evidence cited
- [ ] Quantitative signals listed or marked no material finding
- [ ] Exact user language captured where relevant
- [ ] Facts, inferences, and speculation separated
- [ ] Contradictions recorded
- [ ] Negative evidence recorded
- [ ] Confidence marked
- [ ] What this proves and does not prove stated
- [ ] Decision implication stated
