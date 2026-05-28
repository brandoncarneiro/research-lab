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

Use `docs/RESEARCH_STANDARD.md` as the canonical evidence standard. During synthesis, especially preserve:

- Source IDs and final evidence IDs: `S#`, `Q#`, `P#`, `C#`, and `N#`.
- Source type, confidence, and `FACT` / `INFERENCE` / `SPECULATION` separation.
- Contradictions, negative evidence, blocked/weak/duplicate/no-signal sources, and weak methodology.
- The rule that internal project/profile docs are context and hypotheses, not external proof.

Do not invent numbers, smooth contradictions, inflate confidence, or fill gaps with generic commentary.

## RAW_DATA_DIGEST.md Requirements

Use `templates/RAW_DATA_DIGEST.md`. Keep it evidence-led, not narrative-led. This is where detailed source mapping, normalized records, raw tables, contradictions, negative evidence, blocked/weak sources, and confidence notes belong.

## CEO_BRIEF.md Requirements

Use `templates/CEO_BRIEF.md`. Target 1-2 dense pages. It must include the template sections, one next action, and confidence boundaries. Use evidence IDs sparingly as compact support, not as the body of the brief.

Every conclusion in `CEO_BRIEF.md` must be supportable from `RAW_DATA_DIGEST.md`. If a conclusion is not supported by digest evidence, remove it or label it as unsupported and do not recommend from it. Detailed evidence mapping belongs in `RAW_DATA_DIGEST.md`.

## CHATGPT_PROJECT_DOC.md Requirements

Use `templates/CHATGPT_PROJECT_DOC.md`. Keep it compact enough for the durable context destination named in the active profile.

Do not include bulky raw evidence, raw dumps, weak findings, temporary observations, speculative ideas, or unsupported claims in `CHATGPT_PROJECT_DOC.md`.

## Final Consistency Check

Before accepting final artifacts:

- [ ] Exactly three final artifacts exist by default: `CEO_BRIEF.md`, `RAW_DATA_DIGEST.md`, and `CHATGPT_PROJECT_DOC.md`
- [ ] No duplicate summaries, alternate reports, or extra synthesis docs were created by default
- [ ] `RAW_DATA_DIGEST.md` exists before `CEO_BRIEF.md`
- [ ] Final artifacts pass `docs/RESEARCH_STANDARD.md`
- [ ] Irrelevant sections say `No material finding`
- [ ] `CHATGPT_PROJECT_DOC.md` excludes weak, temporary, or speculative findings
- [ ] Accepted historical runs were not edited
