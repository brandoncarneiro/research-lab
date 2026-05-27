# App Store Competitor Audit

## Purpose

Run a focused evidence lane for competitor App Store positioning, review language, trust objections, pricing/paywall signals, and keyword/search demand that affect a project/profile launch, ASO, pricing, or trust decision.

## Scope

- Scope: generic, with profile-specific defaults supplied by the active profile.
- Current default profile: `profiles/example/PROFILE.md`.
- Output path: assigned by the run brief, normally `raw/{lane-name}.md`.

## Use When

- Use when a lane asks for App Store competitor audit, app listing teardown, review-language evidence, or ASO demand.
- Use when the decision depends on competitor metadata, screenshots, pricing claims, public reviews, or trust/paywall objections.
- Use when the active profile's first run needs support for competitive trust audit or paywall trust risk.

## Do Not Use When

- Do not use for final synthesis across all lanes.
- Do not use for broad market sizing outside app competitor, listing, review, pricing, or trust evidence.
- Do not use when the lane requires private account data, LinkedIn scraping, mass social scraping, login-gated data, or unapproved paid scraping.

## Inputs Required

- Research run folder: `research/runs/YYYY-MM-DD-topic/`
- Lane name: `{lane-name}`
- Lane question: `{lane-question}`
- Decision this lane informs: `{decision}`
- Competitor list or search terms
- Stop conditions
- Output file path: `raw/{lane-name}.md`

## Allowed Tools

Use only `docs/TOOL_MENU.md`.

Default posture:

- Public web/search and browser inspection.
- Official App Store and Google Play pages first.
- Public company pages, pricing pages, privacy pages, screenshots, and support docs.
- Local file/repo writing inside the run folder.

Paid fallback scrapers are unavailable unless the run brief explicitly approves the tool, API/account setup, cap, and stop condition.

## Workflow

1. Confirm this pack fits the lane.
2. Read the run brief, `docs/TOOL_MENU.md`, and `references/source-priority.md`.
3. Inspect official marketplace pages and company-owned pages before secondary sources.
4. Record sources checked, no-signal sources, and blocked sources.
5. Capture short exact review language only when wording affects the decision.
6. Separate `FACT`, `INFERENCE`, and `SPECULATION`.
7. Read `references/output-rules.md`.
8. Write the lane output to `raw/{lane-name}.md`.

## Red Flags

- The lane asks for login-gated review dashboards or private account data.
- The lane depends on unapproved paid scraping.
- The output makes download, revenue, ranking, or sentiment claims without source support.
- The output treats competitor marketing copy as proof of user behavior.

## Completion Checklist

- [ ] Official marketplace/company sources checked first
- [ ] Review/user language captured only from allowed public sources
- [ ] Pricing/paywall evidence separated from user backlash evidence
- [ ] Blocked sources and no-signal sources recorded
- [ ] Factual claims cited with source type and confidence
- [ ] Decision implication stated

## References

- `references/source-priority.md`
- `references/output-rules.md`
- `references/test-cases.md`
