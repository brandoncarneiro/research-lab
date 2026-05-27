# Contributing

Research Lab is a public, generic research operating system. Contributions should improve the reusable workflow without adding private project context, generated research outputs, account data, or restricted source material.

## Before Opening A Pull Request

- Run `npm run typecheck`.
- Run `npm run preflight`.
- Run `git diff --check`.
- Confirm no secrets, private source documents, local report exports, generated run folders, or raw datasets are included.
- Keep examples synthetic and reusable across projects.

## Scope Rules

- Do not add project-specific strategy, client/company context, personal data, funding materials, restricted business content, or private source paths.
- Do not add generated research runs under `research/runs/`.
- Do not add dependencies, frameworks, or orchestration layers unless the project owner explicitly approves them.
- Preserve the parent supervisor, max 6 concurrent subagents, waves, no nested subagents, raw-lane-only writes, parent-only synthesis, and three-artifact output model.
- Preserve evidence rigor: citations, source IDs, confidence, contradictions, negative evidence, blocked-source logging, and fact/inference/speculation separation.

## Public Examples

Public examples must be synthetic or fully scrubbed. They must not contain:

- private documents or excerpts
- real customer records
- account exports
- internal strategy
- raw scraped private data
- credential material
- private source paths

## License

No license has been declared yet. A license must be chosen before presenting this repo as reusable open-source software.
