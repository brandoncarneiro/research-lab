import { readFile, readdir, stat } from "node:fs/promises";
import { join, relative } from "node:path";

const SCAN_ROOTS = [
  "README.md",
  "docs",
  "prompts",
  "templates",
  "RESEARCH_BACKLOG.md",
] as const;

const OPTIONAL_PAID_FALLBACK_TOOL_NAMES = [
  "Firecrawl optional paid fallback",
  "Apify optional paid fallback",
] as const;

const REQUIRED_BANNED_TOOL_TERMS = [
  "captcha",
  "paywall",
  "login",
  "stealth",
  "residential",
  "LinkedIn",
  "mass social",
  "private account",
  "Gmail",
  "Calendar",
  "Slack",
  "Supabase",
  "Vercel",
  "Stripe",
  "destructive",
  "posting",
  "sending",
] as const;

type Match = {
  path: string;
  lineNumber: number;
  line: string;
};

const files = await collectFiles(SCAN_ROOTS);
const contents = await Promise.all(files.map(async (file) => ({ file, text: await readFile(file, "utf8") })));

const paidToolMatches = findMatches(new RegExp(OPTIONAL_PAID_FALLBACK_TOOL_NAMES.map((name) => name.split(" ")[0]).join("|"), "i"));
const invalidPaidToolMatches = paidToolMatches.filter((match) => !isApprovedPaidFallbackLine(match.line));
const missingBannedTerms = REQUIRED_BANNED_TOOL_TERMS.filter((term) => !containsTerm(term));

console.log("Tool policy check:");
console.log(`- files scanned: ${files.length}`);
console.log("");
console.log("Optional paid fallback matched lines:");

if (paidToolMatches.length === 0) {
  console.log("- (none)");
} else {
  for (const match of paidToolMatches) {
    console.log(`- ${match.path}:${match.lineNumber}: ${match.line.trim()}`);
  }
}

if (missingBannedTerms.length > 0) {
  console.log("");
  console.log(`Missing banned-tool terms: ${missingBannedTerms.join(", ")}`);
}

if (invalidPaidToolMatches.length > 0) {
  console.log("");
  console.log("Invalid paid-fallback posture lines:");
  for (const match of invalidPaidToolMatches) {
    console.log(`- ${match.path}:${match.lineNumber}: ${match.line.trim()}`);
  }
}

if (invalidPaidToolMatches.length > 0 || missingBannedTerms.length > 0) {
  console.log("");
  console.log("STATUS: BLOCKED");
  process.exit(1);
}

console.log("");
console.log("STATUS: READY");

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

function shouldScanFile(path: string): boolean {
  return /\.(md|ts|tsx|js|json)$/.test(path);
}

function findMatches(pattern: RegExp): Match[] {
  const matches: Match[] = [];

  for (const { file, text } of contents) {
    const lines = text.split(/\r?\n/);

    lines.forEach((line, index) => {
      if (pattern.test(line)) {
        matches.push({
          path: relative(process.cwd(), file),
          lineNumber: index + 1,
          line,
        });
      }
    });
  }

  return matches;
}

function isApprovedPaidFallbackLine(line: string): boolean {
  if (!paidToolPattern().test(line)) {
    return true;
  }

  if (/\b(default tool|default tools|allowed by default|use by default)\b/i.test(line)) {
    return /\b(not default|disabled by default|disallowed by default)\b/i.test(line);
  }

  return /\b(optional|paid|fallback|conditional|approval|approved|explicit|cap|requires|disabled)\b/i.test(line);
}

function containsTerm(term: string): boolean {
  const pattern = new RegExp(escapeRegExp(term), "i");
  return contents.some(({ text }) => pattern.test(text));
}

function paidToolPattern(): RegExp {
  return new RegExp(OPTIONAL_PAID_FALLBACK_TOOL_NAMES.map((name) => name.split(" ")[0]).join("|"), "i");
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
