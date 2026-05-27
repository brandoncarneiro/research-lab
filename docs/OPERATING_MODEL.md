# Operating Model

Research runs are supervised by parent Codex, executed through parallel Codex subagents, and grounded in the canonical tool policy in `docs/TOOL_MENU.md`. The repo is the system of record. Each run leaves an auditable folder containing the brief, raw lane outputs, extracted findings, and exactly three final artifacts by default.

This repo does not use LangChain, LangGraph, CrewAI, AutoGen, or a custom orchestration framework.

## Architecture Layers

1. Core research OS: `docs/`, `prompts/`, `templates/`, `agents/_template/`, and `scripts/`.
2. Project profile: `profiles/{profile}/`, which supplies project context, decision taxonomy, source context, first-run defaults, prompt overlay, and profile tooling.
3. Research runs: `research/runs/YYYY-MM-DD-topic/`, which contain run-specific briefs, raw lane files, extraction notes, and final artifacts.

If no profile is specified, use `profiles/example/`.

## Exact Workflow

1. Codex opens the repo root.
2. Codex identifies the active project profile.
3. Codex reads the active profile, `docs/TOOL_MENU.md`, `docs/RESEARCH_STANDARD.md`, and `templates/00-brief.md`.
4. Codex creates a timestamped run folder.
5. Codex creates `raw/`, `extracted/`, and `output/` inside the run folder.
6. Codex reads or creates `00-brief.md`.
7. Codex confirms required source context is available from the active profile, local files, Google Drive exports, pasted brief excerpts, or `context/`.
8. Codex defines evidence lanes and explicit file ownership.
9. Codex assigns parallel subagent lanes.
10. Each subagent uses only the tools allowed by `docs/TOOL_MENU.md` and any stricter profile/brief rules.
11. Each subagent writes only its assigned lane output into `raw/`.
12. Parent Codex reads all required lane outputs.
13. Parent Codex extracts contradictions, tables, findings, and open questions.
14. Parent Codex writes `output/RAW_DATA_DIGEST.md` as the evidence layer.
15. Parent Codex writes `output/CEO_BRIEF.md` as the decision-facing signal layer from the normalized data and evidence in `RAW_DATA_DIGEST.md`.
16. Parent Codex writes `output/CHATGPT_PROJECT_DOC.md` as durable project context only.
17. Parent Codex runs the final consistency check.

## Roles

### Project Owner

- Defines or approves the research question and decision the research must affect.
- Approves scope, out-of-scope boundaries, target sources, conditional tools, and stop conditions.
- Reviews final artifacts and decides what changes.

### Parent Codex

- Acts as research supervisor.
- Creates the run folder.
- Reads or fills the run brief.
- Loads the active project profile.
- Confirms required source context is available before synthesis.
- Defines evidence lanes.
- Assigns explicit file ownership.
- Spawns parallel Codex subagents.
- Enforces `docs/TOOL_MENU.md` and any stricter profile/brief rules.
- Refuses to synthesize until required lane outputs exist in `raw/`.
- Refuses to synthesize if required source context is missing.
- Extracts contradictions, tables, findings, and open questions.
- Writes exactly three final artifacts by default: `CEO_BRIEF.md`, `RAW_DATA_DIGEST.md`, and `CHATGPT_PROJECT_DOC.md`.
- Does not create `MASTER_RESEARCH.md` unless the project owner explicitly requests the legacy optional long-form artifact.

### Codex Subagents

- Execute one evidence lane each.
- Must not spawn nested subagents.
- Use only allowed tools from `docs/TOOL_MENU.md`, profile rules, and the lane brief.
- Save raw findings only into the assigned `raw/[lane-name].md`.
- Do not edit the run brief, other raw files, `extracted/`, or `output/`.
- Cite sources for every factual claim.
- Separate fact, inference, and speculation.
- Mark source type and confidence.
- Record blocked sources, negative evidence, contradictions, and no-signal sources.
- Avoid synthesis beyond the lane mission.

## Subagent Concurrency

- Default max concurrent subagents: 6.
- Assign one subagent per evidence lane.
- If a run has more than 6 lanes, spawn lanes in waves.
- A wave is complete only when each required raw lane file from that wave exists or the blocker is recorded.
- Parent Codex performs synthesis only after all required raw lane files exist or the project owner explicitly approves a caveated partial synthesis.

## File Ownership

| Path | Owner | Rule |
| --- | --- | --- |
| `00-brief.md` | Parent Codex | Parent creates/updates the run brief. |
| `raw/[lane-name].md` | Assigned subagent | Only the assigned subagent writes this file. |
| Other files in `raw/` | Assigned lane owners | Subagents do not edit each other's files. |
| `extracted/` | Parent Codex | Parent writes extraction notes after reading raw files. |
| `output/` | Parent Codex | Parent writes final artifacts only after raw evidence exists. |
| Prior finalized run outputs | Historical record | Do not edit, move, normalize, or rewrite prior outputs unless explicitly in scope. |

## Run Folder Contract

```text
research/runs/YYYY-MM-DD-topic/
  00-brief.md
  raw/
    lane-name.md
  extracted/
    findings.md
    contradictions.md
    tables.md
    open-questions.md
  output/
    CEO_BRIEF.md
    RAW_DATA_DIGEST.md
    CHATGPT_PROJECT_DOC.md
```

Raw lane outputs and `extracted/` files are intermediate evidence only. They must not become duplicate summaries or alternate final reports.

## Final Artifact Contract

- `RAW_DATA_DIGEST.md`: evidence layer. It uses Source IDs (`S1`), Quantitative Signal IDs (`Q1`), Pattern IDs (`P1`), Contradiction IDs (`C1`), and Negative Evidence IDs (`N1`) to hold normalized records, source mapping, contradictions, gaps, blocked/weak sources, negative evidence, and confidence notes.
- `CEO_BRIEF.md`: decision-facing signal layer. Target 1-2 pages. It turns the digest into normalized counts, category/segment structure, signal read, confidence-weighted findings, decision implications, and one next action. Evidence IDs appear only as compact support for major claims.
- `CHATGPT_PROJECT_DOC.md`: durable project-context capsule. It includes stable findings, durable caveats, source anchors, affected decisions, do-not-overclaim rules, do-not-add-to-context rules, and a revisit trigger. It is not a raw dump.

Every factual claim needs a Source ID. `FACT`, `INFERENCE`, and `SPECULATION` must stay separated. Contradictions, negative evidence, blocked/weak sources, and weak methodology must remain visible in the digest. The decision brief should state confidence boundaries without becoming caveat-led.

## Non-Goals

- Do not run research without a brief.
- Do not create fake research.
- Do not invent sources, quotes, numbers, or conclusions.
- Do not use LangChain, LangGraph, CrewAI, AutoGen, or a custom orchestration framework.
- Do not use tools outside `docs/TOOL_MENU.md` unless the run brief explicitly expands scope.
- Do not use paid or conditional hosted extractors unless the brief explicitly approves the tool, API/account setup, cap, and stop condition.
- Do not bypass captcha, paywalls, logins, platform restrictions, or use stealth scraping, residential proxies, mass social scraping, LinkedIn scraping, or private/personal account scraping.
