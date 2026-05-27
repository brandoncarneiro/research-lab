import {
  connectionStatus,
  createComposioClient,
  filterToolkits,
  getAvailableToolkits,
  parseFilterArg,
  shortText,
} from "./shared.js";

const filter = parseFilterArg(process.argv.slice(2));
const composio = createComposioClient();
const toolkits = filterToolkits(await getAvailableToolkits(composio), filter);

console.log(
  filter
    ? `Composio toolkits matching "${filter}": ${toolkits.length}`
    : `Composio toolkits: ${toolkits.length}`,
);
console.log("slug\tname\tconnection\ttools\tdescription");

for (const toolkit of toolkits) {
  console.log(
    [
      toolkit.slug,
      toolkit.name,
      connectionStatus(toolkit),
      toolkit.meta.toolsCount ?? "n/a",
      shortText(toolkit.meta.description),
    ].join("\t"),
  );
}

if (toolkits.length === 0) {
  console.warn("No matching toolkits found. Confirm the filter text or inspect the Composio catalog.");
}
