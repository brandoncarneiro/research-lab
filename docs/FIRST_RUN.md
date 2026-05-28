# First Run

The first run is a normal run folder with a brief, lane manifests, logs, metrics, outputs, and validation.

Use the checked public example:

```bash
npm run example:run
```

Then inspect:

```bash
npm run example:status
```

For a project-specific first run, copy `templates/00-brief.md` into an ignored folder under `research/runs/`, create lane manifests, and run the CLI commands in `docs/RUNBOOK.md`.

Profile files can supply context and backlog priorities, but profile claims are not external proof. Final claims still need source IDs from raw lane evidence.
