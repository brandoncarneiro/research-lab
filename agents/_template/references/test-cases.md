# Test Cases Template

Use this file to test whether the agent pack triggers at the right time, produces the required output, and fails cleanly.

## Should Trigger

The agent should be used for requests like:

- "{specific request that clearly needs this agent}"
- "{paraphrased request with the same decision and source class}"
- "{lane assignment that names this agent's domain}"

Expected result:

- Codex loads `agents/{agent-name}/AGENT.md`.
- The lane uses this pack with `prompts/SUBAGENT_LANE.md`.
- The lane output is written to `raw/{lane-name}.md`.

## Should Not Trigger

The agent should not be used for requests like:

- "{generic research request outside this specialty}"
- "{synthesis task that belongs to parent Codex}"
- "{task that belongs to another agent pack}"
- "{task that would require disallowed tools or private account actions}"

Expected result:

- Codex uses the generic supervisor or another more relevant agent pack.
- Codex does not stretch this agent beyond its scope.

## Functional Output Tests

A valid lane output must:

- Save to the assigned `raw/{lane-name}.md` path.
- State the lane question and decision implication.
- List tools used.
- List sources checked, including weak or no-signal sources.
- Separate `FACT`, `INFERENCE`, and `SPECULATION`.
- Cite every factual claim.
- Mark source type and confidence.
- Preserve contradictions.
- Record negative evidence.
- State what the lane proves and does not prove.
- End with a source appendix.

## Failure Cases

The agent should stop or mark the lane blocked when:

- The lane has no decision it can affect.
- Required inputs are missing and cannot be inferred from the run brief.
- The task requires disallowed tools.
- The task asks for fake research or fabricated citations.
- Sources are unavailable and no allowed alternate source class can answer the lane.
- The requested output is final synthesis rather than raw lane output.

Expected behavior:

- Record the blocker.
- Do not invent evidence.
- Do not run unrelated research to fill the gap.

## Undertriggering Signals

The pack may be undertriggering if:

- Codex handles obvious lane assignments with only the generic prompt.
- the project owner has to explicitly name this agent for matching tasks.
- Outputs miss domain-specific source rules that this pack should provide.
- Similar requests produce inconsistent workflows.

Iteration guidance:

- Add more concrete examples to `Use When`.
- Add paraphrased trigger examples.
- Clarify the decision and source classes the agent owns.

## Overtriggering Signals

The pack may be overtriggering if:

- Codex uses it for generic research tasks.
- Codex uses it for synthesis instead of lane execution.
- Codex uses it when another agent pack is more specific.
- The output includes source rules irrelevant to the lane.

Iteration guidance:

- Add sharper negative triggers to `Do Not Use When`.
- Narrow the purpose statement.
- Move broad rules back to generic prompts or repo standards.

## Iteration Guidance

After each real run using this pack, review:

- Did it trigger for the right lane?
- Did it avoid unrelated lanes?
- Did it improve source selection?
- Did it preserve citations, confidence, contradictions, and negative evidence?
- Did it produce decision-grade output without extra prompting?
- Did any instruction cause confusion or bloat?

Update the pack only with lessons grounded in real failures, edge cases, or repeatable improvements.
