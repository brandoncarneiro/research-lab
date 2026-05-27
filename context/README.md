# Context Folder

This folder is for deliberately provided, run-specific source context. It is empty in the public repo by design.

Rules:

- Source documents are external/private unless the project owner deliberately provides them for a specific run.
- Do not commit private PDFs, document exports, account exports, screenshots, bulky source documents, raw datasets, or generated report exports.
- Prefer sanitized excerpts in `00-brief.md` when possible.
- Keep private local context in gitignored folders.
- Treat project context as hypotheses and operating context, not external proof.
- External factual claims still require cited external sources.

Allowed public files here:

- `README.md`
- `.gitkeep`

Typical source-context inputs:

- source excerpts pasted into the run brief
- local files provided for the run but kept out of git
- public URLs listed in the run brief
- small synthetic fixtures that contain no private data
