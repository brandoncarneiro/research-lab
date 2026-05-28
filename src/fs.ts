import { createHash } from "node:crypto";
import { constants } from "node:fs";
import { access, appendFile, copyFile, mkdir, readFile, readdir, stat, writeFile } from "node:fs/promises";
import { dirname, join, relative, resolve, sep } from "node:path";

export function absolutePath(path: string): string {
  return resolve(path);
}

export function toPosix(path: string): string {
  return path.split(sep).join("/");
}

export function relativePath(from: string, to: string): string {
  return toPosix(relative(from, to));
}

export function resolveInside(root: string, path: string): string {
  return resolve(root, path);
}

export function isInside(root: string, candidate: string): boolean {
  const rootPath = resolve(root);
  const candidatePath = resolve(candidate);
  const rel = relative(rootPath, candidatePath);
  return rel === "" || (!rel.startsWith("..") && !rel.includes(`..${sep}`));
}

export async function pathExists(path: string): Promise<boolean> {
  try {
    await access(path, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

export async function isReadableFile(path: string): Promise<boolean> {
  try {
    const info = await stat(path);
    await access(path, constants.R_OK);
    return info.isFile();
  } catch {
    return false;
  }
}

export async function ensureDir(path: string): Promise<void> {
  await mkdir(path, { recursive: true });
}

export async function readText(path: string): Promise<string> {
  return readFile(path, "utf8");
}

export async function readTextIfExists(path: string): Promise<string | undefined> {
  if (!await pathExists(path)) {
    return undefined;
  }

  return readText(path);
}

export async function writeText(path: string, value: string): Promise<void> {
  await ensureDir(dirname(path));
  await writeFile(path, value.endsWith("\n") ? value : `${value}\n`, "utf8");
}

export async function appendText(path: string, value: string): Promise<void> {
  await ensureDir(dirname(path));
  await appendFile(path, value, "utf8");
}

export async function copyTextFile(from: string, to: string): Promise<void> {
  await ensureDir(dirname(to));
  await copyFile(from, to);
}

export async function readJson<T>(path: string): Promise<T> {
  return JSON.parse(await readText(path)) as T;
}

export async function writeJson(path: string, value: unknown): Promise<void> {
  await writeText(path, `${JSON.stringify(value, null, 2)}\n`);
}

export async function listFiles(root: string): Promise<string[]> {
  if (!await pathExists(root)) {
    return [];
  }

  const entries = await readdir(root, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const fullPath = join(root, entry.name);

    if (entry.isDirectory()) {
      files.push(...await listFiles(fullPath));
      continue;
    }

    if (entry.isFile()) {
      files.push(fullPath);
    }
  }

  return files.sort((a, b) => a.localeCompare(b));
}

export function sha256(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

export async function hashDirectory(root: string): Promise<string | undefined> {
  if (!await pathExists(root)) {
    return undefined;
  }

  const files = await listFiles(root);
  const hash = createHash("sha256");

  for (const file of files) {
    hash.update(relativePath(root, file));
    hash.update("\0");
    hash.update(await readFile(file));
    hash.update("\0");
  }

  return hash.digest("hex");
}
