import type {
  Session,
  ToolRouterConfigTags,
  ToolRouterCreateSessionConfig,
  ToolRouterUpdateSessionConfig,
} from "@composio/core";
import {
  createComposioClient,
  getAvailableToolkits,
  getComposioUserId,
  maskMcpUrl,
  maskSensitiveValue,
  readSessionState,
  writeSessionState,
  type StoredResearchSession,
} from "./shared.js";

type ResearchSessionProfile = {
  name: string;
  allowedIntent: string[];
  toolkitSlugs: string[];
  tags: ToolRouterConfigTags;
  requiresExplicitApproval?: true;
  workbench?: {
    enable: true;
    sandboxSize?: "standard" | "medium" | "large" | "xlarge";
  };
};

// Edit these slugs after running:
// npm run composio:list-toolkits -- --filter <search-term>
//
// PLACEHOLDER_* slugs are intentionally not verified. Replace them with
// discovered toolkit slugs before relying on a scoped session.
const DEFAULT_PUBLIC_DISCOVERY_PLACEHOLDER_SLUGS = [
  "PLACEHOLDER_COMPOSIO_SEARCH_TOOLKIT",
  "PLACEHOLDER_PUBLIC_BROWSER_TOOLKIT",
];

const RESEARCH_SESSION_PROFILES: ResearchSessionProfile[] = [
  {
    name: "research_lab_web",
    allowedIntent: [
      "Composio Search or equivalent public web discovery",
      "browser/open URL for public pages",
      "local/cheap extraction where possible",
      "official APIs first for platform research",
      "robots.txt and sitemap preflight before crawling",
    ],
    toolkitSlugs: DEFAULT_PUBLIC_DISCOVERY_PLACEHOLDER_SLUGS,
    tags: {
      enable: ["readOnlyHint"],
      disable: ["destructiveHint"],
    },
  },
  {
    name: "research_lab_synthesis",
    allowedIntent: [
      "local/workbench/file/repo writing within the run boundary",
      "no web unless explicitly enabled later",
    ],
    toolkitSlugs: [
      "PLACEHOLDER_WORKBENCH_TOOLKIT", // Composio may expose workbench as a session option, not a toolkit.
    ],
    tags: {
      enable: ["readOnlyHint"],
      disable: ["destructiveHint"],
    },
    workbench: {
      enable: true,
      sandboxSize: "standard",
    },
  },
  {
    name: "research_lab_optional_paid_fallbacks",
    allowedIntent: [
      "optional paid fallback only after explicit brief approval",
      "Firecrawl optional paid fallback",
      "Apify optional paid fallback",
      "SerpAPI optional paid fallback",
      "Tavily optional paid fallback",
      "Exa optional paid fallback",
    ],
    toolkitSlugs: [
      "firecrawl", // Optional paid fallback. Requires approval/API setup/cap in the run brief.
      "apify", // Optional paid fallback. Requires approval/API setup/cap in the run brief.
      "serpapi", // Optional paid fallback. Requires approval/API setup/cap in the run brief.
      "tavily", // Optional paid fallback. Requires approval/API setup/cap in the run brief.
      "exa", // Optional paid fallback. Requires approval/API setup/cap in the run brief.
    ],
    tags: {
      enable: ["readOnlyHint"],
      disable: ["destructiveHint"],
    },
    requiresExplicitApproval: true,
  },
];

const discoveryMode =
  process.env.RESEARCH_LAB_COMPOSIO_DISCOVERY_MODE === "1" ||
  process.env.RESEARCH_LAB_COMPOSIO_DRY_RUN === "1";
const placeholderProfiles = RESEARCH_SESSION_PROFILES.map((profile) => ({
  name: profile.name,
  placeholderSlugs: profile.toolkitSlugs.filter(isPlaceholderSlug),
})).filter((profile) => profile.placeholderSlugs.length > 0);

printSessionCreationPolicyNotice();

if (placeholderProfiles.length > 0) {
  printPlaceholderSlugWarning(placeholderProfiles);

  if (discoveryMode) {
    console.log("");
    console.log("Discovery/dry-run mode enabled. No Composio API calls were made and no sessions were created.");
    process.exit(0);
  }

  console.error("");
  console.error(
    [
      "Refusing to create Composio sessions while PLACEHOLDER_* toolkit slugs are configured.",
      "Run toolkit discovery first, replace placeholders with exact verified slugs, then rerun this script.",
      "For a no-mutation discovery preview, set RESEARCH_LAB_COMPOSIO_DISCOVERY_MODE=1.",
    ].join("\n"),
  );
  process.exit(1);
}

const composio = createComposioClient();
const userId = getComposioUserId();
const catalog = await getAvailableToolkits(composio);
const catalogSlugs = new Set(catalog.map((toolkit) => toolkit.slug));
const priorState = await readSessionState();
const nextProfiles: StoredResearchSession[] = [];
const includeOptionalPaidProfiles = process.env.RESEARCH_LAB_INCLUDE_OPTIONAL_PAID_PROFILES === "1";
const profilesToProcess = RESEARCH_SESSION_PROFILES.filter((profile) => {
  if (!profile.requiresExplicitApproval) {
    return true;
  }

  if (includeOptionalPaidProfiles) {
    return true;
  }

  console.warn(
    `Skipping ${profile.name}; optional paid fallback profiles require explicit approval and RESEARCH_LAB_INCLUDE_OPTIONAL_PAID_PROFILES=1.`,
  );
  return false;
});

console.log(`Creating/updating Composio research sessions for user "${maskSensitiveValue(userId)}".`);

for (const profile of profilesToProcess) {
  const verifiedToolkitSlugs = profile.toolkitSlugs.filter((slug) => catalogSlugs.has(slug));
  const missingToolkitSlugs = profile.toolkitSlugs.filter((slug) => !catalogSlugs.has(slug));
  const existing = priorState.profiles.find((stored) => stored.profileName === profile.name);

  console.log("");
  console.log(`Profile: ${profile.name}`);
  console.log(`Allowed intent: ${profile.allowedIntent.join("; ")}`);

  if (missingToolkitSlugs.length > 0) {
    console.warn(`Missing/unverified toolkit slugs: ${missingToolkitSlugs.join(", ")}`);
  }

  if (verifiedToolkitSlugs.length === 0 && !profile.workbench?.enable) {
    console.warn("No verified toolkit slugs remain and workbench is disabled. Skipping session creation.");
    continue;
  }

  const config = buildSessionConfig(profile, verifiedToolkitSlugs);
  const { session, operation } = await createOrUpdateSession(existing, config);
  const now = new Date().toISOString();
  const headerNames = Object.keys(session.mcp.headers ?? {});
  const stored: StoredResearchSession = {
    profileName: profile.name,
    sessionId: session.sessionId,
    mcpUrl: session.mcp.url,
    toolkitSlugs: verifiedToolkitSlugs,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  };

  nextProfiles.push(stored);

  console.log(`Operation: ${operation}`);
  console.log(`Session ID (masked): ${maskSensitiveValue(stored.sessionId)}`);
  console.log(`Session MCP URL (masked): ${maskMcpUrl(stored.mcpUrl)}`);
  console.log(`Enabled toolkit slugs: ${verifiedToolkitSlugs.length ? verifiedToolkitSlugs.join(", ") : "(none)"}`);
  console.log(
    `Missing/unverified toolkit slugs: ${missingToolkitSlugs.length ? missingToolkitSlugs.join(", ") : "(none)"}`,
  );
  console.log(`MCP header names: ${headerNames.length ? headerNames.join(", ") : "(none reported)"}`);
  console.log(`Suggested Codex MCP server name: ${profile.name}`);
}

const preservedProfiles = priorState.profiles.filter(
  (stored) => !profilesToProcess.some((profile) => profile.name === stored.profileName),
);

await writeSessionState({
  updatedAt: new Date().toISOString(),
  profiles: [...preservedProfiles, ...nextProfiles].sort((a, b) =>
    a.profileName.localeCompare(b.profileName),
  ),
});

console.log("");
console.log("Wrote .composio-research-sessions.json. This local-only gitignored file contains raw session IDs and MCP URLs.");

function printSessionCreationPolicyNotice(): void {
  console.log("Optional Composio research session setup:");
  console.log("- Research Lab works without Composio when Codex has ordinary web/browser/file tools.");
  console.log("- Research-scoped Composio sessions are advanced hardening, not a first-run blocker.");
  console.log("- Exact toolkit slugs must be discovered and verified before session creation.");
  console.log("- Raw session IDs and MCP URLs are stored locally, but terminal output is masked by default.");
}

function printPlaceholderSlugWarning(
  profiles: readonly { name: string; placeholderSlugs: string[] }[],
): void {
  console.warn("");
  console.warn("Placeholder toolkit slugs remain configured:");

  for (const profile of profiles) {
    console.warn(`- ${profile.name}: ${profile.placeholderSlugs.join(", ")}`);
  }
}

function isPlaceholderSlug(slug: string): boolean {
  return slug.startsWith("PLACEHOLDER_");
}

function buildSessionConfig(
  profile: ResearchSessionProfile,
  verifiedToolkitSlugs: string[],
): ToolRouterCreateSessionConfig & ToolRouterUpdateSessionConfig {
  const config: ToolRouterCreateSessionConfig & ToolRouterUpdateSessionConfig = {
    toolkits: { enable: verifiedToolkitSlugs },
    tags: profile.tags,
    manageConnections: { enable: false },
  };

  if (profile.workbench) {
    config.workbench = profile.workbench;
  }

  return config;
}

async function createOrUpdateSession(
  existing: StoredResearchSession | undefined,
  config: ToolRouterCreateSessionConfig & ToolRouterUpdateSessionConfig,
): Promise<{ session: Session<unknown, unknown, never>; operation: string }> {
  if (existing) {
    try {
      const session = await composio.use(existing.sessionId);
      await session.update(config);
      return { session, operation: "updated existing session" };
    } catch (error) {
      console.warn(
        `Could not reuse session ${maskSensitiveValue(existing.sessionId)}; creating a replacement. Reason: ${errorMessage(error)}`,
      );
    }
  }

  const session = await composio.create(userId, config);
  return { session, operation: existing ? "created replacement session" : "created new session" };
}

function errorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return String(error);
}
