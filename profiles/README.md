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

Do not commit private project profiles. Put private profiles under a gitignored path such as `profiles/private-*`.
