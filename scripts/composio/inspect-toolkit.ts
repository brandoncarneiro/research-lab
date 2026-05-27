import {
  createComposioClient,
  requireCliArg,
  shortText,
} from "./shared.js";

const toolkitSlug = requireCliArg(process.argv.slice(2), "toolkit slug");
const composio = createComposioClient();

await composio.toolkits.get(toolkitSlug);

const tools = await composio.tools.getRawComposioTools({
  toolkits: [toolkitSlug],
  limit: 1000,
});

console.log(`Tools for toolkit "${toolkitSlug}": ${tools.length}`);
console.log("slug\tname\ttags\tdescription");

for (const tool of tools) {
  console.log(
    [
      tool.slug,
      tool.name,
      tool.tags?.join(",") ?? "",
      shortText(tool.description, 180),
    ].join("\t"),
  );
}

if (tools.length === 0) {
  console.warn(`No tools returned for "${toolkitSlug}". Confirm the toolkit slug and auth requirements.`);
}
