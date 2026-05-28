# Test Cases

## Should Trigger

- "Run an App Store competitor audit for named apps in the active profile."
- "Collect review language about app paywall backlash."
- "Map competitor App Store screenshots and trust claims for the competitive trust lane."

Expected result:

- Codex loads `agents/app-store-competitor-audit/AGENT.md`.
- The lane follows `docs/TOOL_MENU.md`.
- Output is saved to `raw/{lane-name}.md`.

## Should Not Trigger

- "Synthesize the final master research report."
- "Research regulatory objections to an AI product."
- "Scrape LinkedIn profiles for founders."
- "Use an unapproved paid scraper to pull all reviews."

Expected result:

- Codex uses the generic supervisor, a more relevant agent pack, or records a blocker.

## Functional Output Tests

A valid output must:

- cite marketplace/company sources for listing claims
- separate review language from pricing/paywall facts
- record blocked or no-signal sources
- avoid download/revenue/ranking claims without methodology
- state what the evidence proves and does not prove

## Failure Cases

Stop or mark blocked when:

- the lane requires login-gated data
- source access requires bypassing captcha, paywalls, or platform restrictions
- paid fallback tooling is needed but not approved
- the competitor list or decision is missing and cannot be inferred from the brief
