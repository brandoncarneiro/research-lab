# Example First Research Run

## Priority

P0

## Research Title

Example Customer Problem, Alternatives, Trust, and Pricing Scan

## Run Folder

Use this folder shape for the first run:

```text
research/runs/YYYY-MM-DD-example-customer-problem-scan/
  00-brief.md
  raw/
  extracted/
  output/
```

## Core Decision Question

What evidence supports or weakens the decision to invest in this customer problem, and what should the project owner validate next?

## Why This Run Comes First

This run tests whether there is source-grounded evidence for the customer problem, current alternatives, trust concerns, pricing expectations, and competitive context before the team makes product, positioning, vendor, or operations decisions.

## Source Context To Consult

Before synthesis, parent Codex must have the relevant source context from the profile, run brief, public URLs, user-provided excerpts, or local files deliberately provided for the run and kept out of git.

Example source context may include:

- product notes
- customer interview excerpts
- support-ticket themes
- public competitor pages
- public reviews or forum discussions
- public docs, policies, pricing pages, reports, laws, or papers

These source docs are context and hypotheses, not external proof. External claims still require external citations.

## Decision Gates

| Gate | Question | Evidence strength | Decision implication |
| --- | --- | --- | --- |
| Problem | Is the customer problem visible in credible sources? | High / Medium-high / Medium / Low | What changes for product scope |
| Alternatives | What do customers use today? | High / Medium-high / Medium / Low | What changes for positioning and differentiation |
| Trust | What risks, objections, or compliance concerns appear? | High / Medium-high / Medium / Low | What changes for trust, risk, legal, or policy work |
| Value | What evidence suggests willingness to pay, switch, or adopt? | High / Medium-high / Medium / Low | What changes for pricing or packaging |

If evidence is weak, say weak. Do not cover weak evidence with confident prose.

## Required Lanes

### Lane 1: Customer Problem Evidence

Question: What public or provided evidence shows the problem exists and matters?

Required output: source log, evidence table, negative evidence, confidence rating, and decision implication.

### Lane 2: Alternatives And Competitors

Question: What alternatives, competitors, substitutes, or manual workflows already address the problem?

Required output: competitor/substitute matrix, source-backed positioning notes, contradictions, and gaps.

### Lane 3: Trust, Risk, Legal, Or Policy Constraints

Question: What trust, risk, legal, policy, compliance, or data-handling constraints affect the decision?

Required output: risk table, blocked/weak sources, required follow-up, and confidence boundaries.

### Lane 4: Pricing, Adoption, Or Vendor Signal

Question: What evidence suggests willingness to pay, adopt, switch, renew, churn, or select a vendor?

Required output: pricing/adoption signal table, evidence strength, negative evidence, and next validation step.

## Required Intermediate Outputs

- `raw/customer-problem-evidence.md`
- `raw/alternatives-and-competitors.md`
- `raw/trust-risk-policy.md`
- `raw/pricing-adoption-signal.md`
- `extracted/findings.md`
- `extracted/contradictions.md`
- `extracted/tables.md`
- `extracted/open-questions.md`

Raw evidence must be saved before synthesis. Parent Codex must inspect the raw lane files before writing `extracted/` or `output/`.

## Required Final Artifacts

The run must produce exactly these three final artifacts by default:

- `output/RAW_DATA_DIGEST.md`
- `output/CEO_BRIEF.md`
- `output/CHATGPT_PROJECT_DOC.md`

Do not create duplicate summaries, alternate reports, or extra synthesis docs by default. `output/MASTER_RESEARCH.md` is legacy/optional only and must not be created unless explicitly requested.

## Stop Conditions

Stop when one of these is true:

1. Each required lane has enough sourced evidence to answer its lane question with clear confidence limits.
2. Required source context is unavailable before synthesis.
3. Tool access is insufficient to inspect the necessary sources.
4. A source requires a banned action or unapproved paid/conditional tool.
5. Evidence is too weak to support a decision, in which case the final output must say so plainly.

Do not compensate for weak evidence with confident prose.

## Validation Criteria

- The run folder matches `research/runs/YYYY-MM-DD-example-customer-problem-scan/`.
- `00-brief.md` names the title, decision, source context, lanes, tool posture, banned posture, and stop conditions.
- `raw/` contains all required lane files or explicit blockers.
- Each lane has raw evidence, source log, blocked/no-signal sources, negative evidence, contradictions, and confidence level.
- `extracted/` preserves findings, contradictions, tables, and open questions.
- `output/RAW_DATA_DIGEST.md` is evidence-led, not narrative-led.
- `output/CEO_BRIEF.md` is a dense decision briefing with normalized counts, category signals, confidence-weighted findings, decision implications, and one next action.
- `output/CHATGPT_PROJECT_DOC.md` contains durable findings and caveats only, not raw dumps or weak/speculative context.
- Every factual claim is cited with a Source ID.
- Contradictions and negative evidence are preserved.
- Weak methodology and blocked sources are visible.
- Profile docs are not treated as external proof.
