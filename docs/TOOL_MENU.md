# Research Tool Menu

This is the canonical source for allowed, conditional, optional paid, and banned tools/actions in research runs. The active profile and run brief may narrow this menu, but they must not silently broaden it.

## Default Allowed Tools

Use these by default when they are available in the current Codex/Composio environment:

| Tool class | Use | Rules |
| --- | --- | --- |
| Composio Search or equivalent public web search | Discover public sources, official pages, app listings, public reports, and public user-language surfaces | Prefer primary sources and official platform/API surfaces before summaries |
| Browser/open URL or equivalent public page inspection | Inspect public pages, app listings, docs, pricing pages, policies, and cited sources | Use public pages only; do not log in or bypass access limits |
| Local/cheap extraction | Save page text, screenshots provided by the user, local notes, tables, citations, and run outputs | Prefer local extraction when a page can be inspected without hosted crawling |
| Robots.txt and sitemap preflight | Check whether a site exposes crawl guidance before any crawling request | Record blocked or disallowed sources in the lane source log |
| Official APIs and platform-owned exports | Use platform-approved access paths for app, store, search, report, policy, legal, vendor, finance, technical, or literature research | Official APIs come before scraping or hosted extraction |
| Local file/repo writing | Write `raw/`, `extracted/`, and `output/` artifacts inside the current run folder | Do not write outside the repo or mutate private accounts |

## Conditional Tools Requiring Approval

These are allowed only when the run brief explicitly approves them and names the cap, API/account setup, and stop condition:

| Tool | Allowed use | Approval required |
| --- | --- | --- |
| Cloudflare Browser Run `/crawl` | Small capped proof of concept for public pages after robots.txt/sitemap preflight | Explicit API setup approval and a run-specific page/domain cap |
| Cloudflare Browser Run `/markdown` | Convert a small set of approved public pages to markdown | Explicit API setup approval and page cap |
| Cloudflare Browser Run `/json` | Extract structured data from a small set of approved public pages | Explicit API setup approval and schema/page cap |
| Any hosted browser/extractor with billable usage | Public-source extraction where local/browser inspection is insufficient | Explicit cost cap and approved API/account setup |

## Optional Paid Fallbacks

These are not default tools. Use only after the project owner explicitly approves the API key/account setup, scope, cap, and cost exposure in the run brief:

- Firecrawl (optional paid fallback)
- Apify (optional paid fallback)
- SerpAPI (optional paid fallback)
- Tavily (optional paid fallback)
- Exa (optional paid fallback)

Optional paid fallbacks must be marked in the lane output as conditional/approved tools. If approval is absent, treat them as unavailable and use default public web/search/browser/local extraction instead.

## Platform And Domain Research Rules

- Use official APIs, platform search pages, official app listings, official pricing pages, public policy pages, laws/regulations, source-owned docs, public reports, and source-owner publications before scraping.
- For app marketplace research, prefer official marketplace pages and public metadata first. Use paid scrapers only when approved and capped.
- For YouTube, Reddit, podcast, forum, public social, review, legal, vendor, finance, technical, or literature evidence, collect only what the brief needs and what the source permits.
- Record negative evidence, blocked sources, no-signal sources, and platform limitations.
- Never treat scraped summaries as stronger than the underlying source.
- Do not use private account data unless the project owner explicitly scopes that account into the run.

## Blocked Source Logging

For each blocked source, log the source, reason blocked, attempted access method, substitute source used or not used, confidence impact, and whether it affects decision quality.

## Banned Tools/Actions

These are banned for default research runs and must not be used as a workaround:

- captcha bypass
- paywall bypass
- login bypass
- stealth scraping
- residential proxies
- mass social scraping
- LinkedIn scraping
- scraping private or personal accounts
- Gmail
- Calendar
- Slack
- Supabase
- Vercel
- Stripe
- production databases
- billing tools
- posting tools
- sending tools
- destructive tools
- account-setting mutation
- private account actions

Do not send, post, publish, email, schedule, delete, deploy, charge, migrate, seed, update, or mutate external systems during research.

## Tool-Use Decision Rules

1. Start with the narrowest default public tool that can answer the lane question.
2. Prefer primary sources, official APIs, official listings, and source-owned docs before secondary commentary.
3. Use local/browser inspection and cheap extraction before hosted crawling.
4. Check robots.txt and sitemap guidance before any crawl-style tool.
5. Use optional paid fallbacks only when the brief explicitly approves them.
6. Record every source checked, including blocked, weak, duplicate, or no-signal sources.
7. Save raw evidence before synthesis.
8. Stop and report if the needed source requires a banned action or unapproved conditional tool.
