# Research Brief

## Project

**Project name:** {project name}

**Project profile path:** `profiles/{profile}/PROFILE.md`

**Decision owner / audience:** {name / role / audience}

**Durable context destination:** {ChatGPT project / internal wiki / none / other}

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

Each lane must be independent enough for a Codex subagent to run in parallel.

Default max concurrent subagents: 6. If more than 6 lanes exist, run subagents in waves.

| Lane | Mission | Lane question | Target sources | Required output file | Evidence threshold |
| --- | --- | --- | --- | --- | --- |
| {lane-name} | {lane mission} | {specific question} | {source targets} | `raw/{lane-name}.md` | {minimum evidence required} |

## File Ownership

| Path | Owner | Rule |
| --- | --- | --- |
| `00-brief.md` | Parent Codex | Parent creates/updates the brief. |
| `raw/{lane-name}.md` | Assigned subagent | Subagent writes only this file. |
| `extracted/` | Parent Codex | Parent writes after required raw lane files exist. |
| `output/` | Parent Codex | Parent writes final artifacts only after raw evidence exists. |

Child subagents must not spawn nested subagents.

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

Allowed by default:

- Composio Search/browser or equivalent public web discovery
- Browser/open URL inspection of public pages
- Local/cheap extraction where possible
- Robots.txt and sitemap preflight before crawl-style collection
- Official APIs, official listings, and platform-owned/source-owned pages first
- Local file/repo writing inside the run folder

Conditional tools requiring explicit approval in this brief:

- Cloudflare Browser Run `/crawl`, `/markdown`, or `/json` after capped POC and explicit API setup
- Hosted browser/extractor tools with billable usage

Optional paid fallbacks requiring explicit approval, API/account setup, caps, and stop conditions:

- Firecrawl (optional paid fallback)
- Apify (optional paid fallback)
- SerpAPI (optional paid fallback)
- Tavily (optional paid fallback)
- Exa (optional paid fallback)

Disallowed by default:

- captcha bypass
- paywall bypass
- login bypass
- stealth scraping
- residential proxies
- mass social scraping
- LinkedIn scraping
- scraping private or personal accounts
- Gmail
- Calendar
- Slack
- Supabase
- Vercel
- Stripe
- production databases
- billing tools
- posting tools
- sending tools
- destructive tools
- private account actions

Approved exceptions for this run:

- {none or exact tool, reason, cap, API/account setup, and stop condition}

## Research Budgets

Set limits so the run does not become endless.

- Maximum lanes: {number}
- Maximum concurrent subagents: 6 unless the project owner explicitly lowers it
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
- `output/CHATGPT_PROJECT_DOC.md`

Exactly these three final artifacts are required by default. Do not create duplicate summaries, alternate reports, or extra synthesis documents unless the project owner explicitly asks for them.

`output/MASTER_RESEARCH.md` is legacy/optional only. Do not create it by default, and never treat it as the primary artifact.

Raw evidence must be saved before synthesis. `output/RAW_DATA_DIGEST.md` must be created before `output/CEO_BRIEF.md`. `output/CEO_BRIEF.md` must synthesize from the normalized data and evidence in `output/RAW_DATA_DIGEST.md`.

## Final Artifact Roles

- `RAW_DATA_DIGEST.md`: evidence layer. It contains collection scope, source index, method notes, normalized records, quantitative signals, raw language, patterns, domain/market/competitor observations when relevant, contradictions, negative evidence, blocked/weak sources, confidence notes, source-to-evidence mapping, and candidate project context.
- `CEO_BRIEF.md`: decision-facing signal layer. Target 1-2 pages. It states what was learned, what normalized data exists, what signal emerged, what categories or segments matter, what findings carry high/medium/low confidence, what decision changes, and what happens next.
- `CHATGPT_PROJECT_DOC.md`: durable project-context capsule. It is not a report and not a raw dump. It includes only stable findings, durable caveats, source anchors, decisions affected, do-not-overclaim rules, do-not-add-to-context rules, and a revisit trigger.

## Citation Rules

- Cite every factual claim with a Source ID.
- Assign every source a stable Source ID.
- Use the evidence ID convention: Sources `S1`, `S2`, `S3`; Quantitative signals `Q1`, `Q2`, `Q3`; Patterns `P1`, `P2`, `P3`; Contradictions `C1`, `C2`, `C3`; Negative evidence `N1`, `N2`, `N3`.
- Keep detailed evidence mapping, raw tables, and long evidence-ID chains in `RAW_DATA_DIGEST.md`; use compact references in `CEO_BRIEF.md`.
- Preserve source type: `primary`, `secondary`, `user-generated`, `scraped`, or `inferred`.
- Preserve confidence: `High`, `Medium-high`, `Medium`, or `Low` in final artifacts.
- Separate `FACT`, `INFERENCE`, and `SPECULATION`.
- Preserve contradictions and negative evidence.
- Preserve blocked, weak, duplicate, and no-signal sources.
- Do not hide weak methodology.
- Do not inflate confidence.
- Omit irrelevant sections by writing `No material finding`.
- Do not treat internal project/profile source docs as external proof.

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
- [ ] Exactly three final artifacts exist by default: `CEO_BRIEF.md`, `RAW_DATA_DIGEST.md`, and `CHATGPT_PROJECT_DOC.md`
- [ ] No duplicate summaries, alternate reports, or extra synthesis docs were created by default
- [ ] Every required raw lane file exists or an explicit blocker is recorded
- [ ] Every factual claim has a Source ID
- [ ] Every CEO brief conclusion is supportable from `RAW_DATA_DIGEST.md`
- [ ] `CEO_BRIEF.md` includes Executive Read, Numbers That Matter, Category / Segment Structure, Signal Read, Confidence-Weighted Findings, Decision Implications, and Next Action
- [ ] `CEO_BRIEF.md` is not dominated by evidence-ID chains, methodology recap, or caveat-first language
- [ ] `FACT`, `INFERENCE`, and `SPECULATION` are separated
- [ ] Contradictions and negative evidence are preserved
- [ ] Weak methodology and blocked sources are visible
- [ ] Confidence is proportional to evidence
- [ ] `CHATGPT_PROJECT_DOC.md` excludes weak, temporary, or speculative findings

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
