# Research Lab

Research Lab is a portable, file-based research operating system for Codex-assisted, source-grounded research. It is designed for public, reusable workflows across market, product, technical, finance, legal/policy, vendor, scientific/literature, competitive, and customer research.

The core system is project-agnostic. A run brief defines the project, profile path, decision owner or audience, affected decision, source context, evidence lanes, output contract, and stop conditions. Parent Codex supervises the run. Codex subagents execute parallel evidence lanes. The filesystem is the operating surface; this repo does not use LangChain, LangGraph, CrewAI, AutoGen, or a custom orchestration framework.

Every standard run produces exactly three final artifacts:

- `output/RAW_DATA_DIGEST.md`: evidence ledger with source IDs, normalized records, contradictions, negative evidence, blocked/weak sources, and confidence notes.
- `output/CEO_BRIEF.md`: decision-facing brief for the named owner or audience.
- `output/CHATGPT_PROJECT_DOC.md`: compact durable project context with stable findings and do-not-overclaim rules.

Generated run folders under `research/runs/` are local/private by default and are ignored by git. Track only synthetic examples that are deliberately scrubbed for public use.

## Quick Start

```bash
npm install
npm run typecheck
npm run preflight
```

Then choose a profile, create a run folder, copy `templates/00-brief.md`, fill the brief, and use `prompts/SUPERVISOR.md`.

```bash
mkdir -p research/runs/YYYY-MM-DD-topic/{raw,extracted,output}
cp templates/00-brief.md research/runs/YYYY-MM-DD-topic/00-brief.md
```

## Public Guardrails

- Do not commit secrets, API keys, private source documents, account exports, screenshots, raw datasets, generated research runs, or local report exports.
- Do not collect scraped private data, private account data, login-gated data, or data that requires bypassing access controls.
- Do not bypass captcha, paywalls, logins, robots/platform restrictions, or use stealth scraping, residential proxies, mass social scraping, LinkedIn scraping, or private/personal account scraping.
- Do not mutate production accounts, billing systems, databases, deployment systems, email/sending tools, posting tools, or other external systems during research.
- Keep private source material in ignored local folders or pasted/summarized in a run brief only when the project owner deliberately provides it.
- See `CONTRIBUTING.md` and `SECURITY.md` before accepting public contributions or reports.
- No license has been declared yet; choose one before presenting the repo as reusable open-source software.

## Project Profiles

Profiles live under `profiles/{profile}/`. A profile supplies project context, decision taxonomy, source-context rules, first-run defaults, prompt overlay, backlog, and optional tooling defaults.

The included profile at `profiles/example/` is synthetic placeholder material only. Copy it to create a real profile:

```bash
cp -R profiles/example profiles/my-project
```

Then update:

- `profiles/my-project/PROFILE.md`
- `profiles/my-project/SOURCE_CONTEXT.md`
- `profiles/my-project/FIRST_RUN.md`
- `profiles/my-project/RESEARCH_BACKLOG.md`
- `profiles/my-project/PROMPT_OVERLAY.md`
- `profiles/my-project/TOOLING.md`

Use `RESEARCH_PROFILE=my-project npm run preflight` to validate a non-default profile.

## Core Workflow

1. Open the repo root.
2. Select the active project profile, defaulting to `profiles/example/`.
3. Read the active profile, source-context rules, `docs/TOOL_MENU.md`, `docs/RESEARCH_STANDARD.md`, and `templates/00-brief.md`.
4. Create a timestamped run folder under `research/runs/YYYY-MM-DD-topic/`.
5. Copy `templates/00-brief.md` into the run folder and fill the run brief.
6. Define independent evidence lanes and explicit file ownership.
7. Spawn one Codex subagent per evidence lane, up to 6 concurrent subagents.
8. If more than 6 lanes exist, run subagents in waves.
9. Instruct child subagents not to spawn nested subagents.
10. Restrict every lane to `docs/TOOL_MENU.md` and any stricter profile/brief rules.
11. Each subagent writes only its assigned `raw/[lane-name].md` file.
12. Parent Codex reads all required raw lane outputs.
13. Parent Codex extracts findings, tables, contradictions, and open questions into `extracted/`.
14. Parent Codex writes `output/RAW_DATA_DIGEST.md`.
15. Parent Codex writes `output/CEO_BRIEF.md`.
16. Parent Codex writes `output/CHATGPT_PROJECT_DOC.md`.

Raw lane files and `extracted/` files are intermediate evidence. `MASTER_RESEARCH.md` is legacy/optional only and must not be treated as the required or primary artifact.

## Evidence Standard

- Cite every factual claim with a Source ID.
- Separate `FACT`, `INFERENCE`, and `SPECULATION`.
- Mark source type and confidence.
- Preserve contradictions, negative evidence, weak methodology, no-signal sources, and blocked-source logs.
- Record blocked source, reason blocked, attempted access method, substitute source, confidence impact, and decision-quality impact.
- Do not invent numbers, quotes, citations, sources, market sizes, rankings, or user sentiment.
- Treat project/profile docs as context and hypotheses, not external proof.
- Do not synthesize before required raw lane evidence exists.
- Do not write `CEO_BRIEF.md` before `RAW_DATA_DIGEST.md`.

## Run Folder Shape

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
    RAW_DATA_DIGEST.md
    CEO_BRIEF.md
    CHATGPT_PROJECT_DOC.md
```

## Key Files

- `docs/OPERATING_MODEL.md`: parent/subagent workflow and file ownership.
- `docs/RESEARCH_STANDARD.md`: citation, confidence, contradiction, and artifact rules.
- `docs/TOOL_MENU.md`: allowed, conditional, optional paid, and banned tool policy.
- `docs/RUNBOOK.md`: standard run procedure.
- `docs/FIRST_RUN.md`: profile-driven first-run resolution.
- `context/README.md`: private source-material handling.
- `prompts/`: reusable Codex prompts for supervisor, subagent lane, synthesis, and agent-pack creation.
- `templates/`: run brief, lane output, and final artifact templates.
- `agents/`: reusable research-agent packs.
- `scripts/preflight/`: portable readiness checks.

## Composio Session Scripts

The repo includes lightweight TypeScript scripts for discovering Composio toolkit slugs, inspecting toolkit tools, creating/reusing research-scoped sessions, and printing Codex MCP commands.

```bash
npm run composio:list-toolkits -- --filter search
npm run composio:list-toolkits -- --filter browser
npm run composio:create-research-sessions
npm run composio:print-codex-mcp-config
```

All scripts read `COMPOSIO_API_KEY` from the environment and never print it. Session IDs and MCP URLs are saved locally to `.composio-research-sessions.json`, which is gitignored.
