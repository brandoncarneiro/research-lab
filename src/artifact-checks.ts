import type { ValidationIssue } from "./contracts.js";
import { extractHeadingSection, hasPlaceholder, parseAllMarkdownTables } from "./markdown.js";

export function validateRawLaneText(path: string, text: string): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const requiredHeadings = [
    "Lane Name",
    "Lane Mission",
    "Lane Question",
    "Status",
    "Sources Checked",
    "Facts",
    "Inferences",
    "Speculation",
    "Contradictions",
    "Negative Evidence",
    "What This Lane Proves",
    "What This Lane Does Not Prove",
    "Open Questions",
    "Source List",
    "Completion Checklist",
  ];

  if (text.trim().length === 0) {
    issues.push({ level: "error", code: "raw.empty", message: "Raw lane artifact is empty.", path });
    return issues;
  }

  if (hasPlaceholder(text)) {
    issues.push({ level: "error", code: "raw.placeholder", message: "Raw lane artifact still contains template placeholders.", path });
  }

  for (const heading of requiredHeadings) {
    if (!new RegExp(`^##\\s+${escapeRegExp(heading)}\\s*$`, "im").test(text)) {
      issues.push({ level: "error", code: "raw.heading_missing", message: `Raw lane artifact is missing heading: ${heading}.`, path });
    }
  }

  const sourceIds = collectDefinedSourceIds(text);

  if (sourceIds.size === 0) {
    issues.push({ level: "error", code: "raw.sources_missing", message: "Raw lane artifact defines no Source IDs.", path });
  }

  for (const fact of text.split(/\r?\n/).filter((line) => /\bFACT\b/i.test(line))) {
    const sourceMatches = [...fact.matchAll(/\bS\d+\b/g)].map((match) => match[0]);

    if (!/Source:/i.test(fact) || sourceMatches.length === 0) {
      issues.push({ level: "error", code: "raw.fact_uncited", message: `FACT line lacks Source: S# citation: ${fact.trim()}`, path });
      continue;
    }

    for (const sourceId of sourceMatches) {
      if (!sourceIds.has(sourceId)) {
        issues.push({ level: "error", code: "raw.fact_unknown_source", message: `FACT line references undefined source ID: ${sourceId}.`, path });
      }
    }
  }

  const inferences = extractHeadingSection(text, "Inferences") ?? "";
  if (/\bINFERENCE\b/i.test(inferences) && !/Based on:/i.test(inferences)) {
    issues.push({ level: "error", code: "raw.inference_basis_missing", message: "Inference section contains INFERENCE but no Based on: line.", path });
  }

  const speculation = extractHeadingSection(text, "Speculation") ?? "";
  if (/\bSPECULATION\b/i.test(speculation) && !/Confidence:\s*low/i.test(speculation)) {
    issues.push({ level: "warning", code: "raw.speculation_confidence", message: "Speculation should be explicitly marked low confidence.", path });
  }

  return issues;
}

export function collectDefinedSourceIds(text: string): Set<string> {
  const sourceIds = new Set<string>();

  for (const table of parseAllMarkdownTables(text)) {
    if (!table.headers.some((header) => /source id/i.test(header))) {
      continue;
    }

    for (const row of table.rows) {
      const value = row[0]?.replace(/`/g, "").trim();

      if (value && /^S\d+$/.test(value)) {
        sourceIds.add(value);
      }
    }
  }

  return sourceIds;
}

export function collectDefinedEvidenceIds(text: string): Set<string> {
  const ids = new Set<string>();

  for (const table of parseAllMarkdownTables(text)) {
    for (const row of table.rows) {
      const value = row[0]?.replace(/`/g, "").trim();

      if (value && /^[SRQPCN]\d+$/.test(value)) {
        ids.add(value);
      }
    }
  }

  return ids;
}

export function collectReferencedEvidenceIds(text: string): Set<string> {
  const ids = new Set<string>();

  for (const match of text.matchAll(/\b[SRQPCN]\d+\b/g)) {
    ids.add(match[0]);
  }

  return ids;
}

export function validateFinalArtifactText(path: string, text: string): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  if (text.trim().length === 0) {
    issues.push({ level: "error", code: "artifact.empty", message: "Final artifact is empty.", path });
  }

  if (hasPlaceholder(text)) {
    issues.push({ level: "error", code: "artifact.placeholder", message: "Final artifact still contains template placeholders.", path });
  }

  return issues;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
