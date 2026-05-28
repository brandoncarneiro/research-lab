# Incident Review First Run

Use this profile when the first decision is whether the available evidence supports a bounded incident explanation.

## Suggested Lane Table

| Lane | Mission | Lane question | Target sources | Required output file | Evidence threshold |
| --- | --- | --- | --- | --- | --- |
| Timeline reconciliation | Establish event order | What happened, and in what order? | Timeline sources, transcripts, official reports | `raw/timeline-reconciliation.md` | Each material event has a source ID |
| Causal chain | Separate direct causes from contributing factors | What evidence supports the causal chain? | Official report, logs, direct statements | `raw/causal-chain.md` | Facts and inferences are separated |
| Recovery actions | Capture response and mitigation | What actions changed the incident trajectory? | Recovery logs, official summaries | `raw/recovery-actions.md` | Actions are tied to sources |
| Counterevidence | Preserve alternate explanations | What weakens or contradicts the dominant story? | Contradictory sources, missing-source notes | `raw/counterevidence.md` | Negative evidence and contradictions are recorded |

## Acceptance Gate

- Each lane cites source IDs.
- Speculation is low confidence.
- The final brief states what is supported, what is unresolved, and what must not be claimed yet.
