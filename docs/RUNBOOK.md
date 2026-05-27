# Runbook

Use this runbook for every standard research run.

## Standard Research Run

1. Choose the active project profile, defaulting to `profiles/example/`.
2. Create run folder: `research/runs/YYYY-MM-DD-topic/`.
3. Create `raw/`, `extracted/`, and `output/` inside the run folder.
4. Copy `templates/00-brief.md` into the run folder.
5. Fill the project name, project profile path, decision owner/audience, research question, decision affected, scope, out-of-scope, source context, target sources, evidence lanes, tool posture, output contract, and stop conditions.
6. Read `RESEARCH_BACKLOG.md`, the active profile backlog, `docs/TOOL_MENU.md`, `docs/RESEARCH_STANDARD.md`, and any relevant agent pack.
7. Confirm required source context is available from the active profile, local files, Google Drive exports, pasted excerpts, or `context/`.
8. Assign explicit file ownership for the run.
9. Spawn Codex subagents for parallel lanes.
10. Each subagent writes only to its assigned `raw/[lane-name].md`.
11. Parent Codex inspects raw evidence before synthesis.
12. Parent Codex extracts structured findings into `extracted/`.
13. Parent Codex writes `output/RAW_DATA_DIGEST.md` using evidence IDs from the raw lane outputs.
14. Parent Codex writes `output/CEO_BRIEF.md` as a dense decision-facing signal layer using the normalized data and evidence in `output/RAW_DATA_DIGEST.md`.
15. Parent Codex writes `output/CHATGPT_PROJECT_DOC.md` with only durable context.
16. Parent Codex validates citations, unsupported claims, artifact count, and brief-to-digest supportability.
17. Stop.

Exactly three final artifacts are produced by default:

- `output/CEO_BRIEF.md`
- `output/RAW_DATA_DIGEST.md`
- `output/CHATGPT_PROJECT_DOC.md`

Do not create duplicate summaries, alternate reports, or extra synthesis docs by default. `output/MASTER_RESEARCH.md` is legacy/optional only and must not be created unless the project owner explicitly asks for it.

## Commands

From the repo root:

```bash
mkdir -p research/runs/YYYY-MM-DD-topic/{raw,extracted,output}
cp templates/00-brief.md research/runs/YYYY-MM-DD-topic/00-brief.md
```

Replace `YYYY-MM-DD-topic` with the date and topic slug for the run.

## Subagent Mechanics

- Parent Codex is the supervisor.
- Parent Codex may spawn one Codex subagent per evidence lane.
- Default max concurrent subagents: 6.
- If more than 6 lanes exist, run waves.
- Child subagents must not spawn nested subagents.
- Each subagent writes only its assigned raw lane file.
- Parent only writes final artifacts.
- Parent does synthesis only after required raw lane files exist.
- Avoid write conflicts by assigning explicit file ownership before spawning.

## Supervisor Checklist

- Confirm the brief exists.
- Confirm the active project profile exists and was read.
- Confirm the research question is decision-linked.
- Confirm the decision owner/audience and decision affected are explicit.
- Confirm out-of-scope boundaries are explicit.
- Confirm evidence lanes are independent enough to run in parallel.
- Confirm each lane has target sources.
- Confirm required source context is available before synthesis.
- Confirm each lane is restricted to `docs/TOOL_MENU.md`.
- Confirm paid or conditional tools are not used unless approved in the brief.
- Confirm no nested subagents are allowed.
- Confirm raw lane file ownership is explicit.
- Confirm no synthesis starts before raw lane outputs exist.
- Confirm raw evidence is saved before synthesis.
- Confirm `RAW_DATA_DIGEST.md` exists before `CEO_BRIEF.md`.
- Confirm final claims are cited.
- Confirm every factual claim has a Source ID.
- Confirm evidence IDs use Sources `S1`, Quantitative signals `Q1`, Patterns `P1`, Contradictions `C1`, and Negative evidence `N1` conventions.
- Confirm every CEO brief conclusion is supportable from `RAW_DATA_DIGEST.md`.
- Confirm `CEO_BRIEF.md` includes Executive Read, Numbers That Matter, Category / Segment Structure, Signal Read, Confidence-Weighted Findings, Decision Implications, and Next Action.
- Confirm `CEO_BRIEF.md` is not dominated by evidence-ID chains, methodology recap, or caveat-first language.
- Confirm contradictions and open questions are preserved.
- Confirm negative evidence is preserved.
- Confirm weak methodology and blocked sources are visible.
- Confirm `CHATGPT_PROJECT_DOC.md` excludes weak, temporary, or speculative findings.
- Confirm prior finalized run outputs were not edited unless explicitly in scope.
- Confirm irrelevant sections say `No material finding` rather than padding.

## Stop Conditions

Stop when the run brief stop conditions are met, when required source context is unavailable, when required tools are unavailable, when a source requires a banned action, or when the evidence is too weak to support the requested decision. In that case, write the blocker into the run folder and do not invent a conclusion.
