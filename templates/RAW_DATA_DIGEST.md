# Raw Data Digest: <Research Topic>

**Date:** <YYYY-MM-DD>
**Research run:** `<run-path>`
**Project:** <project name>
**Project profile:** `<profiles/profile-name/PROFILE.md>`

This is the evidence layer. Keep the source index, normalized records, raw tables, evidence IDs, source-to-evidence map, contradictions, gaps, and confidence notes here. `CEO_BRIEF.md` should compress this into executive signal, not repeat the ledger.

## 1. Collection Scope
**Research question:** <question>
**Date range:** <range>
**Source count:** <#>
**Normalized record count:** <#>
**Benchmark / data point count:** <#>
**Category / segment count:** <#>
**Sources searched:** <short list>
**Sources not searched:** <short list>
**Known gaps:** <short list>

## 2. Source Index
| Source ID | Source | URL/path | Type | Date | Used for | Evidence quality | Bias / limitation |
| --- | --- | --- | --- | --- | --- | --- | --- |
| S1 | <source> | <URL/path> | <primary / secondary / user-generated / scraped / inferred> | <date> | <use> | <high / medium / low> | <bias or limitation> |

## 3. Method Notes
<150 words max. Corpus size, extraction method, sampling limits, obvious bias, and what not to overclaim. Separate FACT / INFERENCE / SPECULATION. Do not hide weak methodology.>

## 4. Normalized Records
| Record ID | Category / segment | Source ID | Normalized observation | Data type | Decision relevance | Caveat |
| --- | --- | --- | --- | --- | --- | --- |
| R1 | <category> | S# | <comparable record / observation> | <review / pricing / benchmark / claim / feature / quote / table row> | <why it matters> | <limit> |

## 5. Quantitative Signal
| Signal ID | Metric | Value | Source ID | Population / corpus | Caveat |
| --- | --- | --- | --- | --- | --- |
| Q1 | <metric> | <value> | S# | <population / corpus> | <caveat> |

## 6. Raw User / Market Language
<Group short, high-signal excerpts by theme. Every excerpt needs a Source ID. No quote dumps. Write `No material finding` when not relevant.>

### <Theme>
- `S#`: "<short excerpt>" - <why it matters>

## 7. Pattern Library
| Pattern ID | Pattern | Signal | Evidence IDs | Strength | Decision relevance | Caveat |
| --- | --- | --- | --- | --- | --- | --- |
| P1 | <pattern> | <FACT / INFERENCE / SPECULATION> | S# / Q# / C# / N# | <high / medium / low> | <decision relevance> | <caveat> |

## 8. Domain / Market / Competitor Observations
<Use only if relevant. Otherwise write `Not applicable`.>

## 9. Contradictions
| Contradiction ID | Contradiction | Evidence A | Evidence B | Current interpretation | Decision impact |
| --- | --- | --- | --- | --- | --- |
| C1 | <contradiction> | S# / P# / Q# | S# / P# / Q# | <current interpretation> | <decision impact> |

## 10. Negative Evidence
| Negative ID | What weakens the thesis | Evidence ID | Decision impact |
| --- | --- | --- | --- |
| N1 | <negative evidence> | S# / Q# / P# | <decision impact> |

## 11. Blocked / Weak Sources
| Source | Attempt | Block reason / weakness | Substitute | Confidence impact |
| --- | --- | --- | --- | --- |
| <source> | <attempt> | <block reason / weakness> | <substitute or none> | <confidence impact> |

## 12. Source-To-Evidence Map
| Source ID | Records | Quantitative signals | Patterns | Contradictions / negative evidence |
| --- | --- | --- | --- | --- |
| S# | R# | Q# | P# | C# / N# |

## 13. Confidence Notes
<What is strong, medium, weak, and why. No fake certainty. Preserve contradictions and negative evidence.>

## 14. Candidate Project Context
<Short list of stable findings that may belong in CHATGPT_PROJECT_DOC.md. Exclude weak, temporary, or speculative items.>
