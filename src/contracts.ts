export const SCHEMA_VERSION = 1;

export const FINAL_OUTPUTS = [
  "output/RAW_DATA_DIGEST.md",
  "output/CEO_BRIEF.md",
  "output/CHATGPT_PROJECT_DOC.md",
] as const;

export const EXTRACTED_OUTPUTS = [
  "extracted/findings.md",
  "extracted/contradictions.md",
  "extracted/tables.md",
  "extracted/open-questions.md",
] as const;

export type RunStatus =
  | "planned"
  | "running"
  | "ready_for_synthesis"
  | "blocked"
  | "synthesizing"
  | "complete"
  | "failed"
  | "validated";

export type LaneStatus =
  | "planned"
  | "queued"
  | "running"
  | "complete"
  | "blocked"
  | "failed";

export type ValidationStatus = "not_run" | "passed" | "warning" | "failed";

export type Usage = {
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  estimatedCostUsd: number;
  localOnly: boolean;
  pricingUnavailableReason?: string;
};

export type LaneExecutor =
  | { type: "artifact" }
  | { type: "fixture"; inputPath: string }
  | { type: "command"; command: string; args?: string[]; timeoutMs?: number };

export type LaneAttempt = {
  attempt: number;
  status: "complete" | "blocked" | "failed";
  startedAt: string;
  completedAt: string;
  usage: Usage;
  error?: {
    code: string;
    message: string;
  };
};

export type LaneManifest = {
  schemaVersion: number;
  runId: string;
  laneId: string;
  manifestPath: string;
  rawPath: string;
  required: boolean;
  title: string;
  mission: string;
  question: string;
  targetSources: string;
  evidenceThreshold: string;
  provider: string;
  model: string;
  executor: LaneExecutor;
  status: LaneStatus;
  createdAt: string;
  updatedAt: string;
  startedAt?: string;
  completedAt?: string;
  retries: number;
  attempts: LaneAttempt[];
  validation: {
    status: ValidationStatus;
    checkedAt?: string;
    issueCount: number;
    reportPath?: string;
  };
  usage: Usage;
};

export type RunManifest = {
  schemaVersion: number;
  runId: string;
  slug: string;
  title: string;
  runDir: string;
  profilePath: string;
  status: RunStatus;
  executionMode: "local" | "mixed" | "external";
  sourcePackHash?: string;
  createdAt: string;
  updatedAt: string;
  startedAt?: string;
  completedAt?: string;
  maxConcurrency: number;
  lanes: Array<{
    laneId: string;
    manifestPath: string;
    rawPath: string;
    required: boolean;
  }>;
  artifacts: {
    brief: string;
    extracted: string[];
    output: string[];
    logs: string[];
    metrics: string;
    validation: string;
  };
  totals: Usage;
};

export type LogEntry = {
  ts: string;
  runId: string;
  level: "info" | "warning" | "error";
  event: string;
  laneId?: string;
  data?: Record<string, unknown>;
  error?: {
    code: string;
    message: string;
  };
};

export type ValidationIssue = {
  level: "error" | "warning";
  code: string;
  message: string;
  path?: string;
};

export type ValidationReport = {
  schemaVersion: number;
  runId: string;
  checkedAt: string;
  status: "passed" | "failed";
  summary: {
    errors: number;
    warnings: number;
    lanes: number;
    finalArtifacts: number;
  };
  issues: ValidationIssue[];
};

export type MetricsSummary = {
  schemaVersion: number;
  runId: string;
  generatedAt: string;
  executionMode: RunManifest["executionMode"];
  lanes: Array<{
    laneId: string;
    provider: string;
    model: string;
    localOnly: boolean;
    inputTokens: number;
    outputTokens: number;
    totalTokens: number;
    estimatedCostUsd: number;
  }>;
  totals: Usage;
};

export type LaneDefinition = {
  laneId: string;
  title: string;
  mission: string;
  question: string;
  targetSources: string;
  rawPath: string;
  evidenceThreshold: string;
};
