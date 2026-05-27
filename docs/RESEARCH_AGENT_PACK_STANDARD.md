# Research Agent Pack Standard

A research-agent pack is a repo-native instruction pack that Codex can load when assigning a specialized evidence lane.

It is:

- A focused set of lane instructions under `agents/{agent-name}/`.
- A way to encode source priorities, output rules, test cases, and domain-specific research judgment.
- Composable with the generic `prompts/SUPERVISOR.md`, `prompts/SUBAGENT_LANE.md`, and `prompts/SYNTHESIS.md` workflow.
- Either generic or profile-specific, as declared by the pack.

It is not:

- A Claude Skill.
- An OpenAI Skill.
- A LangGraph node.
- A LangChain component.
- An MCP server.
- A replacement for parent Codex supervision or final synthesis.

The pack tells Codex how to run a specialized evidence lane. Composio MCP remains the tool layer. The agent pack is the workflow and judgment layer.

## Folder Structure

```text
agents/{agent-name}/
  AGENT.md
  references/
    source-priority.md
    output-rules.md
    test-cases.md
    optional-extra-reference.md
  scripts/
    optional-helper-script.ts
```

Required:

- `AGENT.md`: the main instruction file.
- `references/source-priority.md`: detailed source rules.
- `references/output-rules.md`: output and evidence-recording rules.
- `references/test-cases.md`: trigger, output, and failure tests.

Optional:

- Additional `references/*.md` files for narrow domain rules or examples.
- `scripts/` only when deterministic checks or transformations are useful. Do not add scripts for work that Codex can do clearly from instructions.

## Metadata

Every pack must state:

- Scope: `generic` or `profile-specific`.
- Profile: profile name when scope is `profile-specific`; otherwise `any`.
- Output path: assigned by the run brief, normally `raw/{lane-name}.md`.
- Required tool policy: `docs/TOOL_MENU.md` plus any stricter profile/brief rules.
- Decision affected: supplied by the run brief/profile.

## Layering

Keep three layers separate:

1. Core pack standard: structure, triggers, progressive disclosure, tests, and evidence rules.
2. Project/profile layer: project name, owner/audience, run paths, tool/session defaults, decision taxonomy, source context, and prompt overlay.
3. Pack layer: lane-specific source priorities, output tables, trigger examples, failure cases, and domain heuristics.

Do not put project strategy into a generic pack. Do not put final synthesis responsibilities into a lane pack.

## Adapted Principles

These principles are adapted from Anthropic's skill-building guide, but this standard does not copy the Claude Skill format or assume Codex supports it natively.

### Start With Concrete Use Cases

Before writing an agent pack, define 2-3 concrete use cases:

- The decision the agent supports.
- The specific research lane it should execute.
- The source classes it should inspect.
- The output it should produce.
- The stop conditions or completion signal.

Do not start from a vague capability such as "help with research." Start from a decision-grade lane such as "compare competitor paywall trust objections from public reviews and pricing pages."

### Include Use And Non-Use Triggers

Every `AGENT.md` must include:

- `Use When`: positive trigger conditions.
- `Do Not Use When`: negative trigger conditions.

This prevents both undertriggering and overtriggering. A good agent pack should be narrow enough that Codex can decide when to load it without turning every research task into the same generic lane.

### Keep AGENT.md Concise

`AGENT.md` is the core instruction file. It should tell Codex:

- What the agent does.
- When to use it.
- What inputs it needs.
- What tools are allowed or disallowed.
- What workflow to follow.
- What output is required.
- Which references to open for detailed rules.

Do not bury important instructions in long prose. Move detailed examples, source rules, and output formats into `references/`.

### Use Progressive Disclosure

Research-agent packs should have small core instructions and detailed references loaded only when needed:

- Load `AGENT.md` when assigning the specialized lane.
- Load `references/source-priority.md` when choosing or ranking sources.
- Load `references/output-rules.md` when writing or validating the lane output.
- Load `references/test-cases.md` when reviewing whether the pack is scoped correctly.
- Load optional references only for domain-specific edge cases.

This keeps the supervisor and subagent prompts small while preserving deeper rules.

### Include Test Cases

Every agent pack must include tests for:

- Requests that should trigger the pack.
- Requests that should not trigger the pack.
- Required output shape.
- Failure or blocked cases.
- Undertriggering signals.
- Overtriggering signals.
- Iteration notes.

Tests are not fake research. They are prompt and workflow checks.

### Include Troubleshooting

Every `AGENT.md` must include short troubleshooting guidance for common failures:

- The lane is too broad.
- Sources are weak or missing.
- Tools are unavailable.
- Output mixes facts, inferences, and speculation.
- Citations are missing.
- The agent is being used for the wrong decision.

### Compose With Generic Prompts

Agent packs do not replace the generic research prompts.

The normal flow remains:

1. `prompts/SUPERVISOR.md` defines the run, lanes, scope, tools, file ownership, and stop conditions.
2. A relevant `agents/{agent-name}/AGENT.md` can be loaded for a specialized lane.
3. `prompts/SUBAGENT_LANE.md` governs lane execution and raw output.
4. `prompts/SYNTHESIS.md` governs final synthesis after required raw lane files exist.

Agent packs should make specialized lanes better, not create a parallel operating system.

### Treat Composio MCP As The Tool Layer

Composio MCP provides access to research tools. It is not the research method, the synthesis layer, or the evidence standard.

Agent packs must:

- Use only allowed research-scoped tools from `docs/TOOL_MENU.md`.
- Treat tool output as evidence to inspect, not truth to copy.
- Record tool failures, empty results, and source gaps.
- Never use disallowed tools unless the project owner explicitly expands scope for the run.
- Never use paid/conditional fallback tools unless the run brief explicitly approves the tool, API/account setup, cap, and stop condition.
- Never bypass captcha, paywalls, logins, robots/platform restrictions, or use stealth scraping, residential proxies, mass social scraping, LinkedIn scraping, or private/personal account scraping.
- Never send, post, publish, deploy, mutate accounts, or touch production systems during research.

### Preserve Decision-Grade Evidence

Every pack must preserve:

- Citations for factual claims.
- Source type: `primary`, `secondary`, `user-generated`, `scraped`, or `inferred`.
- Confidence: `high`, `medium`, or `low`.
- Negative evidence and no-signal sources.
- Blocked-source logging.
- Contradictions.
- What the evidence proves.
- What the evidence does not prove.
- Decision implications for the active project/profile.

Weak evidence must be labeled weak. Contradictions must not be smoothed into a false average.

## Naming Rules

Agent pack folder names must:

- Use kebab-case.
- Use no spaces.
- Use no capitals.
- Be specific to the lane or domain.
- Avoid vague names such as `research-helper`, `general-agent`, or `analysis-support`.

Good examples:

- `legal-research`
- `marketing-research`
- `website-research`
- `technical-research`
- `app-competitor-research`
- `trust-risk-theology-research`

## Quality Bar

Every research-agent pack must state, either in `AGENT.md` or the required references:

- What it does.
- Scope and profile applicability.
- When to use it.
- When not to use it.
- Concrete use cases.
- Inputs required.
- Source priority.
- Allowed tools.
- Disallowed tools.
- Required outputs.
- Decision implications.
- Red flags.
- What not to do.
- Completion checklist.
- References.
- Troubleshooting.
- Test cases.

If any of these are missing, the pack is not ready.
