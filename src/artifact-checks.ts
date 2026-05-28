import { EXTRACTED_OUTPUTS, FINAL_OUTPUTS } from "./contracts.js";
import type { ArtifactProfile, ValidationIssue } from "./contracts.js";
import { extractHeadingSection, hasPlaceholder, parseAllMarkdownTables } from "./markdown.js";

export function validateArtifactProfile(path: string, value: unknown): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  if (!isArtifactProfile(value)) {
    return [{ level: "error", code: "artifact_profile.invalid", message: "Artifact profile must define profileId, description, deterministic synthesisMode, extractedOutputs, and finalOutputs.", path }];
  }

  if (!/^[a-z0-9][a-z0-9-]*$/.test(value.profileId)) {
    issues.push({ level: "error", code: "artifact_profile.id", message: "Artifact profile profileId must be lowercase kebab-case.", path });
  }

  if (value.synthesisMode !== "deterministic") {
    issues.push({ level: "error", code: "artifact_profile.synthesis_mode", message: "Artifact profile synthesisMode must be deterministic.", path });
  }

  issues.push(...validateExactPaths(path, "artifact_profile.extracted_outputs", "extractedOutputs", value.extractedOutputs, EXTRACTED_OUTPUTS));
  issues.push(...validateExactPaths(path, "artifact_profile.final_outputs", "finalOutputs", value.finalOutputs, FINAL_OUTPUTS));

  for (const outputPath of value.finalOutputs) {
    if (!outputPath.startsWith("output/") || !outputPath.endsWith(".md")) {
      issues.push({ level: "error", code: "artifact_profile.final_path", message: `Final artifact must be a Markdown file under output/: ${outputPath}.`, path });
    }
  }

  const legacyProjectDocPattern = new RegExp(["CHATGPT", "PROJECT", "DOC"].join("_"), "i");
  if (value.finalOutputs.some((outputPath) => legacyProjectDocPattern.test(outputPath))) {
    issues.push({ level: "error", code: "artifact_profile.old_artifact_name", message: "Artifact profile must use PROJECT_CONTEXT.md, not the legacy project-doc filename.", path });
  }

  return issues;
}

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

function isArtifactProfile(value: unknown): value is ArtifactProfile {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<ArtifactProfile>;
  return typeof candidate.profileId === "string"
    && typeof candidate.description === "string"
    && candidate.synthesisMode === "deterministic"
    && Array.isArray(candidate.extractedOutputs)
    && Array.isArray(candidate.finalOutputs)
    && candidate.extractedOutputs.every((item) => typeof item === "string")
    && candidate.finalOutputs.every((item) => typeof item === "string");
}

function validateExactPaths(
  path: string,
  code: string,
  label: string,
  actual: readonly string[],
  expected: readonly string[],
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  if (new Set(actual).size !== actual.length) {
    issues.push({ level: "error", code: `${code}.duplicate`, message: `${label} contains duplicate paths.`, path });
  }

  if (actual.length !== expected.length || actual.some((item, index) => item !== expected[index])) {
    issues.push({ level: "error", code, message: `${label} must match the default runtime contract: ${expected.join(", ")}.`, path });
  }

  return issues;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
