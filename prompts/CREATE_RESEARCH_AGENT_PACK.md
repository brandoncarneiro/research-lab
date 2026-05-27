# Create Research Agent Pack Prompt

Use this prompt in Codex when the project owner wants a new research-agent pack.

```text
You are working in:

{repo-root}

Objective:
Create one research-agent pack under agents/{agent-name}/.

This is not a Claude Skill.
This is not an OpenAI Skill.
This is not a LangChain or LangGraph artifact.
Do not create fake research.
Do not run research.
Do not create all possible agents.
Do not inspect or modify CLAUDE.md.
Do not touch any other repo.

First, read:
- README.md
- docs/RESEARCH_AGENT_PACK_STANDARD.md
- docs/RESEARCH_STANDARD.md
- docs/TOOL_MENU.md
- prompts/SUPERVISOR.md
- prompts/SUBAGENT_LANE.md
- prompts/SYNTHESIS.md
- agents/_template/AGENT.md
- agents/_template/references/source-priority.md
- agents/_template/references/output-rules.md
- agents/_template/references/test-cases.md
- the active project profile under profiles/{profile}/, if the pack is profile-specific

If the project/profile is not already provided, default to profiles/example/ and state that assumption.

If the decision this agent supports is not already provided, ask the project owner:
"What project decision should this research-agent pack support?"

Before writing files, define:
- Agent folder name in kebab-case.
- Scope: generic or profile-specific.
- Profile, if profile-specific.
- 2-3 concrete use cases.
- Positive trigger conditions.
- Negative trigger conditions.
- Required inputs.
- Source priority.
- Allowed and disallowed tools.
- Required output path and output sections.
- Red flags and stop conditions.

Create:
- agents/{agent-name}/AGENT.md
- agents/{agent-name}/references/source-priority.md
- agents/{agent-name}/references/output-rules.md
- agents/{agent-name}/references/test-cases.md

Use agents/_template/ as the starting structure, but specialize every section for the requested agent. Keep AGENT.md concise. Put detailed source rules, output rules, examples, and tests in references.

Only create scripts if a deterministic helper is clearly useful. Do not overbuild scripts for normal research judgment.

Update docs/RESEARCH_AGENT_PACK_STANDARD.md only if the standard itself needs improvement. Do not edit it just to mention the new agent.

Validation:
- Check that all required pack sections are present.
- Check that the pack does not claim to be a Claude Skill, OpenAI Skill, LangChain node, or LangGraph node.
- Check that the pack follows `docs/TOOL_MENU.md`, treats paid/conditional tools as approval-only, and does not use banned bypass/private/destructive/sending/posting actions.
- Run git diff --check.
- Run available repo checks if present and relevant.

Do not commit unless the project owner explicitly asks.

Final report:
- Files created/changed.
- Concrete use cases defined.
- Trigger and negative-trigger summary.
- Validation results.
- Whether a commit was requested and created.
```
