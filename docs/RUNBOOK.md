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

The final artifact contract is defined in `docs/RESEARCH_STANDARD.md`: exactly three final artifacts by default, no duplicate synthesis docs, and `MASTER_RESEARCH.md` only as a legacy optional add-on when explicitly requested.

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

- Brief, active profile, decision owner/audience, decision affected, scope, out-of-scope, target sources, and stop conditions are explicit.
- Required source context is available before synthesis, or the run records the blocker instead of synthesizing.
- Evidence lanes are independent enough to run in parallel and each lane has explicit `raw/[lane-name].md` ownership.
- Subagents follow `docs/TOOL_MENU.md`, use no nested subagents, and use paid/conditional tools only when approved in the brief.
- Parent Codex does not synthesize until required raw lane files exist or a caveated partial synthesis is explicitly approved.
- Parent Codex writes the final artifacts in the order and shape required by `docs/RESEARCH_STANDARD.md`.
- Citations, evidence IDs, confidence, contradictions, negative evidence, weak/blocked sources, and fact/inference/speculation separation pass `docs/RESEARCH_STANDARD.md`.
- Prior finalized run outputs were not edited unless explicitly in scope.
- Irrelevant sections say `No material finding` rather than padding.

## Stop Conditions

Stop when the run brief stop conditions are met, when required source context is unavailable, when required tools are unavailable, when a source requires a banned action, or when the evidence is too weak to support the requested decision. In that case, write the blocker into the run folder and do not invent a conclusion.
