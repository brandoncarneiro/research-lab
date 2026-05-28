# First Run Resolution

This core file explains how a first run is selected. It is not a project-specific research brief.

## Default Profile

If no profile is specified, use the current/default profile:

```text
profiles/example/PROFILE.md
```

The included example profile first run is:

```text
profiles/example/FIRST_RUN.md
```

## Profile Requirement

A first run must come from an active profile or an explicit run brief. The profile supplies:

- project name
- profile path
- decision owner / audience
- decision affected
- source context
- evidence lanes
- output contract
- stop conditions
- profile-specific decision gates

The generic operating system supplies the workflow, evidence standard, tool policy, subagent mechanics, run folder contract, and artifact standard.

## First-Run Rules

- Do not invent a first run when the active profile already defines one.
- Do not substitute a different first run unless the project owner explicitly changes the priority.
- Do not start synthesis until required source context is available and required raw lane files exist.
- Do not use internal project docs as external proof.
- Do not create duplicate summaries, alternate reports, or extra final artifacts by default.
- Do not move, rewrite, or normalize prior finalized research runs unless explicitly in scope.

## Run Folder Shape

```text
research/runs/YYYY-MM-DD-topic/
  00-brief.md
  raw/
  extracted/
  output/
```

## Required Final Artifacts

Use the final artifact contract in `docs/RESEARCH_STANDARD.md`: exactly three final artifacts by default, raw evidence before synthesis, `RAW_DATA_DIGEST.md` before `CEO_BRIEF.md`, and no `MASTER_RESEARCH.md` unless the project owner explicitly requests the legacy optional long-form artifact.
