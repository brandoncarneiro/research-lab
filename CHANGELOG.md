# Changelog

## Unreleased

- Added CI and lint gates for typecheck, Biome linting, tests, preflight, example execution, example validation, and whitespace diff checks.
- Renamed the legacy durable context artifact to `PROJECT_CONTEXT.md` across runtime contracts, templates, examples, validation, and docs.
- Documented the public runtime architecture: lane execution is separate from deterministic filesystem synthesis, and validation proves coherence rather than truth.
- Added the default artifact profile in `artifact-profiles/default.json` and preflight/test coverage to keep the profile aligned with runtime outputs.
- Expanded tests beyond the runtime happy path to cover raw lane validation, evidence closure, malformed JSONL, token/cost validation, artifact profile validation, and CLI help/version behavior.
- Moved optional Composio helper support out of production dependencies and pinned TypeScript to the stable 5.x line.
- Added a nontrivial public `profiles/incident-review/` project profile example.

## 0.1.0

- Public runtime release: filesystem-first research runner with lane manifests, raw lane artifacts, deterministic synthesis, JSONL logs, token/cost summaries, validation, and a checked Apollo 13 example run.
