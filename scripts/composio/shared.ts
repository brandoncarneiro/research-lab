import { readFile, writeFile } from "node:fs/promises";
import { basename, resolve } from "node:path";
import { Composio, type ToolKitItem } from "@composio/core";

export const LOCAL_DEV_DEFAULT_USER_ID = "research-lab-user";
export const SESSION_STATE_FILENAME = ".composio-research-sessions.json";
export const SESSION_STATE_PATH = resolve(process.cwd(), SESSION_STATE_FILENAME);

export type StoredResearchSession = {
  profileName: string;
  sessionId: string;
  mcpUrl: string;
  toolkitSlugs: string[];
  createdAt: string;
  updatedAt: string;
};

export type ResearchSessionState = {
  updatedAt: string;
  profiles: StoredResearchSession[];
};

export function getRequiredApiKey(scriptPath = process.argv[1] ?? "script"): string {
  const apiKey = process.env.COMPOSIO_API_KEY?.trim();

  if (!apiKey) {
    console.error(
      [
        `Missing COMPOSIO_API_KEY for ${basename(scriptPath)}.`,
        "Set it in the environment before running this script.",
        "Example: export COMPOSIO_API_KEY=...",
        "The key is never printed by these scripts.",
      ].join("\n"),
    );
    process.exit(1);
  }

  return apiKey;
}

export function getComposioUserId(): string {
  const userId = process.env.COMPOSIO_USER_ID?.trim();

  if (userId) {
    return userId;
  }

  console.warn(
    `COMPOSIO_USER_ID is not set; using local-dev default "${LOCAL_DEV_DEFAULT_USER_ID}".`,
  );
  return LOCAL_DEV_DEFAULT_USER_ID;
}

export function createComposioClient(): Composio {
  return new Composio({
    apiKey: getRequiredApiKey(),
  });
}

export function parseFilterArg(args: readonly string[]): string | undefined {
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];

    if (arg === "--filter") {
      return args[index + 1]?.trim().toLowerCase();
    }

    if (arg?.startsWith("--filter=")) {
      return arg.slice("--filter=".length).trim().toLowerCase();
    }
  }

  return undefined;
}

export function requireCliArg(args: readonly string[], label: string): string {
  const value = args.find((arg) => !arg.startsWith("--"))?.trim();

  if (!value) {
    console.error(`Missing required ${label}.`);
    process.exit(1);
  }

  return value;
}

export async function getAvailableToolkits(composio: Composio): Promise<ToolKitItem[]> {
  const response = await composio.toolkits.get({
    managedBy: "all",
    sortBy: "alphabetically",
    limit: 1000,
  });

  return Array.isArray(response) ? response : [];
}

export function filterToolkits(toolkits: ToolKitItem[], filter: string | undefined): ToolKitItem[] {
  if (!filter) {
    return toolkits;
  }

  return toolkits.filter((toolkit) => {
    const categories = toolkit.meta.categories?.map((category) => category.name).join(" ") ?? "";
    const haystack = [
      toolkit.slug,
      toolkit.name,
      toolkit.meta.description ?? "",
      categories,
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(filter);
  });
}

export function connectionStatus(toolkit: ToolKitItem): string {
  const maybeConnection = (toolkit as unknown as { connection?: { isActive?: boolean } }).connection;

  if (toolkit.noAuth) {
    return "no-auth";
  }

  if (maybeConnection?.isActive === true) {
    return "connected";
  }

  if (maybeConnection?.isActive === false) {
    return "not-connected";
  }

  return "n/a";
}

export function shortText(value: string | undefined, maxLength = 120): string {
  if (!value) {
    return "";
  }

  const compact = value.replace(/\s+/g, " ").trim();
  if (compact.length <= maxLength) {
    return compact;
  }

  return `${compact.slice(0, maxLength - 3)}...`;
}

export async function readSessionState(): Promise<ResearchSessionState> {
  try {
    const raw = await readFile(SESSION_STATE_PATH, "utf8");
    const parsed = JSON.parse(raw) as Partial<ResearchSessionState>;

    return {
      updatedAt: typeof parsed.updatedAt === "string" ? parsed.updatedAt : new Date(0).toISOString(),
      profiles: Array.isArray(parsed.profiles) ? parsed.profiles.filter(isStoredSession) : [],
    };
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return { updatedAt: new Date(0).toISOString(), profiles: [] };
    }

    throw error;
  }
}

export async function writeSessionState(state: ResearchSessionState): Promise<void> {
  await writeFile(SESSION_STATE_PATH, `${JSON.stringify(state, null, 2)}\n`, "utf8");
}

function isStoredSession(value: unknown): value is StoredResearchSession {
  if (!value || typeof value !== "object") {
    return false;
  }

  const record = value as Record<string, unknown>;
  return (
    typeof record.profileName === "string" &&
    typeof record.sessionId === "string" &&
    typeof record.mcpUrl === "string" &&
    Array.isArray(record.toolkitSlugs) &&
    record.toolkitSlugs.every((slug) => typeof slug === "string") &&
    typeof record.createdAt === "string" &&
    typeof record.updatedAt === "string"
  );
}
