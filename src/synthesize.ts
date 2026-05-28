import { join } from "node:path";
import type { LaneManifest, RunManifest } from "./contracts.js";
import { loadLaneManifest, loadRunManifest, saveRunManifest } from "./state.js";
import { ensureDir, readText, writeText } from "./fs.js";
import { writeLog } from "./logging.js";
import { extractHeadingSection, parseFirstMarkdownTable, stripMarkdown } from "./markdown.js";

type SourceRow = {
  laneId: string;
  localId: string;
  globalId: string;
  source: string;
  url: string;
  type: string;
  confidence: string;
  notes: string;
};

type RawLane = {
  lane: LaneManifest;
  text: string;
  sources: SourceRow[];
  facts: string[];
  inferences: string[];
  quantitativeRows: string[][];
  contradictionRows: string[][];
  negativeRows: string[][];
  blockedRows: string[][];
  openQuestions: string[];
  proves: string[];
  doesNotProve: string[];
  implications: string[];
};

type DigestIds = {
  records: Array<{ id: string; laneId: string; text: string; sourceIds: string[] }>;
  quantities: Array<{ id: string; row: string[]; laneId: string }>;
  patterns: Array<{ id: string; laneId: string; text: string; sourceIds: string[] }>;
  contradictions: Array<{ id: string; row: string[]; laneId: string }>;
  negatives: Array<{ id: string; row: string[]; laneId: string }>;
};

export async function synthesizeRun(runDir: string, options: { force?: boolean } = {}): Promise<RunManifest> {
  const run = await loadRunManifest(runDir);

  if (run.status === "blocked" && !options.force) {
    throw new Error("Run has blocked required lanes. Use --force only if a caveated synthesis is intentional.");
  }

  const now = new Date().toISOString();
  const synthesizing: RunManifest = {
    ...run,
    status: "synthesizing",
    updatedAt: now,
  };
  await saveRunManifest(runDir, synthesizing);
  await writeLog(join(runDir, "logs/run.jsonl"), {
    runId: run.runId,
    level: "info",
    event: "synthesis.started",
  });

  const lanes = await Promise.all(run.lanes.map((laneRef) => loadLaneManifest(runDir, laneRef.manifestPath)));
  const rawLanes = await readRawLanes(runDir, lanes);
  const digestIds = buildDigestIds(rawLanes);

  await ensureDir(join(runDir, "extracted"));
  await ensureDir(join(runDir, "output"));
  await writeText(join(runDir, "extracted/findings.md"), renderExtractedFindings(run, rawLanes, digestIds));
  await writeText(join(runDir, "extracted/contradictions.md"), renderExtractedContradictions(run, digestIds));
  await writeText(join(runDir, "extracted/tables.md"), renderExtractedTables(run, rawLanes, digestIds));
  await writeText(join(runDir, "extracted/open-questions.md"), renderExtractedOpenQuestions(run, rawLanes));
  await writeText(join(runDir, "output/RAW_DATA_DIGEST.md"), renderRawDataDigest(run, rawLanes, digestIds));
  await writeLog(join(runDir, "logs/run.jsonl"), {
    runId: run.runId,
    level: "info",
    event: "artifact.written",
    data: { path: "output/RAW_DATA_DIGEST.md" },
  });
  await writeText(join(runDir, "output/CEO_BRIEF.md"), renderCeoBrief(run, rawLanes, digestIds));
  await writeLog(join(runDir, "logs/run.jsonl"), {
    runId: run.runId,
    level: "info",
    event: "artifact.written",
    data: { path: "output/CEO_BRIEF.md" },
  });
  await writeText(join(runDir, "output/CHATGPT_PROJECT_DOC.md"), renderProjectDoc(run, rawLanes, digestIds));
  await writeLog(join(runDir, "logs/run.jsonl"), {
    runId: run.runId,
    level: "info",
    event: "artifact.written",
    data: { path: "output/CHATGPT_PROJECT_DOC.md" },
  });

  const completed: RunManifest = {
    ...synthesizing,
    status: "complete",
    completedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  await saveRunManifest(runDir, completed);
  await writeLog(join(runDir, "logs/run.jsonl"), {
    runId: run.runId,
    level: "info",
    event: "run.completed",
  });

  return completed;
}

async function readRawLanes(runDir: string, lanes: LaneManifest[]): Promise<RawLane[]> {
  const sourceMap = new Map<string, string>();
  const globalBySource = new Map<string, string>();
  let sourceCounter = 1;
  const rawLanes: RawLane[] = [];

  for (const lane of lanes) {
    const text = await readText(join(runDir, lane.rawPath));
    const localSources = parseSources(lane, text);
    const sources = localSources.map((source) => {
      const key = `${lane.laneId}:${source.localId}`;
      const sourceKey = `${source.source}|${source.url}`;
      let globalId = globalBySource.get(sourceKey);

      if (!globalId) {
        globalId = `S${sourceCounter}`;
        sourceCounter += 1;
        globalBySource.set(sourceKey, globalId);
      }

      sourceMap.set(key, globalId);
      return {
        ...source,
        globalId,
      };
    });

    const replaceRefs = (value: string) => replaceSourceRefs(value, lane.laneId, sourceMap);

    rawLanes.push({
      lane,
      text,
      sources,
      facts: collectBulletLines(text, "Facts").map(replaceRefs),
      inferences: collectInferenceLines(text).map(replaceRefs),
      quantitativeRows: tableRows(text, "Quantitative Signals").map((row) => row.map(replaceRefs)),
      contradictionRows: tableRows(text, "Contradictions").map((row) => row.map(replaceRefs)),
      negativeRows: tableRows(text, "Negative Evidence").map((row) => row.map(replaceRefs)),
      blockedRows: tableRows(text, "Blocked Sources").map((row) => row.map(replaceRefs)),
      openQuestions: collectBulletLines(text, "Open Questions").map(replaceRefs),
      proves: collectBulletLines(text, "What This Lane Proves").map(replaceRefs),
      doesNotProve: collectBulletLines(text, "What This Lane Does Not Prove").map(replaceRefs),
      implications: collectBulletLines(text, "Lane Decision Implication").map(replaceRefs),
    });
  }

  return rawLanes;
}

function buildDigestIds(rawLanes: RawLane[]): DigestIds {
  const ids: DigestIds = {
    records: [],
    quantities: [],
    patterns: [],
    contradictions: [],
    negatives: [],
  };

  for (const rawLane of rawLanes) {
    for (const fact of rawLane.facts) {
      ids.records.push({
        id: `R${ids.records.length + 1}`,
        laneId: rawLane.lane.laneId,
        text: cleanEvidenceLine(fact),
        sourceIds: [...fact.matchAll(/\bS\d+\b/g)].map((match) => match[0]),
      });
    }

    for (const row of rawLane.quantitativeRows) {
      if (row.some((cell) => /No material finding/i.test(cell))) {
        continue;
      }

      ids.quantities.push({ id: `Q${ids.quantities.length + 1}`, row, laneId: rawLane.lane.laneId });
    }

    for (const inference of [...rawLane.inferences, ...rawLane.proves]) {
      ids.patterns.push({
        id: `P${ids.patterns.length + 1}`,
        laneId: rawLane.lane.laneId,
        text: cleanEvidenceLine(inference),
        sourceIds: [...inference.matchAll(/\bS\d+\b/g)].map((match) => match[0]),
      });
    }

    for (const row of rawLane.contradictionRows) {
      if (row.some((cell) => /No material finding/i.test(cell))) {
        continue;
      }

      ids.contradictions.push({ id: `C${ids.contradictions.length + 1}`, row, laneId: rawLane.lane.laneId });
    }

    for (const row of rawLane.negativeRows) {
      if (row.some((cell) => /No material finding/i.test(cell))) {
        continue;
      }

      ids.negatives.push({ id: `N${ids.negatives.length + 1}`, row, laneId: rawLane.lane.laneId });
    }
  }

  return ids;
}

function renderExtractedFindings(run: RunManifest, rawLanes: RawLane[], digestIds: DigestIds): string {
  const lines = [
    `# Extracted Findings: ${run.title}`,
    "",
    `Run: \`${run.runId}\``,
    "",
    "## Records",
    "",
    "| Record ID | Lane | Finding | Source IDs |",
    "| --- | --- | --- | --- |",
    ...digestIds.records.map((record) => `| ${record.id} | ${record.laneId} | ${escapeCell(record.text)} | ${record.sourceIds.join(", ") || "No direct source ID parsed"} |`),
    "",
    "## Patterns",
    "",
    "| Pattern ID | Lane | Pattern | Source IDs |",
    "| --- | --- | --- | --- |",
    ...digestIds.patterns.map((pattern) => `| ${pattern.id} | ${pattern.laneId} | ${escapeCell(pattern.text)} | ${pattern.sourceIds.join(", ") || "See lane artifact"} |`),
    "",
    "## Lane Limits",
    "",
    ...rawLanes.flatMap((rawLane) => [
      `### ${rawLane.lane.title}`,
      "",
      ...(rawLane.doesNotProve.length > 0 ? rawLane.doesNotProve.map((line) => `- ${line}`) : ["- No material finding"]),
      "",
    ]),
  ];

  return lines.join("\n");
}

function renderExtractedContradictions(run: RunManifest, digestIds: DigestIds): string {
  return [
    `# Extracted Contradictions: ${run.title}`,
    "",
    "| Contradiction ID | Lane | Contradiction | Evidence A | Evidence B | Current interpretation | Decision impact |",
    "| --- | --- | --- | --- | --- | --- | --- |",
    ...(digestIds.contradictions.length > 0
      ? digestIds.contradictions.map((item) => {
        const row = normalizeRow(item.row, 6);
        return `| ${item.id} | ${item.laneId} | ${escapeCell(row[1] ?? row[0] ?? "")} | ${escapeCell(row[2] ?? "")} | ${escapeCell(row[3] ?? "")} | ${escapeCell(row[4] ?? "")} | ${escapeCell(row[5] ?? "")} |`;
      })
      : ["| No material finding | All lanes | No material contradiction recorded | n/a | n/a | n/a | n/a |"]),
  ].join("\n");
}

function renderExtractedTables(run: RunManifest, rawLanes: RawLane[], digestIds: DigestIds): string {
  return [
    `# Extracted Tables: ${run.title}`,
    "",
    "## Quantitative Signals",
    "",
    "| Signal ID | Lane | Metric | Value | Source ID | Population / corpus | Caveat |",
    "| --- | --- | --- | --- | --- | --- | --- |",
    ...(digestIds.quantities.length > 0
      ? digestIds.quantities.map((item) => {
        const row = normalizeRow(item.row, 6);
        return `| ${item.id} | ${item.laneId} | ${escapeCell(row[1] ?? row[0] ?? "")} | ${escapeCell(row[2] ?? "")} | ${escapeCell(row[3] ?? "")} | ${escapeCell(row[4] ?? "")} | ${escapeCell(row[5] ?? "")} |`;
      })
      : ["| No material finding | All lanes | No quantitative signal recorded | n/a | n/a | n/a | n/a |"]),
    "",
    "## Lane Runtime",
    "",
    "| Lane | Status | Provider | Model | Total tokens | Estimated cost USD |",
    "| --- | --- | --- | --- | ---: | ---: |",
    ...rawLanes.map((rawLane) => `| ${rawLane.lane.laneId} | ${rawLane.lane.status} | ${rawLane.lane.provider} | ${rawLane.lane.model} | ${rawLane.lane.usage.totalTokens} | ${rawLane.lane.usage.estimatedCostUsd.toFixed(6)} |`),
  ].join("\n");
}

function renderExtractedOpenQuestions(run: RunManifest, rawLanes: RawLane[]): string {
  const questions = rawLanes.flatMap((rawLane) => rawLane.openQuestions.map((question) => `- ${rawLane.lane.laneId}: ${question}`));

  return [
    `# Extracted Open Questions: ${run.title}`,
    "",
    ...(questions.length > 0 ? questions : ["- No material finding"]),
  ].join("\n");
}

function renderRawDataDigest(run: RunManifest, rawLanes: RawLane[], digestIds: DigestIds): string {
  const allSources = uniqueSources(rawLanes.flatMap((rawLane) => rawLane.sources));
  const blockedRows = rawLanes.flatMap((rawLane) => rawLane.blockedRows.map((row) => ({ laneId: rawLane.lane.laneId, row })));
  const sourceMapRows = allSources.map((source) => {
    const recordIds = digestIds.records.filter((record) => record.sourceIds.includes(source.globalId)).map((record) => record.id).join(", ") || "n/a";
    const patternIds = digestIds.patterns.filter((pattern) => pattern.sourceIds.includes(source.globalId)).map((pattern) => pattern.id).join(", ") || "n/a";
    return `| ${source.globalId} | ${recordIds} | n/a | ${patternIds} | n/a |`;
  });

  return [
    `# Raw Data Digest: ${run.title}`,
    "",
    `**Run ID:** \`${run.runId}\``,
    `**Research run:** \`${run.slug}/\``,
    `**Project profile:** \`${run.profilePath}\``,
    `**Execution mode:** ${run.executionMode}`,
    "",
    "## 1. Collection Scope",
    `**Research question:** ${run.title}`,
    `**Source count:** ${allSources.length}`,
    `**Normalized record count:** ${digestIds.records.length}`,
    `**Benchmark / data point count:** ${digestIds.quantities.length}`,
    `**Category / segment count:** ${rawLanes.length}`,
    `**Sources searched:** ${allSources.map((source) => source.source).join("; ")}`,
    `**Sources not searched:** ${blockedRows.length > 0 ? "See blocked / weak sources" : "No material finding"}`,
    `**Known gaps:** ${digestIds.negatives.length > 0 ? "See negative evidence" : "No material finding"}`,
    "",
    "## 2. Source Index",
    "| Source ID | Source | URL/path | Type | Date | Used for | Evidence quality | Bias / limitation |",
    "| --- | --- | --- | --- | --- | --- | --- | --- |",
    ...allSources.map((source) => `| ${source.globalId} | ${escapeCell(source.source)} | ${escapeCell(source.url)} | ${source.type || "primary"} | Not recorded | ${escapeCell(source.notes || source.laneId)} | ${source.confidence || "medium"} | Source-pack excerpt; inspect original for full context |`),
    "",
    "## 3. Method Notes",
    "Deterministic synthesis read the checked raw lane files after runtime lane execution. FACT, INFERENCE, SPECULATION, contradictions, and negative evidence were preserved from lane artifacts. This digest does not claim full historical coverage beyond the cited public-domain source pack.",
    "",
    "## 4. Normalized Records",
    "| Record ID | Category / segment | Source ID | Normalized observation | Data type | Decision relevance | Caveat |",
    "| --- | --- | --- | --- | --- | --- | --- |",
    ...digestIds.records.map((record) => `| ${record.id} | ${record.laneId} | ${record.sourceIds.join(", ") || "See lane"} | ${escapeCell(record.text)} | claim | Supports lane-level finding | Bound to cited source-pack excerpt |`),
    "",
    "## 5. Quantitative Signal",
    "| Signal ID | Metric | Value | Source ID | Population / corpus | Caveat |",
    "| --- | --- | --- | --- | --- | --- |",
    ...(digestIds.quantities.length > 0
      ? digestIds.quantities.map((item) => {
        const row = normalizeRow(item.row, 6);
        return `| ${item.id} | ${escapeCell(row[1] ?? row[0] ?? "")} | ${escapeCell(row[2] ?? "")} | ${escapeCell(row[3] ?? "")} | ${escapeCell(row[4] ?? "")} | ${escapeCell(row[5] ?? "")} |`;
      })
      : ["| Q1 | No material finding | n/a | n/a | n/a | No quantitative signal recorded |"]),
    "",
    "## 6. Raw User / Market Language",
    "No material finding. This run uses official historical source excerpts, not user-review language.",
    "",
    "## 7. Pattern Library",
    "| Pattern ID | Pattern | Signal | Evidence IDs | Strength | Decision relevance | Caveat |",
    "| --- | --- | --- | --- | --- | --- | --- |",
    ...digestIds.patterns.map((pattern) => `| ${pattern.id} | ${escapeCell(pattern.text)} | INFERENCE | ${pattern.sourceIds.join(", ") || "R#"} | medium | Supports the research decision | Deterministic extraction from lane artifact |`),
    "",
    "## 8. Domain / Market / Competitor Observations",
    "Not applicable.",
    "",
    "## 9. Contradictions",
    "| Contradiction ID | Contradiction | Evidence A | Evidence B | Current interpretation | Decision impact |",
    "| --- | --- | --- | --- | --- | --- |",
    ...(digestIds.contradictions.length > 0
      ? digestIds.contradictions.map((item) => {
        const row = normalizeRow(item.row, 6);
        return `| ${item.id} | ${escapeCell(row[1] ?? row[0] ?? "")} | ${escapeCell(row[2] ?? "")} | ${escapeCell(row[3] ?? "")} | ${escapeCell(row[4] ?? "")} | ${escapeCell(row[5] ?? "")} |`;
      })
      : ["| C1 | No material finding | n/a | n/a | No contradiction recorded | n/a |"]),
    "",
    "## 10. Negative Evidence",
    "| Negative ID | What weakens the thesis | Evidence ID | Decision impact |",
    "| --- | --- | --- | --- |",
    ...(digestIds.negatives.length > 0
      ? digestIds.negatives.map((item) => {
        const row = normalizeRow(item.row, 4);
        return `| ${item.id} | ${escapeCell(row[1] ?? row[0] ?? "")} | ${escapeCell(row[2] ?? "")} | ${escapeCell(row[3] ?? "")} |`;
      })
      : ["| N1 | No material finding | n/a | n/a |"]),
    "",
    "## 11. Blocked / Weak Sources",
    "| Source | Attempt | Block reason / weakness | Substitute | Confidence impact |",
    "| --- | --- | --- | --- | --- |",
    ...(blockedRows.length > 0
      ? blockedRows.map(({ row }) => {
        const normalized = normalizeRow(row, 8);
        return `| ${escapeCell(normalized[0] ?? "")} | ${escapeCell(normalized[2] ?? "")} | ${escapeCell(normalized[3] ?? "")} | ${escapeCell(normalized[5] ?? "")} | ${escapeCell(normalized[6] ?? "")} |`;
      })
      : ["| No material finding | n/a | No blocked source recorded | n/a | none |"]),
    "",
    "## 12. Source-To-Evidence Map",
    "| Source ID | Records | Quantitative signals | Patterns | Contradictions / negative evidence |",
    "| --- | --- | --- | --- | --- |",
    ...sourceMapRows,
    "",
    "## 13. Confidence Notes",
    `Strongest evidence is primary/public-domain source material. Confidence is bounded by the deliberately small source pack and by deterministic extraction from ${rawLanes.length} lanes.`,
    "",
    "## 14. Candidate Project Context",
    ...digestIds.patterns.slice(0, 5).map((pattern) => `- ${pattern.text} (${pattern.id})`),
  ].join("\n");
}

function renderCeoBrief(run: RunManifest, rawLanes: RawLane[], digestIds: DigestIds): string {
  const strongest = digestIds.patterns[0];
  const firstContradiction = digestIds.contradictions[0];

  return [
    `# CEO Brief: ${run.title}`,
    "",
    `**Research run:** \`${run.runId}\``,
    `**Status:** ${digestIds.records.length > 0 ? "Directional" : "Not decision-grade"}`,
    `**Primary decision affected:** What the cited source record supports and what should not be overclaimed`,
    `**Evidence threshold:** ${rawLanes.every((lane) => lane.lane.status === "complete") ? "Met" : "Partially met"}`,
    "",
    "## 1. Executive Read",
    strongest
      ? `The strongest synthesized signal is: ${strongest.text} (${strongest.id}). The run preserves ${digestIds.contradictions.length} contradiction(s) and ${digestIds.negatives.length} negative-evidence item(s), so the output should be used as bounded source-grounded analysis rather than a broad historical claim.`
      : "No decision-grade signal emerged from the lane artifacts.",
    firstContradiction
      ? `The main unresolved tension is ${firstContradiction.id}: ${firstContradiction.row[1] ?? firstContradiction.row[0]}.`
      : "No material contradiction was recorded.",
    "",
    "## 2. Numbers That Matter",
    "| Metric | Count / value | Why it matters |",
    "| --- | --- | --- |",
    `| Sources reviewed | ${uniqueSources(rawLanes.flatMap((lane) => lane.sources)).length} | Shows source-pack coverage |`,
    `| Normalized records | ${digestIds.records.length} | Shows how much raw evidence became analyzable |`,
    `| Benchmarks / data points | ${digestIds.quantities.length} | Indicates whether quantitative support exists |`,
    `| Categories / segments | ${rawLanes.length} | One segment per lane |`,
    `| Quantitative signals | ${digestIds.quantities.length} | Keeps numbers separate from interpretation |`,
    `| Patterns | ${digestIds.patterns.length} | Shows repeatable inference surfaces |`,
    `| Contradictions | ${digestIds.contradictions.length} | Prevents smoothing tension away |`,
    `| Gaps / weak-evidence areas | ${digestIds.negatives.length} | Bounds confidence |`,
    `| Estimated runtime cost | $${run.totals.estimatedCostUsd.toFixed(6)} | Local execution should not pretend provider spend |`,
    "",
    "## 3. Category / Segment Structure",
    "| Category / segment | Normalized record count | Signal | Decision relevance |",
    "| --- | ---: | --- | --- |",
    ...rawLanes.map((lane) => {
      const count = digestIds.records.filter((record) => record.laneId === lane.lane.laneId).length;
      const pattern = digestIds.patterns.find((item) => item.laneId === lane.lane.laneId);
      return `| ${lane.lane.title} | ${count} | ${escapeCell(pattern?.text ?? "No material finding")} | ${escapeCell(lane.lane.mission)} |`;
    }),
    "",
    "## 4. Signal Read",
    strongest ? `The evidence supports a bounded read: ${strongest.text} (${strongest.id}). Full source mapping lives in RAW_DATA_DIGEST.md.` : "No signal read available.",
    "",
    "## 5. Confidence-Weighted Findings",
    "| Confidence | Finding | Why it matters | Brief evidence reference |",
    "| --- | --- | --- | --- |",
    ...digestIds.patterns.slice(0, 4).map((pattern, index) => `| ${index === 0 ? "High" : "Medium"} | ${escapeCell(pattern.text)} | Affects interpretation of the research question | ${pattern.id} |`),
    "",
    "## 6. Decision Implications",
    "| Area | Implication |",
    "| --- | --- |",
    "| Synthesis | Use the source-bounded conclusion; do not convert it into a broader claim than the raw lanes support. |",
    "| Follow-up | Inspect original full sources before publishing historical or technical claims outside this run. |",
    "",
    "## 7. Confidence Boundaries",
    `High confidence that the checked lane artifacts exist and cite the source pack. Medium confidence in synthesized interpretation because this is deterministic extraction from ${rawLanes.length} bounded lanes, not a comprehensive literature review.`,
    "",
    "## 8. Next Action",
    "Run a second pass against the full original source documents if the decision requires publication-grade historical precision.",
    "",
    "## 9. Source Confidence",
    `**Confidence:** Medium-high`,
    `**Evidence base:** ${uniqueSources(rawLanes.flatMap((lane) => lane.sources)).length} sources, ${digestIds.records.length} records, ${digestIds.patterns.length} patterns, ${digestIds.contradictions.length} contradictions, ${digestIds.negatives.length} gaps`,
    "**Raw data location:** `RAW_DATA_DIGEST.md`",
  ].join("\n");
}

function renderProjectDoc(run: RunManifest, rawLanes: RawLane[], digestIds: DigestIds): string {
  return [
    `# ChatGPT Project Doc: ${run.title}`,
    "",
    `**Research run:** \`${run.runId}\``,
    `**Confidence:** Medium-high`,
    `**Source anchors:** ${digestIds.patterns.slice(0, 5).map((pattern) => pattern.id).join(", ") || "No material finding"}`,
    "",
    "## Durable Findings",
    ...(digestIds.patterns.slice(0, 5).map((pattern) => `- ${pattern.text} (${pattern.id})`)),
    "",
    "## Caveats",
    `- This run is bounded to ${rawLanes.length} runtime lanes and the checked source pack.`,
    "- Do not treat deterministic synthesis as a substitute for reading the original sources when publication-grade precision is required.",
    "",
    "## Decisions Affected",
    "- Source-grounded interpretation and follow-up research planning.",
    "",
    "## Do Not Overclaim",
    ...(digestIds.negatives.length > 0
      ? digestIds.negatives.map((item) => `- ${item.row[1] ?? item.row[0]} (${item.id})`)
      : ["- Do not claim broader coverage than the source pack supports."]),
    "",
    "## Do Not Add To Durable Context",
    "- Lane-local speculation without support in RAW_DATA_DIGEST.md.",
    "- Claims from blocked, weak, or unchecked sources.",
    "",
    "## Revisit Trigger",
    "Re-run when new source documents are added, source-pack excerpts are replaced, or the decision requires source-complete coverage.",
  ].join("\n");
}

function parseSources(lane: LaneManifest, text: string): SourceRow[] {
  const rows = tableRows(text, "Source List");
  const fallbackRows = rows.length > 0 ? rows : tableRows(text, "Sources Checked");

  return fallbackRows
    .map((row) => ({
      laneId: lane.laneId,
      localId: stripMarkdown(row[0] ?? ""),
      globalId: "",
      source: stripMarkdown(row[1] ?? ""),
      url: stripMarkdown(row[2] ?? ""),
      type: stripMarkdown(row[3] ?? "primary"),
      confidence: stripMarkdown(row[5] ?? row[4] ?? "medium"),
      notes: stripMarkdown(row[6] ?? row[4] ?? lane.title),
    }))
    .filter((source) => /^S\d+$/.test(source.localId));
}

function tableRows(text: string, heading: string): string[][] {
  const section = extractHeadingSection(text, heading);
  const table = section ? parseFirstMarkdownTable(section) : undefined;
  return table?.rows ?? [];
}

function collectBulletLines(text: string, heading: string): string[] {
  const section = extractHeadingSection(text, heading);

  if (!section) {
    return [];
  }

  return section
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.startsWith("- "))
    .map((line) => line.replace(/^-+\s*/, "").trim())
    .filter((line) => line.length > 0 && !/No material finding/i.test(line));
}

function collectInferenceLines(text: string): string[] {
  return collectBulletLines(text, "Inferences").filter((line) => /\bINFERENCE\b/i.test(line));
}

function uniqueSources(sources: SourceRow[]): SourceRow[] {
  const seen = new Set<string>();
  const unique: SourceRow[] = [];

  for (const source of sources) {
    if (seen.has(source.globalId)) {
      continue;
    }

    seen.add(source.globalId);
    unique.push(source);
  }

  return unique;
}

function replaceSourceRefs(value: string, laneId: string, sourceMap: Map<string, string>): string {
  return value.replace(/\bS\d+\b/g, (sourceId) => sourceMap.get(`${laneId}:${sourceId}`) ?? sourceId);
}

function cleanEvidenceLine(value: string): string {
  return stripMarkdown(value)
    .replace(/^FACT:\s*/i, "")
    .replace(/^INFERENCE:\s*/i, "")
    .replace(/^SPECULATION:\s*/i, "")
    .trim();
}

function normalizeRow(row: string[], length: number): string[] {
  return Array.from({ length }, (_, index) => stripMarkdown(row[index] ?? ""));
}

function escapeCell(value: string): string {
  return stripMarkdown(value).replace(/\|/g, "\\|").replace(/\r?\n/g, " ");
}
