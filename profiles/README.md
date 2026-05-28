# Project Profiles

Profiles hold project-specific context for the research runtime.

Core docs, templates, and TypeScript runtime define how research runs work. A profile defines what a run is about:

- project name
- profile path
- decision owner and audience
- decision taxonomy
- source context rules
- default first run
- project-specific decision gates
- project-specific backlog
- project-specific tool/session defaults
- relevant lane defaults

If a run does not specify a profile, use `profiles/example/`.

Profiles must not weaken the core evidence standard. A profile may add stricter source, citation, tool, or stop-condition rules, but it must preserve Source IDs, confidence labels, contradiction handling, negative evidence, blocked-source logging, and raw-lane-before-synthesis gates.

## What Profiles Affect

Profiles affect research framing:

- what decision the research should change
- who the default audience is
- what source types are preferred or prohibited
- what context files should be read before lane work begins
- what follow-up backlog exists
- which tool policies are stricter than the repository default

Profiles do not affect the runtime artifact contract, validation rules, hidden execution, or provider access. Internal profile text is context and hypothesis material; it is not external evidence.

## Project Profiles Vs Artifact Profiles

Project profiles live here under `profiles/`. Artifact profiles live under `artifact-profiles/`.

Project profiles answer “what is this research program about?” Artifact profiles answer “what files must synthesis produce?” The default artifact profile currently requires `RAW_DATA_DIGEST.md`, `CEO_BRIEF.md`, and `PROJECT_CONTEXT.md`.

## Included Public Profiles

- `profiles/example/`: minimal synthetic shape reference for a generic product or strategy research program.
- `profiles/incident-review/`: nontrivial public pattern for source-grounded incident reviews with timeline, causal-chain, recovery, counterevidence, and lessons-learned decisions.

Do not commit private project profiles. Put private profiles under a gitignored path such as `profiles/private-*`.
