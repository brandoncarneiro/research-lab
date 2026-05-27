# Output Rules Template

Use this file to define the exact output requirements for this agent.

## Output Path

Write the lane output to:

```text
raw/{lane-name}.md
```

If the lane assignment specifies a different path inside the run folder, use the assigned path and record it in the output.

## Required Structure

Use `templates/lane-output.md` unless the supervisor provides a stricter format.

At minimum, include:

- Lane question.
- Decision this lane informs.
- Status and confidence.
- Tools used.
- Search or collection log.
- Sources checked.
- Key evidence.
- Exact quotes or user language where relevant.
- Facts.
- Inferences.
- Speculation.
- Contradictions.
- Negative evidence.
- What this proves.
- What this does not prove.
- Lane decision implication.
- Open questions.
- Source appendix.

## Facts, Inferences, And Speculation

Use these labels exactly:

- `FACT`: directly supported by cited evidence.
- `INFERENCE`: reasoned conclusion from cited facts.
- `SPECULATION`: plausible but not proven; usually `low` confidence.

Do not combine these categories in one bullet.

## Citation Requirements

Every factual claim needs:

- Source ID.
- URL or local source reference.
- Source type.
- Confidence.
- Short note on what the source directly supports.

For user language, preserve short exact wording when the wording itself matters. Do not invent quotes or normalize user language into polished prose.

## Confidence

Use:

- `high`: directly supported by strong primary evidence or repeated consistent user evidence.
- `medium`: supported, but limited by source quality, sample size, age, or ambiguity.
- `low`: weak, indirect, speculative, contradicted, or not well corroborated.

Do not use confident language for low-confidence evidence.

## Contradictions

Record contradictions with:

- Conflicting claims.
- Source IDs for each side.
- Which source is stronger and why.
- What remains unresolved.
- What follow-up would resolve it.

Do not smooth contradictions into a generic average.

## Negative Evidence

Record:

- Expected evidence that was not found.
- Sources checked that had no relevant signal.
- Claims that were weaker than expected.
- Evidence that cuts against the hypothesis.

Explain the decision implication of negative evidence.

## Decision Implication

Every output must answer:

- What project/profile decision does this affect?
- What should change if this lane is correct?
- What should not change yet?
- What evidence would change the recommendation?

## What This Proves / Does Not Prove

Separate:

- What the lane proves from cited evidence.
- What it suggests but does not prove.
- What remains unknown.
- What would require a different lane or follow-up run.

## Source Appendix

End with a source appendix table:

| Source ID | Source | URL/reference | Source type | Used for | Confidence |
| --- | --- | --- | --- | --- | --- |
| S1 | {source name} | {url/reference} | {primary/secondary/user-generated/scraped/inferred} | {finding/quote/table} | {high/medium/low} |
