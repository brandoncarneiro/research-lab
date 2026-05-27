# {Agent Name}

`AGENT.md` is the main instruction file for this research-agent pack. Keep it concise. Put detailed source rules, output rules, examples, and tests in `references/`.

## Purpose

State the specialized research lane this agent supports and the project/profile decision it should improve.

## Scope

- Scope: `{generic | profile-specific}`
- Profile: `{any | profiles/{profile}/PROFILE.md}`
- Output path: assigned by run brief, normally `raw/{lane-name}.md`

## Use When

- Use when {specific trigger condition}.
- Use when {specific decision or lane type}.
- Use when {specific source or evidence class is needed}.

## Do Not Use When

- Do not use when {negative trigger}.
- Do not use when the task is generic synthesis across all lanes.
- Do not use when the decision does not require this agent's specialty.

## Concrete Use Cases

1. {Use case name}
   - Trigger: {what the requester or parent Codex says}
   - Inputs: {required inputs}
   - Output: {expected lane output}
   - Decision: {decision implication}
2. {Use case name}
   - Trigger: {what the requester or parent Codex says}
   - Inputs: {required inputs}
   - Output: {expected lane output}
   - Decision: {decision implication}
3. {Use case name}
   - Trigger: {what the requester or parent Codex says}
   - Inputs: {required inputs}
   - Output: {expected lane output}
   - Decision: {decision implication}

## Inputs Required

- Research run folder: `research/runs/YYYY-MM-DD-topic/`
- Lane name: `{lane-name}`
- Lane question: `{lane-question}`
- Decision this lane informs: `{decision}`
- Target source classes: `{source classes}`
- Stop conditions: `{stop conditions}`
- Output file path: `raw/{lane-name}.md`

## Allowed Tools

Use only `docs/TOOL_MENU.md` and the tools approved for the run:

- Composio Search/browser or equivalent public web discovery
- Browser/open URL inspection of public pages
- Local/cheap extraction where possible
- Robots.txt and sitemap preflight before crawl-style collection
- Official APIs, official app listings, and platform-owned pages first for platform research
- Local file/repo writing inside the run folder

Do not use paid, conditional, hosted extractor, crawler, scraper, or API-key tools unless the brief explicitly approves the tool, API/account setup, cap, and stop condition.

## Disallowed Tools

Do not use:

- Gmail
- Calendar
- Slack
- Supabase
- Vercel
- Stripe
- production databases
- posting tools
- sending tools
- destructive tools
- private account actions
- tools outside `docs/TOOL_MENU.md` unless the project owner explicitly expands scope
- captcha bypass
- paywall bypass
- login bypass
- stealth scraping
- residential proxies
- mass social scraping
- LinkedIn scraping
- scraping private or personal accounts

## Source Priority

Use `references/source-priority.md` for detailed source rules.

Default order:

1. Primary sources.
2. Direct public user language when relevant.
3. Secondary sources.
4. Inferences from cited evidence.

Record source quality, source type, confidence, contradictions, and negative evidence.

## Workflow

1. Confirm this agent matches the lane mission.
2. Read the run brief and lane assignment.
3. Open `references/source-priority.md` before choosing sources.
4. Use only allowed tools.
5. Record sources checked, including weak or no-signal sources.
6. Separate `FACT`, `INFERENCE`, and `SPECULATION`.
7. Preserve contradictions and negative evidence.
8. Open `references/output-rules.md` before writing the lane output.
9. Write the lane output to `raw/{lane-name}.md`.
10. Run the completion checklist before returning.

## Required Output

Use `references/output-rules.md` for detailed output rules.

The lane output must include:

- Lane question.
- Decision this lane informs.
- Tools used.
- Sources checked.
- Key evidence.
- Facts, inferences, and speculation.
- Contradictions.
- Negative evidence.
- Confidence.
- What this proves.
- What this does not prove.
- Decision implication.
- Source appendix.

## Red Flags

- The lane question is too broad to complete.
- The task asks for synthesis before raw lane evidence exists.
- Factual claims lack citations.
- User-generated evidence is paraphrased when exact language matters.
- Internal project/profile docs are treated as external proof.
- Weak evidence is made to sound strong.
- Contradictions are omitted.
- The agent is being used outside its stated trigger conditions.

## What Not To Do

- Do not run generic research that does not affect the assigned decision.
- Do not create fake research, citations, quotes, numbers, rankings, or source claims.
- Do not use LangChain or LangGraph.
- Do not create a new orchestration framework.
- Do not mutate external systems.
- Do not use disallowed tools.
- Do not bypass access restrictions or platform protections.
- Do not write `MASTER_RESEARCH.md`; synthesis belongs to parent Codex.
- Do not hide uncertainty.

## Completion Checklist

- [ ] Agent use is justified by the lane mission.
- [ ] Required inputs are present or blocker is recorded.
- [ ] Source priority was followed or deviations were explained.
- [ ] Only allowed tools were used.
- [ ] Sources checked include weak and no-signal sources.
- [ ] Factual claims are cited.
- [ ] Source type and confidence are marked.
- [ ] Facts, inferences, and speculation are separated.
- [ ] Contradictions are preserved.
- [ ] Negative evidence is recorded.
- [ ] Decision implication is explicit.
- [ ] Output is saved to `raw/{lane-name}.md`.

## References

- `references/source-priority.md`: source ranking and source-quality rules.
- `references/output-rules.md`: lane output requirements.
- `references/test-cases.md`: trigger, output, and failure tests.

## Troubleshooting

- If the lane is too broad, narrow it to the decision, source class, or competitor set that matters.
- If sources are weak, record the weakness and stop at low confidence instead of filling gaps.
- If tools fail, record the tool failure and try an allowed alternate tool.
- If output mixes facts and interpretation, rewrite into `FACT`, `INFERENCE`, and `SPECULATION`.
- If this agent is triggering too often, add sharper negative triggers in `Do Not Use When` and `references/test-cases.md`.
- If this agent is not triggering when it should, add concrete trigger examples in `Use When` and `Concrete Use Cases`.

## Test Cases

Use `references/test-cases.md` before considering the agent pack ready.
