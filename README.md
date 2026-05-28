# Research Lab

Research Lab is a portable, file-based research operating system for Codex-assisted, source-grounded research. It gives parent Codex a strict supervisor workflow, lets bounded Codex subagents collect parallel evidence lanes, and keeps synthesis grounded in files, citations, confidence labels, contradictions, and negative evidence.

It is useful when a research question should change a product, market, technical, legal/policy, vendor, finance, competitive, scientific, or customer decision. It is not an agent framework, scraping product, or autonomous data pipeline. The filesystem is the operating surface; this repo does not use LangChain, LangGraph, CrewAI, AutoGen, or a custom orchestration framework.

## Who This Is For

Use Research Lab if you want:

- Codex to run structured research without losing source trails.
- Parallel evidence lanes with clear file ownership.
- Decision-facing outputs that distinguish facts from inference.
- A reusable profile system for different projects.
- A default workflow that works without paid tools or private integrations.

This repo assumes a human owner reviews the brief, controls tool access, and decides whether evidence is strong enough to act on.

## Prerequisites

- Node.js and npm.
- Codex with access to this repo as its working directory.
- Public web access when the research task needs current external sources.
- Optional API accounts only if a brief explicitly approves advanced tooling such as Composio, Firecrawl, Apify, SerpAPI, Tavily, or Exa.

Install and validate the repo:

```bash
npm install
npm run typecheck
npm run preflight
```

## Quick Start

From the repo root, create a local run folder:

```bash
mkdir -p research/runs/YYYY-MM-DD-topic/{raw,extracted,output}
cp templates/00-brief.md research/runs/YYYY-MM-DD-topic/00-brief.md
```

Fill `research/runs/YYYY-MM-DD-topic/00-brief.md` with the decision, scope, source context, evidence lanes, target sources, tool posture, output contract, and stop conditions.

Then paste this into Codex from the repo root:

```text
Use this repo as Research Lab.

Read README.md, docs/RUNBOOK.md, docs/OPERATING_MODEL.md, docs/RESEARCH_STANDARD.md, docs/TOOL_MENU.md, templates/00-brief.md, prompts/SUPERVISOR.md, and the active profile.

Run the research brief at research/runs/YYYY-MM-DD-topic/00-brief.md.

Act as parent Codex. Define independent evidence lanes from the brief. Use at most 6 concurrent Codex subagents. If there are more than 6 lanes, run them in waves. Do not allow nested subagents. Each subagent may write only its assigned raw/[lane-name].md file using templates/lane-output.md.

Use only the tools allowed by docs/TOOL_MENU.md and any stricter rules in the brief or profile. Do not use paid, private-account, production, posting, billing, email, database, or destructive tools unless the brief explicitly approves them.

Do not synthesize until required raw lane files exist or their blockers are recorded. Parent Codex writes extracted/ and then exactly these final artifacts:
- output/RAW_DATA_DIGEST.md
- output/CEO_BRIEF.md
- output/CHATGPT_PROJECT_DOC.md

Cite factual claims with Source IDs. Separate FACT, INFERENCE, and SPECULATION. Preserve contradictions, negative evidence, weak sources, blocked sources, confidence limits, and open questions. Stop and report if required source context or tool access is missing.
```

Replace `YYYY-MM-DD-topic` with your run slug.

## First Synthetic Example

The completed example run under `examples/synthetic-roommate-chore-scan/` shows what a good small run looks like without exposing private context. It demonstrates:

- `00-brief.md`
- one raw lane output
- extraction notes
- `output/RAW_DATA_DIGEST.md`
- `output/CEO_BRIEF.md`
- `output/CHATGPT_PROJECT_DOC.md`

To rerun the same shape locally, copy the example brief into an ignored run folder:

```bash
mkdir -p research/runs/YYYY-MM-DD-synthetic-roommate-chore-scan/{raw,extracted,output}
cp examples/synthetic-roommate-chore-scan/00-brief.md research/runs/YYYY-MM-DD-synthetic-roommate-chore-scan/00-brief.md
```

Then paste the Quick Start Codex prompt above, replacing the run path with:

```text
research/runs/YYYY-MM-DD-synthetic-roommate-chore-scan/00-brief.md
```

The example is intentionally synthetic. Treat it as a format and workflow demonstration, not market evidence.

## Expected Outputs

Every standard run produces exactly three final artifacts:

- `output/RAW_DATA_DIGEST.md`: evidence ledger with source IDs, method notes, normalized records, contradictions, negative evidence, blocked/weak sources, confidence notes, and source-to-evidence mapping.
- `output/CEO_BRIEF.md`: decision-facing brief for the named owner or audience. It should be compact, cited, and supported by the digest.
- `output/CHATGPT_PROJECT_DOC.md`: durable project-context capsule with stable findings, source anchors, caveats, do-not-overclaim rules, and revisit triggers.

Raw lane files and `extracted/` files are intermediate evidence. `MASTER_RESEARCH.md` is legacy/optional only and must not be treated as the required or primary artifact.

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

Generated run folders under `research/runs/` are local/private by default and are ignored by git. Track only synthetic examples that are deliberately scrubbed for public use.

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

## Core Mechanics

- Parent Codex supervises the run.
- Parent Codex may launch one Codex subagent per independent evidence lane.
- Maximum concurrent subagents: 6.
- Runs with more than 6 lanes use waves.
- Child subagents must not spawn nested subagents.
- Each subagent writes only its assigned `raw/[lane-name].md` file.
- Parent Codex reads required raw lane outputs before synthesis.
- Parent Codex writes `extracted/`, then `RAW_DATA_DIGEST.md`, then `CEO_BRIEF.md`, then `CHATGPT_PROJECT_DOC.md`.
- Prior finalized run outputs are historical records and should not be rewritten unless explicitly in scope.

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

## Public Boundaries

- Do not commit secrets, API keys, private source documents, account exports, screenshots, raw datasets, generated research runs, or local report exports.
- Do not collect scraped private data, private account data, login-gated data, or data that requires bypassing access controls.
- Do not bypass captcha, paywalls, logins, robots/platform restrictions, or use stealth scraping, residential proxies, mass social scraping, LinkedIn scraping, or private/personal account scraping.
- Do not mutate production accounts, billing systems, databases, deployment systems, email/sending tools, posting tools, or other external systems during research.
- Keep private source material in ignored local folders or pasted/summarized in a run brief only when the project owner deliberately provides it.
- See `CONTRIBUTING.md`, `SECURITY.md`, and `LICENSE` before accepting public contributions or reports.

## Key Files

- `docs/RUNBOOK.md`: standard run procedure.
- `docs/OPERATING_MODEL.md`: parent/subagent workflow and file ownership.
- `docs/RESEARCH_STANDARD.md`: citation, confidence, contradiction, and artifact rules.
- `docs/TOOL_MENU.md`: allowed, conditional, optional paid, and banned tool policy.
- `docs/FIRST_RUN.md`: profile-driven first-run resolution.
- `context/README.md`: private source-material handling.
- `prompts/`: reusable Codex prompts for supervisor, subagent lane, synthesis, and agent-pack creation.
- `templates/`: run brief, lane output, and final artifact templates.
- `agents/`: reusable research-agent packs.
- `scripts/preflight/`: portable readiness checks.
- `examples/`: synthetic completed runs suitable for public inspection.

## Optional Composio Setup

Research Lab does not require Composio. The default workflow works with Codex, local files, public web inspection, and any tools explicitly approved in a run brief.

The repo includes optional TypeScript helpers for advanced Composio users who want research-scoped MCP sessions:

```bash
npm run composio:list-toolkits -- --filter search
npm run composio:list-toolkits -- --filter browser
npm run composio:create-research-sessions
npm run composio:print-codex-mcp-config
```

These scripts read `COMPOSIO_API_KEY` from the environment and never print it. MCP session IDs and URLs are treated as sensitive-ish local configuration, saved to `.composio-research-sessions.json`, and ignored by git. Do not commit or share them.
