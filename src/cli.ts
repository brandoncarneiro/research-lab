#!/usr/bin/env node
import { resolve } from "node:path";
import { runResearch } from "./run.js";
import { synthesizeRun } from "./synthesize.js";
import { validateRun } from "./validate.js";
import { readStatus, renderStatus } from "./status.js";

type ParsedArgs = {
  command: string | undefined;
  runDir: string | undefined;
  flags: Map<string, string | boolean>;
};

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));

  if (!args.command || args.flags.has("help") || args.flags.has("h")) {
    printHelp();
    return;
  }

  const runDir = args.runDir ? resolve(args.runDir) : undefined;

  if (!runDir) {
    throw new Error(`Missing run directory for command: ${args.command}`);
  }

  if (args.command === "run") {
    const maxConcurrency = numberFlag(args.flags.get("max-concurrency"));
    const manifest = await runResearch(runDir, {
      force: Boolean(args.flags.get("force")),
      ...(maxConcurrency ? { maxConcurrency } : {}),
    });
    console.log(`run ${manifest.status}: ${manifest.runId}`);
    console.log(`next: research-lab synthesize ${args.runDir}`);
    return;
  }

  if (args.command === "synthesize") {
    const manifest = await synthesizeRun(runDir, { force: Boolean(args.flags.get("force")) });
    console.log(`synthesis ${manifest.status}: ${manifest.runId}`);
    console.log(`next: research-lab validate ${args.runDir}`);
    return;
  }

  if (args.command === "validate") {
    const report = await validateRun(runDir, { writeReport: true, updateStatus: true });
    if (args.flags.has("json")) {
      console.log(JSON.stringify(report, null, 2));
    } else {
      console.log(`validation ${report.status}: ${report.summary.errors} error(s), ${report.summary.warnings} warning(s)`);
      for (const issue of report.issues) {
        console.log(`- ${issue.level.toUpperCase()} ${issue.code}: ${issue.message}${issue.path ? ` (${issue.path})` : ""}`);
      }
    }

    if (report.status !== "passed") {
      process.exitCode = 1;
    }
    return;
  }

  if (args.command === "status") {
    if (args.flags.has("json")) {
      console.log(JSON.stringify(await readStatus(runDir), null, 2));
    } else {
      console.log(await renderStatus(runDir));
    }
    return;
  }

  throw new Error(`Unknown command: ${args.command}`);
}

function parseArgs(argv: string[]): ParsedArgs {
  const flags = new Map<string, string | boolean>();
  const positional: string[] = [];

  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index] ?? "";

    if (!value.startsWith("--")) {
      positional.push(value);
      continue;
    }

    const key = value.slice(2);
    const next = argv[index + 1];

    if (next && !next.startsWith("--")) {
      flags.set(key, next);
      index += 1;
    } else {
      flags.set(key, true);
    }
  }

  return {
    command: positional[0],
    runDir: positional[1],
    flags,
  };
}

function numberFlag(value: string | boolean | undefined): number | undefined {
  if (typeof value !== "string") {
    return undefined;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : undefined;
}

function printHelp(): void {
  console.log(`research-lab

Usage:
  research-lab run <run-dir> [--force] [--max-concurrency N]
  research-lab synthesize <run-dir> [--force]
  research-lab validate <run-dir> [--json]
  research-lab status <run-dir> [--json]

The filesystem is the database. Runs live in a directory containing 00-brief.md,
lane manifests, raw lane outputs, JSONL logs, metrics, validation, and final artifacts.`);
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
