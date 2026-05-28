# Contributing

Research Lab is a small filesystem-first research runtime. Contributions should make the CLI, artifact contracts, validation, examples, or evidence discipline clearer without adding private project context or broad framework abstractions.

## Good Contributions

- tighter runtime behavior
- stronger validators
- clearer templates
- small tests for lifecycle, logs, metrics, and evidence references
- public examples with source provenance and reproducible local execution
- docs that explain what the runtime actually does

## Before Opening A Pull Request

- Run `npm run typecheck`.
- Run `npm test`.
- Run `npm run preflight`.
- Run `npm run example:run`.
- Run `git diff --check`.
- Confirm no secrets, private source documents, account exports, generated private runs, or raw private datasets are included.

## Scope Rules

- Do not add LangChain, LangGraph, CrewAI, AutoGen, Temporal, Ray, a database, cloud infrastructure, or a web app.
- Do not add dependencies unless the runtime need is concrete and smaller alternatives are inadequate.
- Preserve filesystem source of truth.
- Preserve bounded concurrency, raw-before-synthesis, parent-only deterministic synthesis, and the three-artifact output contract.
- Preserve evidence rigor: source IDs, confidence, contradictions, negative evidence, blocked-source logging, and fact/inference/speculation separation.

## Public Examples

Public examples must be synthetic, public-domain, or fully scrubbed. They must not contain:

- private documents or excerpts
- real customer records
- account exports
- internal strategy
- raw scraped private data
- credential material
- private source paths

Fixture-backed examples must label themselves as local fixture runs and must not imply provider-backed collection or fake cost telemetry.

## License

By contributing, you agree that your contribution is licensed under the MIT License.
