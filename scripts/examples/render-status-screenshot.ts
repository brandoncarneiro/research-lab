import { dirname, join } from "node:path";
import { renderStatus } from "../../src/status.js";
import { ensureDir, writeText } from "../../src/fs.js";

const runDir = process.argv[2] ?? "examples/apollo-13-oxygen-tank-review";
const outPath = process.argv[3] ?? join(runDir, "screenshots/status.svg");
const status = await renderStatus(runDir);
const lines = [
  "$ research-lab status examples/apollo-13-oxygen-tank-review",
  "",
  ...status.split(/\r?\n/),
];
const width = 980;
const lineHeight = 22;
const padding = 24;
const height = padding * 2 + lines.length * lineHeight;
const text = lines.map((line, index) =>
  `<text x="${padding}" y="${padding + (index + 1) * lineHeight}" class="terminal-line">${escapeXml(line)}</text>`,
).join("\n");

await ensureDir(dirname(outPath));
await writeText(outPath, `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="Research Lab status screenshot">
  <rect width="100%" height="100%" fill="#101214"/>
  <rect x="12" y="12" width="${width - 24}" height="${height - 24}" rx="8" fill="#15191d" stroke="#2f363d"/>
  <circle cx="34" cy="34" r="6" fill="#ff5f57"/>
  <circle cx="54" cy="34" r="6" fill="#ffbd2e"/>
  <circle cx="74" cy="34" r="6" fill="#28c840"/>
  <g transform="translate(0, 28)">
${text}
  </g>
  <style>
    .terminal-line {
      font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
      font-size: 14px;
      fill: #d7dde5;
      white-space: pre;
    }
  </style>
</svg>`);

console.log(outPath);

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
