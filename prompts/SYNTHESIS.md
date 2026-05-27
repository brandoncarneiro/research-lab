# Codex Synthesis Prompt

You are parent Codex synthesizing a completed project-profile research run.

Do not begin synthesis until the required raw lane files exist under `raw/`. Do not invent missing lane evidence. If a lane is missing, record the gap and stop or ask the project owner whether to continue with an explicit caveat.

## Synthesis Gate

Do not synthesize unless each required lane includes:

- raw evidence
- source log
- blocked or no-signal source log when applicable
- negative evidence
- contradictions
- confidence level
- source list

If any lane is missing one of these, stop and record the missing field. Do not fill the gap with generic commentary.

## Required Inputs

- Project name
- Project profile path
- Decision owner / audience
- Decision affected
- Source context
- Required raw lane file manifest
- Output contract
- Stop conditions

If no profile is specified, use `profiles/example/`.

## Mission

Read every required raw lane file, extract structured evidence, identify contradictions and open questions, then produce exactly three final artifacts:

- `output/CEO_BRIEF.md`
- `output/RAW_DATA_DIGEST.md`
- `output/CHATGPT_PROJECT_DOC.md`

Do not create duplicate summaries, alternate reports, or extra synthesis docs by default. Do not produce `output/MASTER_RESEARCH.md` by default; it is legacy/optional only and may be created only if the project owner explicitly requests an additional long-form report after the three required artifacts exist.

## Artifact Order

1. Build `output/RAW_DATA_DIGEST.md` first from raw lane evidence.
2. Build `output/CEO_BRIEF.md` as the decision-facing signal layer from the normalized data and evidence in `RAW_DATA_DIGEST.md`.
3. Build `output/CHATGPT_PROJECT_DOC.md` only from stable durable findings and caveats in `RAW_DATA_DIGEST.md`.
4. Run the final consistency check.

## Decision Standard

The synthesis is not a generic summary. It must say what should change for the active project/profile and what remains unresolved for the named decision.

The final artifacts together must answer:

- What did we learn?
- What normalized records and data points exist?
- What is the signal?
- What patterns, categories, or segments matter?
- What can we say with high, medium, or low confidence?
- What decision should change?
- What decision should not change yet?
- What remains unresolved that affects decision quality?
- What should the next research run or validation step be?

Use profile-specific decision gates when the active profile supplies them. For other runs, create an equivalent decision scorecard tied to the run question and decision affected.

If the evidence is weak, say weak. Do not make the artifacts sound stronger than the sources allow.

## Procedure

1. Open the run folder.
2. Read `00-brief.md`.
3. Read the active project profile and prompt overlay if present.
4. List every file in `raw/`.
5. Confirm all required lane files exist from the brief's raw lane file manifest.
6. Confirm each lane passes the synthesis gate.
7. Read every raw lane file.
8. Extract:
   - facts
   - inferences
   - speculation
   - source list
   - exact quotes/user language
   - quantitative signals
   - patterns
   - tables
   - contradictions
   - negative evidence
   - blocked or weak sources
   - open questions
9. Validate that factual claims are cited with Source IDs.
10. Identify unsupported claims and either remove them or mark them as `SPECULATION`.
11. Write structured extraction notes into `extracted/`.
12. Produce `output/RAW_DATA_DIGEST.md` using `templates/RAW_DATA_DIGEST.md`.
13. Produce `output/CEO_BRIEF.md` using `templates/CEO_BRIEF.md`.
14. Produce `output/CHATGPT_PROJECT_DOC.md` using `templates/CHATGPT_PROJECT_DOC.md`.
15. Run the final consistency check.

## Evidence Rules

- Cite every factual claim with a Source ID.
- Use evidence IDs: Sources `S1`, `S2`, `S3`; Quantitative signals `Q1`, `Q2`, `Q3`; Patterns `P1`, `P2`, `P3`; Contradictions `C1`, `C2`, `C3`; Negative evidence `N1`, `N2`, `N3`.
- Preserve source type: `primary`, `secondary`, `user-generated`, `scraped`, or `inferred`.
- Preserve confidence: `High`, `Medium-high`, `Medium`, or `Low`.
- Keep `FACT`, `INFERENCE`, and `SPECULATION` separated.
- Do not invent numbers.
- Do not smooth contradictions.
- Preserve negative evidence.
- Preserve blocked, weak, duplicate, and no-signal sources.
- Do not hide weak methodology.
- Do not inflate confidence.
- Omit irrelevant sections by writing `No material finding`.
- Do not fill gaps with generic commentary.
- Do not treat internal project/profile docs as external proof.

## RAW_DATA_DIGEST.md Requirements

Use `templates/RAW_DATA_DIGEST.md`. Keep it evidence-led, not narrative-led.

It must include:

- collection scope
- source index
- method notes
- normalized records
- quantitative signals
- raw user/market/source language
- pattern library
- domain/market/competitor observations when relevant
- contradictions
- negative evidence
- blocked/weak sources
- source-to-evidence map
- confidence notes
- candidate project context

## CEO_BRIEF.md Requirements

Use `templates/CEO_BRIEF.md`. Target 1-2 dense pages. It can exceed one page only when the signal requires it.

It must:

- include an Executive Read with a direct 3-6 sentence read of the strongest signal
- include Numbers That Matter: source count, normalized record count, benchmark/data point count, category/segment count, quantitative signal count, pattern count, contradiction count, gap/weak-evidence count, and run-specific key metrics
- include Category / Segment Structure
- include Signal Read: the interpretation of what is materially true at the research level
- include Confidence-Weighted Findings labeled High, Medium, or Low, each with why it matters and a brief evidence reference if needed
- include Decision Implications for the decision taxonomy defined in the run brief/profile, such as product, GTM, finance, positioning, validation, strategy, trust and risk, legal/policy, vendor selection, technical architecture, or operations where relevant
- include one Next Action, not a menu
- use evidence IDs sparingly as compact support, not as the main body of the brief
- state confidence boundaries instead of leading with caveat dumps

Every conclusion in `CEO_BRIEF.md` must be supportable from `RAW_DATA_DIGEST.md`. If a conclusion is not supported by digest evidence, remove it or label it as unsupported and do not recommend from it. Detailed evidence mapping belongs in `RAW_DATA_DIGEST.md`.

## CHATGPT_PROJECT_DOC.md Requirements

Use `templates/CHATGPT_PROJECT_DOC.md`. Keep it compact enough for the durable context destination named in the active profile.

It must include:

- durable findings
- caveats
- decisions affected
- do-not-overclaim rules
- do-not-add-to-context rules
- revisit trigger

Do not include bulky raw evidence, raw dumps, weak findings, temporary observations, speculative ideas, or unsupported claims in `CHATGPT_PROJECT_DOC.md`.

## Final Consistency Check

Before accepting final artifacts:

- [ ] Exactly three final artifacts exist by default: `CEO_BRIEF.md`, `RAW_DATA_DIGEST.md`, and `CHATGPT_PROJECT_DOC.md`
- [ ] No duplicate summaries, alternate reports, or extra synthesis docs were created by default
- [ ] `RAW_DATA_DIGEST.md` exists before `CEO_BRIEF.md`
- [ ] Every factual claim has a Source ID
- [ ] Every CEO brief conclusion is supportable from `RAW_DATA_DIGEST.md`
- [ ] `CEO_BRIEF.md` includes Executive Read, Numbers That Matter, Category / Segment Structure, Signal Read, Confidence-Weighted Findings, Decision Implications, and Next Action
- [ ] `CEO_BRIEF.md` is not dominated by evidence-ID chains, methodology recap, or caveat-first language
- [ ] `FACT`, `INFERENCE`, and `SPECULATION` are separated
- [ ] Contradictions and negative evidence are preserved
- [ ] Blocked, weak, duplicate, and no-signal sources are visible
- [ ] Confidence is proportional to evidence
- [ ] Irrelevant sections say `No material finding`
- [ ] `CHATGPT_PROJECT_DOC.md` excludes weak, temporary, or speculative findings
- [ ] Accepted historical runs were not edited
