# Composio MCP Setup

Composio MCP is the research tool layer for research runs in this repo. Codex and Codex subagents must follow `docs/TOOL_MENU.md` rather than mixing unrelated local, account, paid, or production tools into research work.

## Policy

- Composio MCP is the research tool layer.
- Use `docs/TOOL_MENU.md` as the canonical tool policy.
- The research menu should expose only research tools.
- Default to public web/search, browser/open URL, local/cheap extraction, robots.txt/sitemap preflight, official APIs first, and file/repo writing for run artifacts.
- Keep Firecrawl, Apify, SerpAPI, Tavily, and Exa as optional paid fallbacks only after explicit approval and API/account setup.
- Keep Gmail, Calendar, Slack, Supabase, Vercel, Stripe, production databases, and sending/posting tools out unless explicitly needed.
- Codex should not use tools outside the research menu.
- The existing generic Composio MCP is acceptable for early supervised runs if the prompt and run brief restrict usage to `docs/TOOL_MENU.md`.
- Use the TypeScript session-management scripts in this repo to create filtered research-scoped Composio sessions as the preferred hardening path.
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

Filtered MCP sessions are built with:

```bash
npm run composio:list-toolkits -- --filter search
npm run composio:list-toolkits -- --filter browser
npm run composio:create-research-sessions
npm run composio:print-codex-mcp-config
```

See `docs/COMPOSIO_SESSION_BUILD.md` for the full build and verification flow.

## Setup Expectations

Before a run starts, confirm that Codex can access the tools allowed by `docs/TOOL_MENU.md` and needed for the brief. For an early supervised run, a generic Composio MCP can be used if prompts strictly prohibit paid, private-account, destructive, sending/posting, and bypass tools.

If the needed tool is unavailable, record the blocker in the run folder and stop rather than substituting an unapproved tool.

Do not broaden tool access just to make a run easier. The point of the menu is to keep research auditable, source-grounded, and separated from private accounts and production systems.
