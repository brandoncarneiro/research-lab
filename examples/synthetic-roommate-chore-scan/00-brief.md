# Research Brief

> Synthetic example only. This run demonstrates Research Lab artifact shape and evidence discipline. All sources, quotes, counts, and observations are fictional and labeled synthetic.

## Project

**Project name:** Example Household Ops Project

**Project profile path:** `profiles/example/PROFILE.md`

**Decision owner / audience:** Fictional product owner evaluating whether to prototype

**Durable context destination:** Example project knowledge base

## Research Title

Synthetic Roommate Chore Coordination Problem Scan

## Date

2026-01-15

## Run Slug

`examples/synthetic-roommate-chore-scan/`

## One-Line Decision

This research exists to decide whether a fictional team should build a lightweight prototype for roommate chore coordination or keep exploring other household-management problems.

## Core Research Question

Does the synthetic evidence suggest roommate chore coordination is painful, recurring, and underserved enough to justify a small prototype?

## Decision Gates

| Gate | Question | Evidence needed | Pass / fail / unclear standard |
| --- | --- | --- | --- |
| Problem frequency | Do roommate households report repeated chore-coordination breakdowns? | Synthetic interview and forum-style evidence with multiple recurring examples | Pass if at least 3 synthetic source groups show recurring pain; unclear if evidence is isolated |
| Alternative weakness | Are current substitutes visibly imperfect? | Synthetic notes on paper charts, group chats, shared spreadsheets, and generic task apps | Pass if substitutes fail for accountability, fairness, or follow-through |
| Trust boundary | Can a prototype avoid sensitive data or high-risk workflows? | Synthetic user language and risk notes | Pass if the workflow can stay lightweight, voluntary, and household-local |
| Prototype scope | Is there a narrow testable first version? | Synthetic pattern evidence showing one compact workflow | Pass if one prototype can test assignment, reminders, and rotation fairness |

## Why This Matters

The fictional team has several possible household-management ideas. This run checks whether chore coordination has enough decision-grade signal to deserve prototype time without overclaiming market size, willingness to pay, or real-world demand.

## Source Context To Read First

- `profiles/example/PROFILE.md`
- `profiles/example/FIRST_RUN.md`
- This run brief

Profile docs and this brief are context only. They are not external proof.

## Scope

Include:

- Audience / population: roommate households, shared apartments, and small shared homes in synthetic examples
- Domain / market / category: household coordination and recurring chores
- Geography: not applicable for this synthetic example
- Time window: fictional current-state snapshot
- Competitors / comparables / sources: generic substitutes only, such as paper charts, group chat reminders, shared spreadsheets, generic task apps, and house meetings
- Source types: synthetic interview notes, synthetic forum-style snippets, synthetic substitute-comparison notes, synthetic support-style complaints

## Out Of Scope

Exclude:

- Real companies, real product names, real URLs, real users, real reviews, and real market sizing
- Household finance, rent splitting, utilities, legal disputes, or roommate matching
- Any recommendation to launch, price, market, or fundraise based on this synthetic run

## Evidence Lanes

| Lane | Mission | Lane question | Target sources | Required output file | Evidence threshold |
| --- | --- | --- | --- | --- | --- |
| audience-problem-signal | Test whether the problem appears recurring, specific, and prototype-shaped in synthetic source material. | What synthetic evidence shows roommate chore coordination is painful, what substitutes fail, and what first prototype should test? | Synthetic interview notes, synthetic forum-style snippets, synthetic substitute notes, synthetic no-signal checks | `raw/audience-problem-signal.md` | At least 4 labeled synthetic sources, including one weak or negative source and one contradiction |

## File Ownership

| Path | Owner | Rule |
| --- | --- | --- |
| `00-brief.md` | Parent Codex | Parent creates/updates the brief. |
| `raw/audience-problem-signal.md` | Assigned subagent | Subagent writes only this file. |
| `extracted/` | Parent Codex | Parent writes after the raw lane file exists. |
| `output/` | Parent Codex | Parent writes final artifacts only after raw evidence exists. |

Child subagents must not spawn nested subagents.

## Target Sources

Prioritize synthetic source fixtures first. No public web collection is needed for this example.

### Primary Sources

- `SYN-S1`: Synthetic interview-note fixture
- `SYN-S2`: Synthetic forum-style snippet fixture
- `SYN-S3`: Synthetic substitute-comparison fixture

### Direct User / Audience / Practitioner Language

- `SYN-S1`: Synthetic interview excerpts
- `SYN-S2`: Synthetic forum-style language
- `SYN-S4`: Synthetic support-style complaint log

### Secondary Sources

- None for this example.

### Sources To Avoid Or Treat Carefully

- Real public web sources: excluded so the example cannot be mistaken for actual research.
- Synthetic numeric counts: useful only to demonstrate normalization; not real prevalence evidence.

## Tool Menu

Allowed by default:

- Local file inspection inside this example run
- No-network synthesis from the included synthetic fixtures

Conditional tools requiring explicit approval in this brief:

- None

Optional paid fallbacks requiring explicit approval, API/account setup, caps, and stop conditions:

- None

Disallowed by default:

- Public web collection
- Scraping
- Login-gated sources
- Paid tools
- Posting, sending, destructive, production, billing, or private account tools

Approved exceptions for this run:

- None

## Research Budgets

- Maximum lanes: 1
- Maximum concurrent subagents: 1
- Maximum search/tool iterations per lane: 6 synthetic fixture checks
- Minimum useful sources per lane: 4 synthetic sources
- Maximum runtime expectation: 20 minutes
- Stop if the lane cannot preserve synthetic labeling or if any real source is accidentally introduced.

## Required Raw Outputs

- `raw/audience-problem-signal.md`

Each raw lane output must include:

- sources checked, including weak/no-signal sources
- blocked sources and why they were blocked
- exact user/source language when relevant
- facts
- inferences
- speculation
- contradictions
- negative evidence
- source list
- confidence rating
- what this lane proves
- what this lane does not prove
- what decision should change if the lane is correct

## Required Extracted Outputs

- `extracted/findings.md`
- `extracted/contradictions.md`
- `extracted/tables.md`
- `extracted/open-questions.md`

## Required Final Outputs

- `output/RAW_DATA_DIGEST.md`
- `output/CEO_BRIEF.md`
- `output/CHATGPT_PROJECT_DOC.md`

Raw evidence must be saved before synthesis. `output/RAW_DATA_DIGEST.md` must be created before `output/CEO_BRIEF.md`. `output/CEO_BRIEF.md` must synthesize from the normalized data and evidence in `output/RAW_DATA_DIGEST.md`.
