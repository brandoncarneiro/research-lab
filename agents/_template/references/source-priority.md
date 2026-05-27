# Source Priority Template

Use this file to define how this agent ranks, evaluates, and records sources.

## Default Priority

1. Primary sources first:
   - Official company pages.
   - Official docs.
   - Official app pages and marketplace listings when relevant to the lane.
   - Laws, regulations, court records, or government guidance when legal claims matter.
   - Platform docs, policy pages, API docs, pricing pages, changelogs, and public reports from the source owner.
2. User-generated evidence when the lane is about sentiment, reviews, user language, demand, trust, objections, or recurring behavior:
   - App Store and Google Play reviews when app-market evidence is relevant.
   - Reddit posts and comments.
   - YouTube comments.
   - Podcast comments.
   - Public forums and social posts.
3. Secondary sources only after primary sources or user language:
   - News articles.
   - Analyst reports.
   - Market maps.
   - Blog analysis.
   - Curated lists.
4. Inferred evidence only when the inference is tied to cited facts.

## Source Rules For This Agent

Replace this section with agent-specific rules:

- Prefer {source class} because {reason}.
- Treat {source class} as weak unless corroborated by {source class}.
- Use user-generated evidence only when {condition}.
- Do not use {source class} because {reason}.

## Weak-Source Warnings

Flag sources as weak when:

- The source has no clear owner, author, or date.
- The source repeats another source without adding evidence.
- The source is promotional and not supported by observable product, pricing, policy, or user evidence.
- The source is a scraped summary with missing original context.
- The source claims market size, rankings, or user behavior without methodology.
- The source is old enough that the claim may have changed.

Weak sources can still be listed, but they should not carry a high-confidence finding alone.

## Recording Source Quality

For every source used or checked, record:

- Source ID.
- Source name.
- URL or local reference.
- Source type: `primary`, `secondary`, `user-generated`, `scraped`, or `inferred`.
- Result: `useful`, `weak`, `no relevant evidence`, or `blocked`.
- Confidence: `high`, `medium`, or `low`.
- What the source directly supports.
- What the source does not prove.

## Negative Evidence

Record negative evidence when:

- A likely source does not contain the expected claim.
- A product page omits pricing, risk, privacy, policy, technical, or profile-specific claims that the lane expected.
- User reviews do not mention a hypothesized behavior.
- Search results show low source availability for a claim.
- Sources contradict the initial hypothesis.

Negative evidence is decision-grade. Do not discard it.
