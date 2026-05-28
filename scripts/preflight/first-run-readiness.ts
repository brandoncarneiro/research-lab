import { access, readFile, stat } from "node:fs/promises";
import { constants } from "node:fs";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

const EXPECTED_PACKAGE_NAME = "research-lab";
const ACTIVE_PROFILE = process.env.RESEARCH_PROFILE ?? "example";

const REQUIRED_TRACKED_FILES = [
  "README.md",
  "RESEARCH_BACKLOG.md",
  "context/README.md",
  "CONTRIBUTING.md",
  "profiles/README.md",
  "SECURITY.md",
  `profiles/${ACTIVE_PROFILE}/PROFILE.md`,
  `profiles/${ACTIVE_PROFILE}/SOURCE_CONTEXT.md`,
  `profiles/${ACTIVE_PROFILE}/FIRST_RUN.md`,
  `profiles/${ACTIVE_PROFILE}/RESEARCH_BACKLOG.md`,
  `profiles/${ACTIVE_PROFILE}/TOOLING.md`,
  "docs/FIRST_RUN.md",
  "docs/TOOL_MENU.md",
  "docs/RESEARCH_STANDARD.md",
  "docs/OPERATING_MODEL.md",
  "docs/RUNBOOK.md",
  "src/cli.ts",
  "src/run.ts",
  "src/synthesize.ts",
  "src/validate.ts",
  "src/status.ts",
  "templates/00-brief.md",
  "templates/lane-output.md",
  "templates/RAW_DATA_DIGEST.md",
  "templates/CEO_BRIEF.md",
  "templates/CHATGPT_PROJECT_DOC.md",
  "examples/apollo-13-oxygen-tank-review/00-brief.md",
  "examples/apollo-13-oxygen-tank-review/run.json",
  "examples/apollo-13-oxygen-tank-review/validation/report.json",
] as const;

const EXPECTED_FOLDERS = [
  "context",
  "docs",
  "examples",
  "profiles",
  `profiles/${ACTIVE_PROFILE}`,
  "scripts",
  "src",
  "templates",
  "tests",
] as const;

type CheckLevel = "warning" | "blocked";

type Check = {
  level: CheckLevel;
  message: string;
};

const checks: Check[] = [];

await verifyRepoRoot();
await verifyRequiredTrackedFiles();
await verifyExpectedFolders();

printStatus();

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

    const raw = await readFile("package.json", "utf8");
    const packageJson = JSON.parse(raw) as { name?: unknown };

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

async function verifyRequiredTrackedFiles(): Promise<void> {
  for (const file of REQUIRED_TRACKED_FILES) {
    if (!await isReadableFile(file)) {
      checks.push({ level: "blocked", message: `Missing or unreadable required file: ${file}` });
      continue;
    }

  }
}

async function verifyExpectedFolders(): Promise<void> {
  for (const folder of EXPECTED_FOLDERS) {
    if (!await isReadableDirectory(folder)) {
      checks.push({ level: "blocked", message: `Missing or unreadable expected folder: ${folder}` });
    }
  }
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

function printStatus(): void {
  console.log("First-run readiness checks:");
  console.log(`- active profile: ${ACTIVE_PROFILE}`);
  console.log(`- required tracked files: ${REQUIRED_TRACKED_FILES.length}`);
  console.log(`- expected folders: ${EXPECTED_FOLDERS.length}`);

  if (checks.length === 0) {
    console.log("STATUS: READY");
    return;
  }

  for (const check of checks) {
    console.log(`- ${check.level.toUpperCase()}: ${check.message}`);
  }

  if (checks.some((check) => check.level === "blocked")) {
    console.log("STATUS: BLOCKED");
    process.exit(1);
  }

  console.log("STATUS: WARNING");
}

function errorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return String(error);
}
