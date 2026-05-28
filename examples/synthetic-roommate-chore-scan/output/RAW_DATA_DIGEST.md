# Raw Data Digest: Synthetic Roommate Chore Coordination Problem Scan

> Synthetic example only. This digest demonstrates the Research Lab evidence layer. All sources, quotes, counts, records, and patterns are fictional and must not be treated as real research.

**Date:** 2026-01-15
**Research run:** `examples/synthetic-roommate-chore-scan/`
**Project:** Example Household Ops Project
**Project profile:** `profiles/example/PROFILE.md`

This is the evidence layer. `CEO_BRIEF.md` compresses this ledger into decision signal and should not be read as independent evidence.

## 1. Collection Scope

**Research question:** Does the synthetic evidence suggest roommate chore coordination is painful, recurring, and underserved enough to justify a small prototype?
**Date range:** fictional current-state snapshot
**Source count:** 5 synthetic sources checked
**Normalized record count:** 5
**Benchmark / data point count:** 4 synthetic quantitative signals
**Category / segment count:** 4
**Sources searched:** synthetic interview notes, synthetic forum-style snippets, synthetic substitute-comparison notes, synthetic support-style complaints, synthetic home-organization notes
**Sources not searched:** real public web, real reviews, real product pages, real forums, real interviews
**Known gaps:** no real source validation; no real competitor review; no willingness-to-pay evidence; no retention evidence; no market sizing

## 2. Source Index

| Source ID | Source | URL/path | Type | Date | Used for | Evidence quality | Bias / limitation |
| --- | --- | --- | --- | --- | --- | --- | --- |
| SYN-S1 | Synthetic roommate interview notes | Local synthetic fixture described in `raw/audience-problem-signal.md` | synthetic user-generated | 2026-01-15 | Reminder burden, fairness language | Medium for example mechanics | Fictional; not real users. |
| SYN-S2 | Synthetic forum-style snippets | Local synthetic fixture described in `raw/audience-problem-signal.md` | synthetic user-generated | 2026-01-15 | Rotation confusion, substitute decay | Medium for example mechanics | Fictional; may overrepresent frustration. |
| SYN-S3 | Synthetic substitute-comparison notes | Local synthetic fixture described in `raw/audience-problem-signal.md` | synthetic primary-like observation | 2026-01-15 | Alternative weakness, negative evidence | Medium for example mechanics | Fictional; no real product evaluation. |
| SYN-S4 | Synthetic support-style complaint log | Local synthetic fixture described in `raw/audience-problem-signal.md` | synthetic user-generated | 2026-01-15 | Reminder tone, reminder fatigue | Medium for example mechanics | Fictional; complaint-style corpus is biased toward problems. |
| SYN-S5 | Synthetic home-organization notes | Local synthetic fixture described in `raw/audience-problem-signal.md` | synthetic user-generated | 2026-01-15 | Negative boundary | Low | Fictional and only partly relevant. |

## 3. Method Notes

The parent synthesis reviewed one completed raw lane and normalized the fictional source set into records, quantitative signals, patterns, contradictions, negative evidence, and durable-context candidates. Every evidence item is synthetic. `FACT` means "directly stated inside the synthetic fixture," not real-world fact. `INFERENCE` means "reasonable within the fictional corpus." `SPECULATION` remains low confidence. Do not use this run for real product, market, pricing, or launch decisions.

## 4. Normalized Records

| Record ID | Category / segment | Source ID | Normalized observation | Data type | Decision relevance | Caveat |
| --- | --- | --- | --- | --- | --- | --- |
| R1 | Reminder burden | SYN-S1 | 5 of 8 fictional interview snippets mention one person having to remind others. | synthetic coded interview note | Supports reminder-burden problem shape. | Not real prevalence. |
| R2 | Fairness confusion | SYN-S2 | 7 of 12 fictional forum-style snippets mention rotation or fairness confusion. | synthetic coded forum snippet | Supports rotation and ownership as prototype scope. | Frustrated voices may be overrepresented. |
| R3 | Substitute weakness | SYN-S3 | Paper charts, group chats, spreadsheets, and generic task apps each have a repeated failure mode. | synthetic substitute comparison | Shows differentiation must be sharper than "track chores." | Fictional substitute analysis. |
| R4 | Reminder tone | SYN-S4 | 6 of 10 fictional support-style complaints mention reminder fatigue or tone. | synthetic support-style complaint | Makes reminder tone a validation question. | Complaint-style corpus is biased toward problems. |
| R5 | Non-chore household pain | SYN-S5 | Some synthetic notes center on groceries, clutter, and meal planning instead of chores. | synthetic no-signal note | Prevents overgeneralizing the category. | Low relevance to chore-specific workflow. |

## 5. Quantitative Signal

| Signal ID | Metric | Value | Source ID | Population / corpus | Caveat |
| --- | --- | --- | --- | --- | --- |
| Q1 | Fictional interview snippets mentioning reminder burden | 5 of 8 | SYN-S1 | Synthetic interview-note fixture | Demonstration count only. |
| Q2 | Fictional forum snippets mentioning fairness or rotation confusion | 7 of 12 | SYN-S2 | Synthetic forum-style fixture | Demonstration count only. |
| Q3 | Substitute types with at least one repeated failure mode | 4 of 5 | SYN-S3 | Synthetic substitute-comparison fixture | Demonstration count only. |
| Q4 | Fictional support-style complaints involving reminder fatigue | 6 of 10 | SYN-S4 | Synthetic complaint fixture | Demonstration count only. |

## 6. Raw User / Market Language

### Reminder Burden

- `SYN-S1`: "I hate being the person who has to remind everyone." - Shows social friction, not just task tracking.

### Substitute Decay

- `SYN-S2`: "The chart works for two weeks, then nobody knows whose turn it is." - Points to manual systems decaying after initial setup.

### Reminder Tone

- `SYN-S4`: "A reminder is fine if it does not make me feel parented." - Makes tone and control part of the prototype risk.

### Negative Boundary

- `SYN-S5`: "Our real problem is groceries, not chores." - Shows household coordination pain does not always map to chores.

## 7. Pattern Library

| Pattern ID | Pattern | Signal | Evidence IDs | Strength | Decision relevance | Caveat |
| --- | --- | --- | --- | --- | --- | --- |
| P1 | Chore pain clusters around fairness and follow-through. | INFERENCE | R1, R2, Q1, Q2 | Medium | Prototype should focus on ownership and rotation. | Synthetic only. |
| P2 | Substitutes decay because they need social enforcement. | INFERENCE | R3, SYN-S3 | Medium | Product value must reduce coordination work. | Needs real substitute validation. |
| P3 | Reminder tone is part of the product surface. | INFERENCE | R4, Q4, C1 | Medium | Reminder defaults should be tested carefully. | Synthetic only. |

## 8. Domain / Market / Competitor Observations

No real competitor or market observations. The synthetic substitute set suggests a useful framing: the fictional problem is not "people lack task tools"; it is "shared households struggle to keep ownership, rotation, and reminders socially acceptable over time." This framing is an example inference only.

## 9. Contradictions

| Contradiction ID | Contradiction | Evidence A | Evidence B | Current interpretation | Decision impact |
| --- | --- | --- | --- | --- | --- |
| C1 | Some synthetic users want automatic reminders; others dislike reminders that feel controlling. | SYN-S1, SYN-S4 | SYN-S4 | Reminder usefulness depends on tone, opt-in control, and household norms. | Prototype reminders should be configurable and non-punitive. |
| C2 | Generic task apps can represent recurring tasks, but synthetic user language still reports fairness disputes. | SYN-S3 | SYN-S1, SYN-S2 | Basic recurring-task support may not solve shared accountability. | Do not position around task lists; test fairness and rotation. |

## 10. Negative Evidence

| Negative ID | What weakens the thesis | Evidence ID | Decision impact |
| --- | --- | --- | --- |
| N1 | Some synthetic household-management pain is about groceries, clutter, or meal planning rather than chores. | SYN-S5, R5 | The product should not assume all shared-household coordination problems are chore problems. |
| N2 | Generic task apps can represent recurring tasks in the synthetic substitute fixture. | SYN-S3, R3 | Differentiation must come from household fairness, rotation, and tone, not basic task creation. |
| N3 | Public web validation was intentionally blocked. | blocked-source log | No real-world launch, pricing, or market-size decision should be made from this example. |

## 11. Blocked / Weak Sources

| Source | Attempt | Block reason / weakness | Substitute | Confidence impact |
| --- | --- | --- | --- | --- |
| Real public web sources | Not accessed | Out of scope for this synthetic example. | None | Caps confidence at medium for example mechanics and low for real-world decisions. |
| Synthetic home-organization notes | Reviewed as boundary check | Weak relevance to chore-specific workflow. | None | Adds useful negative boundary but low direct confidence. |

## 12. Source-To-Evidence Map

| Source ID | Records | Quantitative signals | Patterns | Contradictions / negative evidence |
| --- | --- | --- | --- | --- |
| SYN-S1 | R1 | Q1 | P1 | C1 |
| SYN-S2 | R2 | Q2 | P1, P2 | C2 |
| SYN-S3 | R3 | Q3 | P2 | C2, N2 |
| SYN-S4 | R4 | Q4 | P3 | C1 |
| SYN-S5 | R5 | none | none | N1 |

## 13. Confidence Notes

Strongest within-example signal: the fictional corpus consistently points to ownership, fairness, rotation, and reminder tone. Medium confidence is appropriate for demonstrating workflow mechanics because multiple synthetic source types align. Low confidence is required for any real-world claim because there are no real sources, real users, real competitors, or real adoption data. The contradiction around reminders should remain visible because it changes prototype design.

## 14. Candidate Project Context

- Synthetic example finding: In the fictional corpus, chore coordination pain is framed as fairness and follow-through, not basic task capture. Evidence anchors: P1, SYN-S1, SYN-S2.
- Synthetic example finding: Reminder tone is a validation risk. Evidence anchors: P3, C1, SYN-S4.
- Do not add as real context: market demand, willingness to pay, retention, competitive whitespace, or prevalence.
