import { constants } from "node:fs";
import { access, readFile, readdir, stat } from "node:fs/promises";
import { join, relative } from "node:path";
import { validateArtifactProfile } from "../../src/artifact-checks.js";

const DEFAULT_ARTIFACT_PROFILE_PATH = "artifact-profiles/default.json";

const REQUIRED_TEMPLATE_FILES = [
  "templates/CEO_BRIEF.md",
  "templates/RAW_DATA_DIGEST.md",
  "templates/PROJECT_CONTEXT.md",
] as const;

const REQUIRED_OUTPUT_PATHS = [
  "output/CEO_BRIEF.md",
  "output/RAW_DATA_DIGEST.md",
  "output/PROJECT_CONTEXT.md",
] as const;

const REQUIRED_STANDARD_TERMS = [
  "Evidence ID Convention",
  "Source ID",
  "Pattern IDs",
  "`S1`",
  "`Q1`",
  "`P1`",
  "`C1`",
  "`N1`",
] as const;

const SCAN_ROOTS = [
  "README.md",
  "artifact-profiles",
  "docs",
  "templates",
  "src",
] as const;

type CheckLevel = "warning" | "blocked";

type Check = {
  level: CheckLevel;
  message: string;
};

type Match = {
  path: string;
  lineNumber: number;
  line: string;
};

const checks: Check[] = [];

const files = await collectFiles(SCAN_ROOTS);
const contents = await Promise.all(files.map(async (file) => ({ file, text: await readFile(file, "utf8") })));
const combinedText = contents.map(({ text }) => text).join("\n");

await verifyRequiredTemplates();
await verifyDefaultArtifactProfile();
verifyRequiredOutputs();
await verifyEvidenceStandard();
verifyMasterResearchIsLegacyOnly();
verifyNoExtraDefaultFinalArtifacts();

printStatus();

async function verifyRequiredTemplates(): Promise<void> {
  for (const file of REQUIRED_TEMPLATE_FILES) {
    if (!await isReadableFile(file)) {
      checks.push({ level: "blocked", message: `Missing or unreadable required artifact template: ${file}` });
    }
  }
}

async function verifyDefaultArtifactProfile(): Promise<void> {
  if (!await isReadableFile(DEFAULT_ARTIFACT_PROFILE_PATH)) {
    checks.push({ level: "blocked", message: `Missing or unreadable default artifact profile: ${DEFAULT_ARTIFACT_PROFILE_PATH}` });
    return;
  }

  try {
    const profile = JSON.parse(await readFile(DEFAULT_ARTIFACT_PROFILE_PATH, "utf8")) as unknown;
    for (const issue of validateArtifactProfile(DEFAULT_ARTIFACT_PROFILE_PATH, profile)) {
      checks.push({ level: "blocked", message: issue.message });
    }
  } catch (error) {
    checks.push({ level: "blocked", message: `Default artifact profile is invalid JSON: ${errorMessage(error)}` });
  }
}

function verifyRequiredOutputs(): void {
  for (const outputPath of REQUIRED_OUTPUT_PATHS) {
    if (!combinedText.includes(outputPath)) {
      checks.push({ level: "blocked", message: `Required output path is not documented in runtime contracts: ${outputPath}` });
    }
  }

  if (!/exactly three final artifacts/i.test(combinedText)) {
    checks.push({ level: "blocked", message: "Artifact standard does not state that runs produce exactly three final artifacts." });
  }
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

async function verifyEvidenceStandard(): Promise<void> {
  const standard = await readFile("docs/RESEARCH_STANDARD.md", "utf8");

  for (const term of REQUIRED_STANDARD_TERMS) {
    if (!standard.includes(term)) {
      checks.push({ level: "blocked", message: `Research standard is missing evidence-ID term: ${term}` });
    }
  }
}

function verifyMasterResearchIsLegacyOnly(): void {
  const matches = findMatches(/MASTER_RESEARCH\.md/);

  if (matches.length === 0) {
    return;
  }

  checks.push({
    level: "blocked",
    message: `MASTER_RESEARCH.md should not appear in the runtime artifact contract: ${formatMatches(matches)}`,
  });
}

function verifyNoExtraDefaultFinalArtifacts(): void {
  const defaultFinalArtifactPattern = /\b(final|required)\b.*\b(MASTER_RESEARCH\.md|report\.md|synthesis\.md)\b/i;
  const matches = findMatches(defaultFinalArtifactPattern);

  if (matches.length === 0) {
    return;
  }

  checks.push({
    level: "blocked",
    message: `Possible extra default final artifact reference found: ${formatMatches(matches)}`,
  });
}

async function collectFiles(paths: readonly string[]): Promise<string[]> {
  const collected: string[] = [];

  for (const path of paths) {
    const pathStats = await stat(path);

    if (pathStats.isDirectory()) {
      collected.push(...await collectFilesFromDirectory(path));
      continue;
    }

    if (pathStats.isFile() && shouldScanFile(path)) {
      collected.push(path);
    }
  }

  return collected.sort((a, b) => a.localeCompare(b));
}

async function collectFilesFromDirectory(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    if (entry.name === "node_modules" || entry.name === ".git") {
      continue;
    }

    const fullPath = join(directory, entry.name);

    if (entry.isDirectory()) {
      files.push(...await collectFilesFromDirectory(fullPath));
      continue;
    }

    if (entry.isFile() && shouldScanFile(fullPath)) {
      files.push(fullPath);
    }
  }

  return files;
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

function shouldScanFile(path: string): boolean {
  return /\.(md|ts|tsx|js|json)$/.test(path);
}

function findMatches(pattern: RegExp): Match[] {
  const matches: Match[] = [];

  for (const { file, text } of contents) {
    const lines = text.split(/\r?\n/);

    for (let index = 0; index < lines.length; index += 1) {
      const line = lines[index] ?? "";

      if (pattern.test(line)) {
        matches.push({
          path: relative(process.cwd(), file),
          lineNumber: index + 1,
          line,
        });
      }
    }
  }

  return matches;
}

function formatMatches(matches: Match[]): string {
  return matches.map((match) => `${match.path}:${match.lineNumber}`).join(", ");
}

function printStatus(): void {
  console.log("Artifact standard check:");
  console.log(`- files scanned: ${files.length}`);
  console.log(`- required artifact templates: ${REQUIRED_TEMPLATE_FILES.length}`);
  console.log(`- required output paths: ${REQUIRED_OUTPUT_PATHS.length}`);

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
