# Extracted Tables: Apollo 13 oxygen tank failure: source-bounded incident review

## Quantitative Signals

| Signal ID | Lane | Metric | Value | Source ID | Population / corpus | Caveat |
| --- | --- | --- | --- | --- | --- | --- |
| Q1 | timeline-reconciliation | Source-pack timeline anchors | 3 | S1, S2, S3 | checked example source pack | not a complete mission timeline |
| Q2 | timeline-reconciliation | Runtime lane count represented | 1 | S2 | this lane only | runtime metric, not historical evidence |
| Q3 | failure-chain | Causal layers separated | 3 | S4, S2, S3 | checked lane | conceptual count, not a NASA metric |
| Q4 | operational-recovery | Recovery evidence layers | 3 | S2, S3, S4 | checked lane | evidence-layer count |
| Q5 | mission-objective-counterevidence | Planned-vs-actual source classes | 2 | S1, S2 | checked lane | source-role count |

## Lane Runtime

| Lane | Status | Provider | Model | Total tokens | Estimated cost USD |
| --- | --- | --- | --- | ---: | ---: |
| timeline-reconciliation | complete | local | fixture | 3424 | 0.000000 |
| failure-chain | complete | local | fixture | 3396 | 0.000000 |
| operational-recovery | complete | local | fixture | 3364 | 0.000000 |
| mission-objective-counterevidence | complete | local | fixture | 3256 | 0.000000 |
