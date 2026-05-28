#!/usr/bin/env node
import { readFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { runResearch } from "./run.js";
import { synthesizeRun } from "./synthesize.js";
import { validateRun } from "./validate.js";
import { readStatus, renderStatus } from "./status.js";

type ParsedArgs = {
  command: string | undefined;
  positional: string[];
  flags: Map<string, string | boolean>;
};

type CommandName = "run" | "synthesize" | "validate" | "status";

const COMMANDS: readonly CommandName[] = ["run", "synthesize", "validate", "status"];
const GLOBAL_FLAGS = new Set(["help", "h", "version", "v"]);
const COMMAND_FLAGS: Record<CommandName, Set<string>> = {
  run: new Set(["help", "h", "force", "max-concurrency"]),
  synthesize: new Set(["help", "h", "force"]),
  validate: new Set(["help", "h", "json"]),
  status: new Set(["help", "h", "json"]),
};

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));

  if (args.flags.has("version") || args.flags.has("v")) {
    console.log(await readPackageVersion());
    return;
  }

  if (!args.command || args.command === "help" || args.flags.has("help") || args.flags.has("h")) {
    printHelp(args.command === "help" ? args.positional[1] : args.command);
    return;
  }

  if (!isCommand(args.command)) {
    throw new Error(`Unknown command: ${args.command}. Valid commands: ${COMMANDS.join(", ")}.`);
  }

  validateFlags(args.command, args.flags);

  const runDirArg = args.positional[1];
  const runDir = runDirArg ? resolve(runDirArg) : undefined;

  if (!runDir) {
    printHelp(args.command);
    throw new Error(`Missing run directory for command: ${args.command}.`);
  }

  if (args.positional.length > 2) {
    throw new Error(`Unexpected positional argument(s): ${args.positional.slice(2).join(", ")}.`);
  }

  if (args.command === "run") {
    const maxConcurrency = numberFlag(args.flags.get("max-concurrency"), "max-concurrency");
    const manifest = await runResearch(runDir, {
      force: Boolean(args.flags.get("force")),
      ...(maxConcurrency ? { maxConcurrency } : {}),
    });
    console.log(`run ${manifest.status}: ${manifest.runId}`);
    console.log(`next: research-lab synthesize ${runDirArg}`);
    return;
  }

  if (args.command === "synthesize") {
    const manifest = await synthesizeRun(runDir, { force: Boolean(args.flags.get("force")) });
    console.log(`synthesis ${manifest.status}: ${manifest.runId}`);
    console.log(`next: research-lab validate ${runDirArg}`);
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
  }
}

function parseArgs(argv: string[]): ParsedArgs {
  const flags = new Map<string, string | boolean>();
  const positional: string[] = [];

  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index] ?? "";

    if (value === "-h") {
      flags.set("h", true);
      continue;
    }

    if (value === "-v") {
      flags.set("v", true);
      continue;
    }

    if (!value.startsWith("--")) {
      positional.push(value);
      continue;
    }

    const [rawKey, inlineValue] = value.slice(2).split("=", 2);
    const key = rawKey ?? "";

    if (!key) {
      throw new Error("Invalid empty flag. Use --help for usage.");
    }

    if (inlineValue !== undefined) {
      flags.set(key, inlineValue);
      continue;
    }

    const next = argv[index + 1];
    const takesValue = key === "max-concurrency";

    if (takesValue) {
      if (!next || next.startsWith("-")) {
        throw new Error(`Missing value for --${key}.`);
      }

      flags.set(key, next);
      index += 1;
      continue;
    }

    flags.set(key, true);
  }

  return {
    command: positional[0],
    positional,
    flags,
  };
}

function isCommand(value: string): value is CommandName {
  return COMMANDS.includes(value as CommandName);
}

function validateFlags(command: CommandName, flags: Map<string, string | boolean>): void {
  const valid = COMMAND_FLAGS[command];

  for (const flag of flags.keys()) {
    if (!valid.has(flag) && !GLOBAL_FLAGS.has(flag)) {
      throw new Error(`Unknown flag for ${command}: --${flag}. Valid flags: ${[...valid].filter((item) => item.length > 1).map((item) => `--${item}`).join(", ")}.`);
    }
  }
}

function numberFlag(value: string | boolean | undefined, name: string): number | undefined {
  if (value === undefined) {
    return undefined;
  }

  if (typeof value !== "string") {
    throw new Error(`--${name} requires a positive integer value.`);
  }

  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 1) {
    throw new Error(`--${name} must be a positive integer.`);
  }

  return parsed;
}

async function readPackageVersion(): Promise<string> {
  let directory = dirname(fileURLToPath(import.meta.url));

  for (let depth = 0; depth < 5; depth += 1) {
    try {
      const raw = await readFile(join(directory, "package.json"), "utf8");
      const packageJson = JSON.parse(raw) as { version?: unknown };
      if (typeof packageJson.version === "string") {
        return packageJson.version;
      }
    } catch {
      // Keep walking toward the package root.
    }

    const parent = dirname(directory);
    if (parent === directory) {
      break;
    }
    directory = parent;
  }

  return "0.0.0";
}

function printHelp(command?: string): void {
  if (command && isCommand(command)) {
    console.log(commandHelp(command));
    return;
  }

  if (command && command !== "help") {
    console.log(`Unknown help topic: ${command}. Valid commands: ${COMMANDS.join(", ")}.\n`);
  }

  console.log(`research-lab

Usage:
  research-lab <command> <run-dir> [options]
  research-lab help [command]
  research-lab --version

Commands:
  run          Execute lane manifests and write raw lane artifacts
  synthesize   Build deterministic extracted files and final artifacts
  validate     Check manifests, logs, metrics, artifacts, and evidence references
  status       Print the current run state

Run 'research-lab help <command>' for command-specific options.

The filesystem is the database. Runs live in a directory containing 00-brief.md,
lane manifests, raw lane outputs, JSONL logs, metrics, validation, and final artifacts.`);
}

function commandHelp(command: CommandName): string {
  const help: Record<CommandName, string> = {
    run: `research-lab run <run-dir> [--force] [--max-concurrency N]

Execute configured lanes with bounded concurrency. Lanes may validate existing
artifacts, copy local fixtures, or run explicit local commands.`,
    synthesize: `research-lab synthesize <run-dir> [--force]

Read completed raw lane artifacts and deterministically write extracted files,
RAW_DATA_DIGEST.md, CEO_BRIEF.md, and PROJECT_CONTEXT.md. This command does not
call a model provider.`,
    validate: `research-lab validate <run-dir> [--json]

Check lifecycle state, required files, raw lane shape, evidence references,
JSONL logs, token/cost totals, output count, and observed concurrency.`,
    status: `research-lab status <run-dir> [--json]

Print the current run manifest and validation state without mutating evidence
artifacts.`,
  };

  return help[command];
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
