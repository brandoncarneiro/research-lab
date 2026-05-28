# Research Brief

## Project

**Project name:** {project name}

**Project profile path:** `profiles/{profile}/PROFILE.md`

**Decision owner / audience:** {name / role / audience}

**Durable context destination:** {durable context store / internal wiki / none / other}

## Research Title

{title}

## Date

{YYYY-MM-DD}

## Run Slug

`research/runs/{YYYY-MM-DD-topic}/`

## One-Line Decision

This research exists to decide: {specific decision that will change based on evidence}

## Core Research Question

{single clear question the run must answer}

## Decision Gates

Use profile-specific gates when the active profile supplies them. Otherwise define the decision gates here.

| Gate | Question | Evidence needed | Pass / fail / unclear standard |
| --- | --- | --- | --- |
| {gate-name} | {decision question} | {source type or evidence threshold} | {what would count as enough} |

## Why This Matters

{why this research matters now, what risk it reduces, and why it is worth spending research time on}

## Source Context To Read First

Internal project/profile docs are context and hypotheses, not external proof. List every source doc used.

- {profile/source doc}

Source context may come from the active profile, current project docs, local files, Google Drive exports, user-provided docs, pasted excerpts in this brief, or deliberately copied files under `context/`.

Required source context must be available before synthesis. If required source context is missing, stop and report exactly what is missing and where Codex looked. Do not hallucinate missing context.

## Scope

Include:

- Audience / population: {who this run covers}
- Domain / market / category: {boundaries}
- Geography: {profile default or explicit scope}
- Time window: {current / past X months / historical}
- Competitors / comparables / sources: {specific names}
- Source types: {reviews, app listings, official pages, reports, legal sources, docs, papers, benchmarks, etc.}

## Out Of Scope

Exclude:

- {explicit exclusion}

Write exclusions aggressively. This prevents research sprawl.

## Evidence Lanes

Each lane must be independent enough to run as a bounded runtime unit.

Set `--max-concurrency` for runtime execution. Keep it low enough that source access, logs, and review stay inspectable.

| Lane | Mission | Lane question | Target sources | Required output file | Evidence threshold |
| --- | --- | --- | --- | --- | --- |
| {lane-name} | {lane mission} | {specific question} | {source targets} | `raw/{lane-name}.md` | {minimum evidence required} |

## File Ownership

| Path | Owner | Rule |
| --- | --- | --- |
| `00-brief.md` | Operator | Defines the research decision, scope, lanes, and stop conditions. |
| `lanes/{lane-name}.json` | Runtime / operator | Defines executor, provider/model label, retry state, and validation state. |
| `raw/{lane-name}.md` | Assigned lane executor | The lane owns only this raw file. |
| `extracted/` | Runtime synthesis | Written after required raw lane files exist. |
| `output/` | Runtime synthesis | Final artifacts written only after raw evidence exists. |

Lane executors must not mutate files outside their assigned raw path unless the brief explicitly scopes a command executor to do so.

## Target Sources

Prioritize primary and direct evidence sources first.

### Primary Sources

- {official source, app listing, pricing page, docs, public report, law/regulation, paper, API, source-owned page}

### Direct User / Audience / Practitioner Language

- {reviews, Reddit, YouTube comments, public social comments, forums, interviews, transcripts}

### Secondary Sources

- {news, analysis, market reports, interviews, explainers}

### Sources To Avoid Or Treat Carefully

- {source type}: {why it is weak or risky}

## Tool Menu

Use `docs/TOOL_MENU.md` as the canonical allowed, conditional, optional paid, and banned tool policy.

Default posture for this run:

- Start with public web/search, browser/open URL inspection, official APIs/listings/source-owned pages, local/cheap extraction, robots.txt/sitemap preflight before crawl-style collection, and local file/repo writing inside the run folder.
- Treat conditional hosted extraction and optional paid fallbacks as unavailable unless this brief explicitly approves the tool, reason, cap, API/account setup, and stop condition.
- Do not use banned bypass, private-account, sending/posting, destructive, production, billing, or account-mutation tools.

Approved exceptions for this run:

- {none or exact tool, reason, cap, API/account setup, and stop condition}

## Research Budgets

Set limits so the run does not become endless.

- Maximum lanes: {number}
- Maximum concurrent lanes: {number}
- Maximum search/tool iterations per lane: {number}
- Minimum useful sources per lane: {number}
- Maximum runtime expectation: {rough bound, if useful}
- Stop if the last {number} searches return duplicate or low-signal sources.

## Required Raw Outputs

- `raw/[lane-name].md` for each lane

Each raw lane output must include:

- sources checked, including weak/no-signal sources
- blocked sources and why they were blocked
- exact user/source language when relevant
- facts
- inferences
- speculation
- contradictions
- negative evidence
- open questions
- source list
- confidence rating
- what this lane proves
- what this lane does not prove
- what decision should change if the lane is correct

Raw lane outputs are intermediate evidence only. They are not final artifacts, and they must not become alternate reports.

## Required Extracted Outputs

- `extracted/findings.md`
- `extracted/contradictions.md`
- `extracted/tables.md`
- `extracted/open-questions.md`

Extracted outputs are intermediate working notes only. They support `RAW_DATA_DIGEST.md`; they are not final artifacts.

## Required Final Outputs

- `output/CEO_BRIEF.md`
- `output/RAW_DATA_DIGEST.md`
- `output/PROJECT_CONTEXT.md`

Use `docs/RESEARCH_STANDARD.md` for artifact roles and evidence rules. Exactly these three final artifacts are required. Do not create duplicate summaries, alternate reports, or extra synthesis documents.

Raw evidence must be saved before synthesis. `output/RAW_DATA_DIGEST.md` must be created before `output/CEO_BRIEF.md`. `output/CEO_BRIEF.md` must synthesize from the normalized data and evidence in `output/RAW_DATA_DIGEST.md`.

## Citation Rules

Follow `docs/RESEARCH_STANDARD.md`. For this run, explicitly preserve Source IDs, final evidence IDs (`S#`, `Q#`, `P#`, `C#`, `N#`), source type, confidence, contradictions, negative evidence, blocked/weak/no-signal sources, and `FACT` / `INFERENCE` / `SPECULATION` separation. Internal project/profile source docs are context and hypotheses, not external proof.

## Stop Conditions

Stop when one of these is true:

1. Each lane meets its evidence threshold.
2. The evidence is too weak to support the decision, and that weakness itself is the finding.
3. Required tools or sources are unavailable.
4. The run is drifting outside scope.
5. The same findings are repeating and no new decision-grade evidence is emerging.

If evidence is insufficient, write the blocker plainly. Do not compensate with confident prose.

## Final Consistency Check

Before accepting final artifacts:

- [ ] Active project profile was read
- [ ] Exactly three final artifacts exist by default: `CEO_BRIEF.md`, `RAW_DATA_DIGEST.md`, and `PROJECT_CONTEXT.md`
- [ ] No duplicate summaries, alternate reports, or extra synthesis docs were created by default
- [ ] `run.json`, `lanes/*.json`, `logs/*.jsonl`, `metrics/token-cost-summary.json`, and `validation/report.json` exist
- [ ] Every required raw lane file exists or an explicit blocker is recorded
- [ ] Final artifacts pass `docs/RESEARCH_STANDARD.md`
- [ ] `PROJECT_CONTEXT.md` excludes weak, temporary, or speculative findings

## Final Answer Requirements

The three final artifacts together must answer:

- What did we learn?
- What normalized records and data points exist?
- What is the signal?
- What patterns, categories, or segments matter?
- What can we say with high, medium, or low confidence?
- What decision should change?
- What should the project do now?
- What should the project not do yet?
- What remains unresolved that affects decision quality?
- What should the next research run be?
