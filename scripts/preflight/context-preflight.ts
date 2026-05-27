import { access, readFile, readdir, stat } from "node:fs/promises";
import { constants } from "node:fs";
import { execFile } from "node:child_process";
import { join } from "node:path";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

const EXPECTED_PACKAGE_NAME = "research-lab";
const ACTIVE_PROFILE = process.env.RESEARCH_PROFILE ?? "example";
const PROFILE_DIR = `profiles/${ACTIVE_PROFILE}`;

const LOCAL_ONLY_PATHS = [
  "research/runs",
  "reports",
  "exports",
  "raw-inputs",
  "source-materials",
  "local-context",
] as const;

type CheckLevel = "info" | "warning" | "blocked";

type Check = {
  level: CheckLevel;
  message: string;
};

const checks: Check[] = [];

await verifyRepoRoot();
await verifyActiveProfile();
await verifyNoLocalOnlyContent();

printChecks();

async function verifyRepoRoot(): Promise<void> {
  try {
    const { stdout } = await execFileAsync("git", ["rev-parse", "--show-toplevel"]);
    const gitRoot = stdout.trim();

    if (gitRoot !== process.cwd()) {
      checks.push({
        level: "blocked",
        message: `Repo root check failed: current directory is ${process.cwd()}, but git root is ${gitRoot}.`,
      });
    }

    const packageJson = JSON.parse(await readFile("package.json", "utf8")) as { name?: unknown };

    if (packageJson.name !== EXPECTED_PACKAGE_NAME) {
      checks.push({
        level: "blocked",
        message: `Repo root check failed: package.json name is ${String(packageJson.name)}.`,
      });
    }
  } catch (error) {
    checks.push({
      level: "blocked",
      message: `Repo root check failed: cannot read package.json (${errorMessage(error)}).`,
    });
  }
}

async function verifyActiveProfile(): Promise<void> {
  const profileFile = `${PROFILE_DIR}/PROFILE.md`;

  if (!await isReadableFile(profileFile)) {
    checks.push({ level: "blocked", message: `Active profile is missing or unreadable: ${profileFile}` });
    return;
  }

  const sourceContextFile = `${PROFILE_DIR}/SOURCE_CONTEXT.md`;
  if (!await isReadableFile(sourceContextFile)) {
    checks.push({ level: "warning", message: `Active profile has no SOURCE_CONTEXT.md: ${sourceContextFile}` });
    return;
  }

  const sourceContext = await readFile(sourceContextFile, "utf8");
  if (!/external proof/i.test(sourceContext) || !/Do not commit private/i.test(sourceContext)) {
    checks.push({
      level: "warning",
      message: `${sourceContextFile} should explain private source handling and external-proof requirements.`,
    });
  }
}

async function verifyNoLocalOnlyContent(): Promise<void> {
  const allowed = new Set(["context/README.md", "context/.gitkeep"]);
  const disallowed: string[] = [];

  for (const path of LOCAL_ONLY_PATHS) {
    const entries = await listEntriesIfDirectory(path);
    disallowed.push(...entries);
  }

  for (const entry of await listEntriesIfDirectory("context")) {
    if (!allowed.has(entry)) {
      disallowed.push(entry);
    }
  }

  for (const entry of await listEntriesIfDirectory("profiles")) {
    if (entry.startsWith("profiles/private") || entry.includes("-private/")) {
      disallowed.push(entry);
    }
  }

  if (disallowed.length > 0) {
    checks.push({
      level: "blocked",
      message: `Local-only content exists in the public tree: ${disallowed.join(", ")}`,
    });
  }
}

async function listEntriesIfDirectory(path: string): Promise<string[]> {
  if (!await isReadableDirectory(path)) {
    return [];
  }

  const entries = await readdir(path, { withFileTypes: true });
  const results: string[] = [];

  for (const entry of entries) {
    const fullPath = join(path, entry.name);

    if (entry.isDirectory()) {
      results.push(...await listEntriesIfDirectory(fullPath));
      continue;
    }

    results.push(fullPath);
  }

  return results.sort((a, b) => a.localeCompare(b));
}

async function isReadableFile(path: string): Promise<boolean> {
  try {
    const fileStats = await stat(path);
    await access(path, constants.R_OK);
    return fileStats.isFile();
  } catch {
    return false;
  }
}

async function isReadableDirectory(path: string): Promise<boolean> {
  try {
    const directoryStats = await stat(path);
    await access(path, constants.R_OK);
    return directoryStats.isDirectory();
  } catch {
    return false;
  }
}

function printChecks(): void {
  const blocked = checks.filter((check) => check.level === "blocked");
  const warnings = checks.filter((check) => check.level === "warning");

  console.log("");
  console.log("Context preflight checks:");
  console.log(`- active profile: ${ACTIVE_PROFILE}`);

  if (checks.length === 0) {
    console.log("- no warnings or blockers");
  } else {
    for (const check of checks) {
      console.log(`- ${check.level.toUpperCase()}: ${check.message}`);
    }
  }

  console.log("");

  if (blocked.length > 0) {
    console.log("STATUS: BLOCKED");
    process.exit(1);
  }

  if (warnings.length > 0) {
    console.log("STATUS: WARNING");
    return;
  }

  console.log("STATUS: READY");
}

function errorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return String(error);
}
