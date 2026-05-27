import {
  getRequiredApiKey,
  readSessionState,
  SESSION_STATE_FILENAME,
} from "./shared.js";

getRequiredApiKey();

const state = await readSessionState();

if (state.profiles.length === 0) {
  console.error(
    `No stored Composio research sessions found in ${SESSION_STATE_FILENAME}. Run npm run composio:create-research-sessions first.`,
  );
  process.exit(1);
}

console.log("# Codex MCP commands for Research Lab research-scoped Composio sessions");
console.log("# API keys are not printed.");
console.log(
  "# This Codex CLI exposes --bearer-token-env-var for HTTP MCP servers. Composio docs may require an x-api-key header for some orgs.",
);
console.log(
  "# TODO: If your Composio org requires x-api-key and bearer auth does not work, confirm current Codex header support or use an approved local proxy.",
);
console.log("");

for (const profile of state.profiles) {
  console.log(`# ${profile.profileName}`);
  console.log(`codex mcp add ${profile.profileName} --url "${profile.mcpUrl}"`);
  console.log(
    `# If accepted by your Composio MCP settings, prefer keeping the secret in env rather than inline:`,
  );
  console.log(
    `codex mcp add ${profile.profileName} --url "${profile.mcpUrl}" --bearer-token-env-var COMPOSIO_API_KEY`,
  );
  console.log("");
}
