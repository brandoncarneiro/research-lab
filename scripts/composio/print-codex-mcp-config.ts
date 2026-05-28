import {
  getRequiredApiKey,
  maskMcpUrl,
  readSessionState,
  SENSITIVE_COMPOSIO_OUTPUT_ENV,
  SESSION_STATE_FILENAME,
  shouldShowSensitiveComposioOutput,
} from "./shared.js";

getRequiredApiKey();

const state = await readSessionState();
const showSensitiveOutput = shouldShowSensitiveComposioOutput();

if (state.profiles.length === 0) {
  console.error(
    `No stored Composio research sessions found in ${SESSION_STATE_FILENAME}. Run npm run composio:create-research-sessions first.`,
  );
  process.exit(1);
}

console.log("# Codex MCP commands for Research Lab research-scoped Composio sessions");
console.log("# API keys are not printed.");
console.log("# MCP URLs and session identifiers are sensitive-ish: do not paste them into issues, docs, chat, or logs.");
console.log(
  "# Some Codex CLI versions expose --bearer-token-env-var for HTTP MCP servers. Composio docs may require an x-api-key header for some orgs.",
);
console.log(
  "# If your Composio org requires x-api-key and bearer auth does not work, confirm current Codex header support or use an approved local proxy.",
);
console.log("");

if (!showSensitiveOutput) {
  console.log(
    `# Full MCP URLs are masked by default. Set ${SENSITIVE_COMPOSIO_OUTPUT_ENV}=1 in a private terminal to print copy-paste commands.`,
  );
  console.log("");
}

for (const profile of state.profiles) {
  const urlForOutput = showSensitiveOutput ? profile.mcpUrl : maskMcpUrl(profile.mcpUrl);

  console.log(`# ${profile.profileName}`);
  console.log(`codex mcp add ${profile.profileName} --url "${urlForOutput}"`);
  console.log(
    `# If accepted by your Composio MCP settings, prefer keeping the secret in env rather than inline:`,
  );
  console.log(
    `codex mcp add ${profile.profileName} --url "${urlForOutput}" --bearer-token-env-var COMPOSIO_API_KEY`,
  );
  if (!showSensitiveOutput) {
    console.log(`# Masked. Re-run with ${SENSITIVE_COMPOSIO_OUTPUT_ENV}=1 only when ready to add this server locally.`);
  }
  console.log("");
}
