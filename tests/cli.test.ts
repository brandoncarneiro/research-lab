import { readFile } from "node:fs/promises";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import assert from "node:assert/strict";
import test from "node:test";

const execFileAsync = promisify(execFile);

test("CLI prints global help", async () => {
  const { stdout } = await runCli("--help");

  assert.match(stdout, /Usage:/);
  assert.match(stdout, /research-lab help \[command\]/);
  assert.match(stdout, /Valid commands|Commands:/);
});

test("CLI prints command-specific synthesis help", async () => {
  const { stdout } = await runCli("help", "synthesize");

  assert.match(stdout, /research-lab synthesize <run-dir>/);
  assert.match(stdout, /PROJECT_CONTEXT\.md/);
  assert.match(stdout, /does not\s+call a model provider/);
});

test("CLI prints package version", async () => {
  const packageJson = JSON.parse(await readFile("package.json", "utf8")) as { version: string };
  const { stdout } = await runCli("--version");

  assert.equal(stdout.trim(), packageJson.version);
});

test("CLI reports valid commands on bad input", async () => {
  await assert.rejects(
    runCli("bogus"),
    (error: unknown) => {
      const stderr = (error as { stderr?: string }).stderr ?? "";
      assert.match(stderr, /Unknown command: bogus/);
      assert.match(stderr, /Valid commands: run, synthesize, validate, status/);
      return true;
    },
  );
});

test("CLI rejects invalid max concurrency", async () => {
  await assert.rejects(
    runCli("run", "examples/apollo-13-oxygen-tank-review", "--max-concurrency", "0"),
    (error: unknown) => {
      const stderr = (error as { stderr?: string }).stderr ?? "";
      assert.match(stderr, /--max-concurrency must be a positive integer/);
      return true;
    },
  );
});

async function runCli(...args: string[]): Promise<{ stdout: string; stderr: string }> {
  return execFileAsync(process.execPath, ["--import", "tsx", "src/cli.ts", ...args], {
    cwd: process.cwd(),
  });
}
