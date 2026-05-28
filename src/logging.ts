import type { LogEntry } from "./contracts.js";
import { appendText } from "./fs.js";

export async function writeLog(path: string, entry: Omit<LogEntry, "ts">): Promise<void> {
  const logEntry: LogEntry = {
    ts: new Date().toISOString(),
    ...entry,
  };

  await appendText(path, `${JSON.stringify(logEntry)}\n`);
}
