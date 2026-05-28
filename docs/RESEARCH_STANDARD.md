# Research Standard

Research exists to change decisions. It is not a generic summary generator. Every finding must be source-grounded, decision-relevant, and explicit about confidence.

This standard is profile-independent. Project profiles may add stricter rules, but they must not weaken citation, confidence, contradiction, blocked-source, negative-evidence, or raw-before-synthesis requirements.

## Evidence Rules

- Cite every factual claim with a Source ID.
- Separate `FACT`, `INFERENCE`, and `SPECULATION`.
- Mark source type: `primary`, `secondary`, `user-generated`, `scraped`, or `inferred`.
- Mark confidence: `High`, `Medium-high`, `Medium`, or `Low` in final artifacts.
- Capture exact user language from reviews/comments when relevant.
- Do not invent numbers.
- Do not smooth contradictions.
- Preserve negative evidence.
- Preserve blocked, weak, duplicate, and no-signal sources.
- Do not hide weak methodology.
- Do not inflate confidence.
- Omit irrelevant sections by writing `No material finding`.
- Do not produce generic summaries that do not affect the named decision.
- Treat internal project/profile docs as context and hypotheses, not external proof.
- Stop rather than synthesize if required source context is missing.

## Required Final Artifact Standard

Every standard research run must produce exactly three final artifacts under `output/` unless the project owner explicitly requests otherwise:

1. `RAW_DATA_DIGEST.md`: evidence layer. It is not narrative. It contains collection scope, source index, method notes, normalized records, quantitative signals, raw language, patterns, domain/market/competitor observations when relevant, contradictions, negative evidence, blocked/weak sources, confidence notes, source-to-evidence mapping, and candidate project context.
2. `CEO_BRIEF.md`: decision-facing signal layer. Target 1-2 pages. It compresses the digest into what was learned, what normalized data exists, what signal emerged, what categories or segments matter, what findings carry high/medium/low confidence, what decision changes, and what should happen next.
3. `CHATGPT_PROJECT_DOC.md`: durable project-context capsule. It is not a report and not a raw dump. It contains only stable findings, do-not-overclaim rules, durable caveats, decisions affected, do-not-add-to-context rules, and a revisit trigger.

Raw lane outputs under `raw/` and extraction files under `extracted/` are intermediate evidence only. Do not create duplicate summaries, alternate reports, or extra synthesis docs by default.

## Evidence ID Convention

Use stable evidence IDs in `RAW_DATA_DIGEST.md` and reference those IDs compactly in `CEO_BRIEF.md` and `CHATGPT_PROJECT_DOC.md`:

- Sources: `S1`, `S2`, `S3`
- Quantitative signals: `Q1`, `Q2`, `Q3`
- Pattern IDs: `P1`, `P2`, `P3`
- Contradictions: `C1`, `C2`, `C3`
- Negative evidence: `N1`, `N2`, `N3`

Every factual claim needs a Source ID. Every decision-brief conclusion must be supportable from `RAW_DATA_DIGEST.md`, but the brief should use IDs sparingly: one compact parenthetical or line per major claim is enough. Giant evidence-ID chains belong in `RAW_DATA_DIGEST.md`, not `CEO_BRIEF.md`. `CHATGPT_PROJECT_DOC.md` must exclude weak, temporary, or speculative findings.

## CEO Brief Standard

`CEO_BRIEF.md` is the decision-facing compression layer for the named decision owner and audience. It must not repeat the raw digest and must not become a methodology report.

Target 1-2 pages. Dense is better than long. It can exceed one page only when the signal requires it.

Every CEO brief must include:

- Executive Read: 3-6 direct sentences stating the strongest signal.
- Numbers That Matter: source count, normalized record count, benchmark/data point count, category/segment count, quantitative signal count, pattern count, contradiction count, gap/weak-evidence count, and any run-specific key metrics.
- Category / Segment Structure: the major categories, segments, clusters, or buckets that emerged from the data.
- Signal Read: interpretation of what is happening and what is materially true at the research level.
- Confidence-Weighted Findings: findings labeled High, Medium, or Low confidence, each with why it matters and a brief evidence reference if needed.
- Decision Implications: what changes for the decision taxonomy defined in the run brief/profile, such as product, GTM, finance, positioning, validation, strategy, trust and risk, legal/policy, vendor selection, technical architecture, or operations.
- Next Action: the specific next research run, validation step, product decision, or operating move.

Evidence IDs support the CEO brief but must not dominate it. Detailed source mapping, raw tables, and citation chains live in `RAW_DATA_DIGEST.md`.

Use confidence boundaries instead of caveat dumps. Do not lead with what the research does not prove. State what the research supports and at what confidence level, then name limitations only where they affect decision quality.

## Required Finding Shape

Every finding must answer:

- What did we learn?
- Why does it matter?
- What decision should change?

## Claim Labels

### FACT

A claim directly supported by cited evidence.

Required:

- Source URL or local source reference.
- Source ID.
- Source type.
- Confidence.
- Short explanation of what the source directly supports.

### INFERENCE

A conclusion drawn from one or more facts.

Required:

- Cited facts that support the inference.
- Explanation of the reasoning.
- Confidence.
- Clear limits on what the inference does not prove.

### SPECULATION

A possibility that may be useful for planning but is not proven by the evidence.

Required:

- Why it is plausible.
- What evidence would confirm or reject it.
- Confidence marked `low` unless there is a strong reason otherwise.

## Source Type Definitions

- `primary`: Company pages, official docs, official pricing pages, app listings, laws/regulations, published reports from the source owner, direct transcripts, or firsthand public statements.
- `secondary`: News, analysis, analyst reports, explainers, or summaries from third parties.
- `user-generated`: Reviews, Reddit posts, YouTube comments, social posts, forum posts, podcast comments, and other public audience language.
- `scraped`: Evidence collected through a scraper from a public page or platform.
- `inferred`: Derived from source-grounded observations, not directly stated by a source.

## Tool And Access Rules

- Follow `docs/TOOL_MENU.md`.
- Prefer official APIs, official app listings, source-owned pages, public reports, and normal browser/search inspection before scraping.
- Save raw evidence before synthesis.
- Record blocked sources and why they were blocked.
- Do not bypass captcha, paywalls, logins, robots/platform restrictions, or use stealth scraping, residential proxies, mass social scraping, LinkedIn scraping, or private/personal account scraping.
- Do not use sending, posting, destructive, production, billing, or private account tools during research.

## Contradictions

Do not resolve contradictions by smoothing them into a false average. Record:

- The conflicting claims.
- The sources behind each claim.
- Which source is stronger and why.
- What remains unresolved.
- What follow-up would resolve it.

## Prohibited Output

- Uncited factual claims.
- Made-up quotes.
- Made-up counts, percentages, rankings, or TAM estimates.
- Generic summaries that do not affect the named decision.
- CEO briefs dominated by evidence-ID chains, methodology recaps, or caveat-led disclaimers.
- Claims that blur facts, interpretations, and guesses.
- External claims supported only by internal project/profile documents.
- Synthesis that depends on missing source context.
