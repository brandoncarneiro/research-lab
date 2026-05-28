# Composio Session Build

This is optional advanced setup. Research Lab works without Composio when Codex has ordinary public web/search, browser/open URL, local file, and repo-write tools.

Use Composio sessions only when you want a runtime boundary around research tools. A session controls which toolkits are available, which behavior tags are allowed, and which MCP URL Codex should connect to.

For an early supervised run, no Composio setup is required. A broad generic Composio MCP is also acceptable for supervised experiments if the run brief restricts tool usage to `docs/TOOL_MENU.md`. Research-scoped sessions are a hardening path, not a first-run requirement.

## Why Sessions, Not Custom Toolkits

Use sessions because Composio already supports scoped runtime configuration:

- `composio.create(userId, config)` creates a session for a specific user and tool boundary.
- `toolkits` restricts the catalog exposed to that session.
- `tags` can enable `readOnlyHint` and disable `destructiveHint`.
- `session.mcp.url` exposes the MCP endpoint for an MCP-compatible client.
- `composio.use(sessionId)` and `session.update(...)` allow reuse/update instead of creating duplicates.

Do not create custom Composio tools or toolkits for this task. They are unnecessary for research scoping unless current SDK docs prove otherwise.

## Environment

Skip this section unless you are using the optional Composio scripts.

Copy `.env.example` if you want a local shell file, but export the variables before running scripts:

```bash
export COMPOSIO_API_KEY=...
export COMPOSIO_USER_ID=research-lab-user
```

Rules:

- `COMPOSIO_API_KEY` is required.
- `COMPOSIO_USER_ID` defaults locally to `research-lab-user` if unset.
- The scripts never print `COMPOSIO_API_KEY`.
- `.env` and `.composio-research-sessions.json` are gitignored.
- `.composio-research-sessions.json` contains raw session IDs and MCP URLs. Treat it as local-only.
- Full MCP URLs are masked in terminal output unless `RESEARCH_LAB_SHOW_SENSITIVE_COMPOSIO_OUTPUT=1` is set in a private terminal.

## List Toolkits

Use this to discover exact toolkit slugs:

```bash
npm run composio:list-toolkits -- --filter search
npm run composio:list-toolkits -- --filter browser
npm run composio:list-toolkits -- --filter official
npm run composio:list-toolkits -- --filter workbench
```

The script prints:

- slug
- name
- connection status if available
- tool count if available
- description

It does not mutate Composio state.

## Inspect Toolkits

Use this after discovering a candidate slug:

```bash
npm run composio:inspect-toolkit -- <confirmed-slug>
```

The script prints tool slug, name, description, and tags if available. It does not mutate Composio state.

## Edit Session Profile Slugs

Edit `RESEARCH_SESSION_PROFILES` at the top of `scripts/composio/create-research-sessions.ts`.

Default Research Lab session profiles:

- `research_lab_web`
- `research_lab_optional_paid_fallbacks`
- `research_lab_synthesis`

The configured slugs are placeholders until confirmed by `composio:list-toolkits`. The script prints missing/unverified slugs and only enables slugs found in the current Composio toolkit catalog.

Do not pretend unknown slugs are verified. If a slug is missing, either replace it with the discovered slug or leave it listed as missing in the script output.

Optional paid fallback slugs such as Firecrawl, Apify, SerpAPI, Tavily, and Exa are disabled by default. Enable that profile only after the run brief records approval, API/account setup, caps, and stop conditions.

## Create Or Update Sessions

Run:

```bash
npm run composio:create-research-sessions
```

Behavior:

- Reads `COMPOSIO_API_KEY`.
- Reads `COMPOSIO_USER_ID`, defaulting locally to `research-lab-user` for the current default profile.
- Fetches the Composio toolkit catalog.
- Warns for missing/unverified configured slugs.
- Skips optional paid fallback profiles unless explicitly enabled.
- Reuses stored session IDs with `composio.use(sessionId)` when possible.
- Updates reused sessions with current profile config.
- Creates replacement sessions if reuse fails.
- Writes `.composio-research-sessions.json`.
- Masks session IDs and MCP URLs in terminal output.

The local session state file contains:

- profile name
- session ID
- MCP URL
- verified toolkit slugs
- created timestamp
- updated timestamp

## Add MCP URLs To Codex

After sessions exist, run:

```bash
npm run composio:print-codex-mcp-config
```

By default, the script prints masked commands so terminal logs do not casually expose MCP URLs:

```bash
codex mcp add research_lab_web --url "https://connect.composio.dev/..."
```

When you are ready to add the MCP servers locally, run it in a private terminal with explicit sensitive-output opt-in:

```bash
RESEARCH_LAB_SHOW_SENSITIVE_COMPOSIO_OUTPUT=1 npm run composio:print-codex-mcp-config
```

That prints copy-paste Codex commands:

```bash
codex mcp add research_lab_web --url "<MCP_URL>"
codex mcp add research_lab_optional_paid_fallbacks --url "<MCP_URL>"
codex mcp add research_lab_synthesis --url "<MCP_URL>"
```

Some Codex CLI versions expose `--bearer-token-env-var` for streamable HTTP MCP servers:

```bash
codex mcp add research_lab_web --url "<MCP_URL>" --bearer-token-env-var COMPOSIO_API_KEY
```

Composio docs may require an `x-api-key` header for some organizations. Do not paste or print the API key. If bearer auth does not work, confirm current Codex header support or use an approved local proxy before adding the MCP server.

Do not paste full MCP URLs or session IDs into issues, documentation, chat, screenshots, or shared logs.

## Verify Codex Sees The Sessions

After adding the MCP servers:

```bash
codex mcp list
```

Then start a Codex session and verify the available MCP servers/tools are limited to the research sessions. If a broad Composio server is also enabled globally, either disable it before running research or keep collection scoped to `docs/TOOL_MENU.md` for the supervised run.

## What Not To Connect

Keep these out of research sessions by default:

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

Add one only when the project owner explicitly scopes it into a run brief.

Also keep these out of all default research sessions:

- captcha bypass
- paywall bypass
- login bypass
- stealth scraping
- residential proxies
- mass social scraping
- LinkedIn scraping
- scraping private or personal accounts
- paid fallback tools unless approved and capped

## Troubleshooting

### Missing API Key

Symptom:

```text
Missing COMPOSIO_API_KEY
```

Fix:

```bash
export COMPOSIO_API_KEY=...
```

Do not commit `.env`, and do not paste the key into docs or Git history.

### Unknown Toolkit Slug

Symptom:

```text
Missing/unverified toolkit slugs: ...
```

Fix:

```bash
npm run composio:list-toolkits -- --filter <term>
npm run composio:inspect-toolkit -- <confirmed-slug>
```

Then edit `RESEARCH_SESSION_PROFILES`.

### Auth Config Required

Some toolkits require connected accounts or auth configs before execution. Do not connect private accounts by default. Record the blocker in the run folder and ask the project owner before expanding scope.

### MCP URL Generated But Codex Cannot Use It

Check:

- Does `codex mcp add --help` support the required auth mode?
- Does the Composio MCP endpoint require `x-api-key` headers?
- Is `COMPOSIO_API_KEY` present in the shell that launches Codex?
- Is a global broad Composio MCP server shadowing the research-scoped servers?

Do not print the API key while debugging.

### Too Many Tools Exposed

If Codex sees too many tools:

1. Tighten `toolkitSlugs` in `RESEARCH_SESSION_PROFILES`.
2. Keep `tags.enable = ["readOnlyHint"]` for read-only research sessions.
3. Keep `tags.disable = ["destructiveHint"]`.
4. Avoid `preload.tools = "all"` unless the verified toolkit is small and intentionally scoped.
5. Disable any global broad Composio MCP server before starting research, or use strict run-brief tool policy only for the supervised first P0 run.
