# Example First Run

This profile is a shape reference. The checked executable first run is:

```text
examples/apollo-13-oxygen-tank-review/
```

Run it with:

```bash
npm run example:run
```

For a new project, create an ignored run folder under `research/runs/`, copy `templates/00-brief.md`, define lanes in the brief, and create matching `lanes/*.json` executor manifests.

## Minimum Run Folder

```text
research/runs/YYYY-MM-DD-topic/
  00-brief.md
  lanes/
  raw/
  extracted/
  output/
  logs/
  metrics/
  validation/
```

## First-Run Rules

- Choose one decision the research can change.
- Keep lanes independent and bounded.
- Save raw lane evidence before synthesis.
- Treat profile docs as context, not external proof.
- Produce exactly three final artifacts: `RAW_DATA_DIGEST.md`, `CEO_BRIEF.md`, and `PROJECT_CONTEXT.md`.
- Run `research-lab validate` before accepting the run.
