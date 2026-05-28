import type { LaneDefinition } from "./contracts.js";

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/`/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "lane";
}

export function estimateTokens(text: string): number {
  return Math.max(0, Math.ceil(text.trim().length / 4));
}

export function extractFirstMatch(text: string, patterns: RegExp[], fallback: string): string {
  for (const pattern of patterns) {
    const match = text.match(pattern);
    const value = match?.[1]?.trim();

    if (value) {
      return stripMarkdown(value);
    }
  }

  return fallback;
}

export function extractBriefTitle(text: string, fallback: string): string {
  return extractFirstMatch(text, [
    /## Research Title\s+([\s\S]*?)(?:\n## |\n# |\s*$)/i,
    /^#\s+(.+)$/m,
  ], fallback);
}

export function extractProfilePath(text: string): string {
  return extractFirstMatch(text, [
    /\*\*Project profile path:\*\*\s*`?([^`\n]+)`?/i,
    /Project profile:\s*`?([^`\n]+)`?/i,
  ], "profiles/example/PROFILE.md");
}

export function parseLaneDefinitions(brief: string): LaneDefinition[] {
  const section = extractHeadingSection(brief, "Evidence Lanes");

  if (!section) {
    return [];
  }

  const table = parseFirstMarkdownTable(section);

  if (!table) {
    return [];
  }

  const laneIndex = findHeader(table.headers, "Lane");
  const missionIndex = findHeader(table.headers, "Mission");
  const questionIndex = findHeader(table.headers, "Lane question");
  const targetIndex = findHeader(table.headers, "Target sources");
  const outputIndex = findHeader(table.headers, "Required output file");
  const thresholdIndex = findHeader(table.headers, "Evidence threshold");

  return table.rows
    .map((row) => {
      const title = stripMarkdown(row[laneIndex] ?? "");
      const rawPath = extractRawPath(row[outputIndex] ?? "", title);

      return {
        laneId: slugify(rawPath.replace(/^raw\//, "").replace(/\.md$/i, "") || title),
        title,
        mission: stripMarkdown(row[missionIndex] ?? ""),
        question: stripMarkdown(row[questionIndex] ?? ""),
        targetSources: stripMarkdown(row[targetIndex] ?? ""),
        rawPath,
        evidenceThreshold: stripMarkdown(row[thresholdIndex] ?? ""),
      };
    })
    .filter((lane) => lane.title.length > 0 && !lane.title.startsWith("{"));
}

export function extractHeadingSection(text: string, heading: string): string | undefined {
  const lines = text.split(/\r?\n/);
  const target = heading.trim().toLowerCase();
  let start = -1;

  for (let index = 0; index < lines.length; index += 1) {
    const match = (lines[index] ?? "").match(/^(#{1,6})\s+(.+?)\s*$/);

    if (match?.[1] === "##" && match[2]?.trim().toLowerCase() === target) {
      start = index + 1;
      break;
    }
  }

  if (start < 0) {
    return undefined;
  }

  let end = lines.length;
  for (let index = start; index < lines.length; index += 1) {
    if (/^##\s+/.test(lines[index] ?? "")) {
      end = index;
      break;
    }
  }

  return lines.slice(start, end).join("\n");
}

export type MarkdownTable = {
  headers: string[];
  rows: string[][];
};

export function parseFirstMarkdownTable(text: string): MarkdownTable | undefined {
  const lines = text.split(/\r?\n/);

  for (let index = 0; index < lines.length - 1; index += 1) {
    const header = lines[index] ?? "";
    const separator = lines[index + 1] ?? "";

    if (!isTableRow(header) || !/^\s*\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?\s*$/.test(separator)) {
      continue;
    }

    const headers = splitTableRow(header).map(stripMarkdown);
    const rows: string[][] = [];

    for (let rowIndex = index + 2; rowIndex < lines.length; rowIndex += 1) {
      const line = lines[rowIndex] ?? "";

      if (!isTableRow(line)) {
        break;
      }

      const cells = splitTableRow(line);
      if (cells.length === headers.length) {
        rows.push(cells);
      }
    }

    return { headers, rows };
  }

  return undefined;
}

export function parseAllMarkdownTables(text: string): MarkdownTable[] {
  const tables: MarkdownTable[] = [];
  const lines = text.split(/\r?\n/);

  for (let index = 0; index < lines.length - 1; index += 1) {
    const header = lines[index] ?? "";
    const separator = lines[index + 1] ?? "";

    if (!isTableRow(header) || !/^\s*\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?\s*$/.test(separator)) {
      continue;
    }

    const headers = splitTableRow(header).map(stripMarkdown);
    const rows: string[][] = [];
    let rowIndex = index + 2;

    for (; rowIndex < lines.length; rowIndex += 1) {
      const line = lines[rowIndex] ?? "";

      if (!isTableRow(line)) {
        break;
      }

      const cells = splitTableRow(line);
      if (cells.length === headers.length) {
        rows.push(cells);
      }
    }

    tables.push({ headers, rows });
    index = rowIndex;
  }

  return tables;
}

export function stripMarkdown(value: string): string {
  return value
    .replace(/`/g, "")
    .replace(/\*\*/g, "")
    .replace(/^\s*[-*]\s+/, "")
    .trim();
}

export function hasPlaceholder(text: string): boolean {
  return /(\{[a-z0-9 _./-]+\}|<(?:Research Topic|YYYY|#|source|question|range|profile|project|finding|claim|category|decision|metric|value|date|run|name|role|audience)[^>\n]*>)/i.test(text);
}

function isTableRow(line: string): boolean {
  return line.trim().startsWith("|") && line.includes("|");
}

function splitTableRow(line: string): string[] {
  const trimmed = line.trim().replace(/^\|/, "").replace(/\|$/, "");
  return trimmed.split("|").map((cell) => cell.trim());
}

function findHeader(headers: string[], name: string): number {
  const normalized = name.toLowerCase();
  const index = headers.findIndex((header) => header.toLowerCase() === normalized);
  return index >= 0 ? index : 0;
}

function extractRawPath(value: string, laneTitle: string): string {
  const backtick = value.match(/`([^`]+)`/);
  const raw = (backtick?.[1] ?? value).trim();
  const match = raw.match(/raw\/[a-z0-9_.-]+\.md/i);

  if (match) {
    return match[0];
  }

  return `raw/${slugify(laneTitle)}.md`;
}
