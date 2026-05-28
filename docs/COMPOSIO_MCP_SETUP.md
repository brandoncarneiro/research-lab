# Composio MCP Setup

Composio MCP is optional advanced tooling for teams that want a stricter runtime boundary around Codex research tools.

Research Lab does not require Composio. The default runtime works with local files, checked source packs, existing raw artifacts, and command executors. If a project uses Composio for source collection before writing raw lane artifacts, that collection must follow `docs/TOOL_MENU.md` rather than mixing unrelated account, paid, or production tools into research work.

## Policy

- Treat Composio MCP as optional hardening, not the default onboarding path.
- Use `docs/TOOL_MENU.md` as the canonical tool policy.
- If Composio is enabled, the exposed menu should contain only research tools.
- Default to public web/search, browser/open URL, local/cheap extraction, robots.txt/sitemap preflight, official APIs first, and file/repo writing for run artifacts.
- Keep Firecrawl, Apify, SerpAPI, Tavily, and Exa as optional paid fallbacks only after explicit approval and API/account setup.
- Keep Gmail, Calendar, Slack, Supabase, Vercel, Stripe, production databases, and sending/posting tools out unless explicitly needed.
- Codex should not use tools outside the research menu.
- A broad generic Composio MCP can be used for supervised experiments only when the run brief restricts usage to `docs/TOOL_MENU.md`.
- Use the TypeScript session-management scripts in this repo to create filtered research-scoped Composio sessions when you need stronger tool isolation.
- Do not create custom Composio tools or toolkits for research scoping unless current Composio SDK docs prove they are required.

## Research-Scoped Menu

The approved menu is documented in `docs/TOOL_MENU.md`. The menu is intentionally narrow:

- Discover public sources.
- Open and inspect public URLs.
- Extract locally/cheaply where possible.
- Check robots.txt and sitemaps before any crawl-style action.
- Use official APIs first for platform research.
- Use hosted crawling/scraping only when approved, capped, and recorded in the brief.
- Write run artifacts into the local repo.

## Excluded By Default

The default research menu should exclude:

- Gmail
- Calendar
- Slack
- Supabase
- Vercel
- Stripe
- production databases
- posting tools
- sending tools
- destructive tools
- private account actions

These tools can be added only for a specific run when the project owner explicitly says they are needed and the run brief records why they are in scope.

## Session Setup

Skip this section if you are running Research Lab with ordinary Codex web/browser/file tools.

Filtered MCP sessions are built with:

```bash
npm run composio:list-toolkits -- --filter search
npm run composio:list-toolkits -- --filter browser
npm run composio:create-research-sessions
npm run composio:print-codex-mcp-config
```

See `docs/COMPOSIO_SESSION_BUILD.md` for the full build and verification flow.

The session scripts store raw session IDs and MCP URLs only in the local gitignored `.composio-research-sessions.json` file. Terminal output masks raw MCP URLs unless you explicitly opt in with `RESEARCH_LAB_SHOW_SENSITIVE_COMPOSIO_OUTPUT=1` in a private shell.

## Setup Expectations

Before a run starts, confirm that any external collection tool is allowed by `docs/TOOL_MENU.md` and needed for the brief. That can be a narrow Composio MCP session or a supervised generic Composio MCP constrained by the run brief.

If the needed tool is unavailable, record the blocker in the run folder and stop rather than substituting an unapproved tool.

Do not broaden tool access just to make a run easier. The point of the menu is to keep research auditable, source-grounded, and separated from private accounts and production systems.
