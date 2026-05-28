# Raw Data Digest: Apollo 13 oxygen tank failure: source-bounded incident review

**Run ID:** `run_e398be625787c92a`
**Research run:** `apollo-13-oxygen-tank-review/`
**Project profile:** `profiles/example/PROFILE.md`
**Execution mode:** local

## 1. Collection Scope
**Research question:** Apollo 13 oxygen tank failure: source-bounded incident review
**Source count:** 4
**Normalized record count:** 16
**Benchmark / data point count:** 5
**Category / segment count:** 4
**Sources searched:** Apollo 13 Press Kit excerpt; Apollo 13 Mission Report excerpt; Apollo 13 Technical Air-To-Ground Voice Transcription excerpt; Apollo 13 Review Board excerpt
**Sources not searched:** See blocked / weak sources
**Known gaps:** See negative evidence

## 2. Source Index
| Source ID | Source | URL/path | Type | Date | Used for | Evidence quality | Bias / limitation |
| --- | --- | --- | --- | --- | --- | --- | --- |
| S1 | Apollo 13 Press Kit excerpt | source-pack/S4-press-kit-excerpts.md | primary | Not recorded | planned mission objective | planned mission objective | Source-pack excerpt; inspect original for full context |
| S2 | Apollo 13 Mission Report excerpt | source-pack/S2-mission-report-excerpts.md | primary | Not recorded | abort and recovery endpoint | abort and recovery endpoint | Source-pack excerpt; inspect original for full context |
| S3 | Apollo 13 Technical Air-To-Ground Voice Transcription excerpt | source-pack/S3-air-ground-transcript-excerpts.md | primary | Not recorded | symptom-record boundary | symptom-record boundary | Source-pack excerpt; inspect original for full context |
| S4 | Apollo 13 Review Board excerpt | source-pack/S1-review-board-report-excerpts.md | primary | Not recorded | root-cause framing | root-cause framing | Source-pack excerpt; inspect original for full context |

## 3. Method Notes
Deterministic synthesis read the checked raw lane files after runtime lane execution. FACT, INFERENCE, SPECULATION, contradictions, and negative evidence were preserved from lane artifacts. This digest does not claim full historical coverage beyond the cited public-domain source pack.

## 4. Normalized Records
| Record ID | Category / segment | Source ID | Normalized observation | Data type | Decision relevance | Caveat |
| --- | --- | --- | --- | --- | --- | --- |
| R1 | timeline-reconciliation | S1 | The pre-mission press kit supports that Apollo 13 was planned as a lunar-landing mission. Source: S1. Confidence: high. | claim | Supports lane-level finding | Bound to cited source-pack excerpt |
| R2 | timeline-reconciliation | S2 | The mission report excerpt supports that Apollo 13 was aborted after abrupt service-module oxygen loss associated with one oxygen tank at about 56 hours into flight. Source: S2. Confidence: high. | claim | Supports lane-level finding | Bound to cited source-pack excerpt |
| R3 | timeline-reconciliation | S3 | The transcript excerpt supports treating air-to-ground communications as the in-the-moment symptom record, not the later root-cause determination. Source: S3. Confidence: medium-high. | claim | Supports lane-level finding | Bound to cited source-pack excerpt |
| R4 | timeline-reconciliation | S2 | The mission report excerpt supports that the crew returned safely to Earth on April 17, 1970. Source: S2. Confidence: high. | claim | Supports lane-level finding | Bound to cited source-pack excerpt |
| R5 | failure-chain | S4 | The review-board excerpt supports that the accident chain centered on service module oxygen tank 2. Source: S4. Confidence: high. | claim | Supports lane-level finding | Bound to cited source-pack excerpt |
| R6 | failure-chain | S4 | The review-board excerpt supports framing the accident as a combination of mistakes and an unforgiving design rather than a random isolated malfunction. Source: S4. Confidence: medium-high. | claim | Supports lane-level finding | Bound to cited source-pack excerpt |
| R7 | failure-chain | S2 | The mission-report excerpt supports that oxygen loss reduced command/service module electrical power, oxygen, and water capability. Source: S2. Confidence: high. | claim | Supports lane-level finding | Bound to cited source-pack excerpt |
| R8 | failure-chain | S3 | The transcript excerpt supports that voice communications record symptoms and operator awareness around the accident window, not the full later engineering cause. Source: S3. Confidence: medium-high. | claim | Supports lane-level finding | Bound to cited source-pack excerpt |
| R9 | operational-recovery | S2 | The mission-report excerpt supports that oxygen loss reduced command/service module power, oxygen, and water capability. Source: S2. Confidence: high. | claim | Supports lane-level finding | Bound to cited source-pack excerpt |
| R10 | operational-recovery | S2 | The mission-report excerpt supports that the lunar module became central to survival and recovery after the service module failure. Source: S2. Confidence: high. | claim | Supports lane-level finding | Bound to cited source-pack excerpt |
| R11 | operational-recovery | S2 | The mission-report excerpt supports that the crew returned safely to Earth on April 17, 1970. Source: S2. Confidence: high. | claim | Supports lane-level finding | Bound to cited source-pack excerpt |
| R12 | operational-recovery | S4 | The review-board excerpt supports that corrective redesign and recertification followed for later Apollo missions. Source: S4. Confidence: medium-high. | claim | Supports lane-level finding | Bound to cited source-pack excerpt |
| R13 | mission-objective-counterevidence | S1 | The press-kit excerpt supports that Apollo 13 was planned as a lunar-landing mission. Source: S1. Confidence: high. | claim | Supports lane-level finding | Bound to cited source-pack excerpt |
| R14 | mission-objective-counterevidence | S1 | The press-kit excerpt supports using the pre-mission document as planned-objective evidence, not actual-outcome evidence. Source: S1. Confidence: high. | claim | Supports lane-level finding | Bound to cited source-pack excerpt |
| R15 | mission-objective-counterevidence | S2 | The mission-report excerpt supports that Apollo 13 was aborted after service-module oxygen loss. Source: S2. Confidence: high. | claim | Supports lane-level finding | Bound to cited source-pack excerpt |
| R16 | mission-objective-counterevidence | S4 | The review-board excerpt supports that the post-accident record led to corrective action for later missions. Source: S4. Confidence: medium-high. | claim | Supports lane-level finding | Bound to cited source-pack excerpt |

## 5. Quantitative Signal
| Signal ID | Metric | Value | Source ID | Population / corpus | Caveat |
| --- | --- | --- | --- | --- | --- |
| Q1 | Source-pack timeline anchors | 3 | S1, S2, S3 | checked example source pack | not a complete mission timeline |
| Q2 | Runtime lane count represented | 1 | S2 | this lane only | runtime metric, not historical evidence |
| Q3 | Causal layers separated | 3 | S4, S2, S3 | checked lane | conceptual count, not a NASA metric |
| Q4 | Recovery evidence layers | 3 | S2, S3, S4 | checked lane | evidence-layer count |
| Q5 | Planned-vs-actual source classes | 2 | S1, S2 | checked lane | source-role count |

## 6. Raw User / Market Language
No material finding. This run uses official historical source excerpts, not user-review language.

## 7. Pattern Library
| Pattern ID | Pattern | Signal | Evidence IDs | Strength | Decision relevance | Caveat |
| --- | --- | --- | --- | --- | --- | --- |
| P1 | The timeline should be synthesized as planned lunar mission, oxygen-system accident, emergency recovery, and safe return rather than as a simple binary success/failure story. Source: S1, S2, S3. | INFERENCE | S1, S2, S3 | medium | Supports the research decision | Deterministic extraction from lane artifact |
| P2 | Apollo 13 can be represented as planned lunar landing, in-flight oxygen-system accident, emergency recovery, and safe return from the checked source pack. Source: S1, S2, S3. | INFERENCE | S1, S2, S3 | medium | Supports the research decision | Deterministic extraction from lane artifact |
| P3 | The final synthesis should distinguish the proximate in-flight event from the latent hardware/process/design chain. Source: S4, S2, S3. | INFERENCE | S4, S2, S3 | medium | Supports the research decision | Deterministic extraction from lane artifact |
| P4 | The source pack supports a layered causal read: symptom record, systems consequence, and review-board root-cause frame are different evidence layers. Source: S4, S2, S3. | INFERENCE | S4, S2, S3 | medium | Supports the research decision | Deterministic extraction from lane artifact |
| P5 | Recovery success is real operational evidence, but it should not be used to soften the engineering-failure finding. Source: S2, S4. | INFERENCE | S2, S4 | medium | Supports the research decision | Deterministic extraction from lane artifact |
| P6 | The source pack supports both emergency recovery success and a need for corrective action after the accident. Source: S2, S4. | INFERENCE | S2, S4 | medium | Supports the research decision | Deterministic extraction from lane artifact |
| P7 | Apollo 13 is better described in this run as a failed lunar-landing objective plus a successful crew-return operation, not as an uncomplicated success. Source: S1, S2, S4. | INFERENCE | S1, S2, S4 | medium | Supports the research decision | Deterministic extraction from lane artifact |
| P8 | The checked sources support planned lunar-landing intent and actual mission abort as separate, conflicting evidence layers. Source: S1, S2. | INFERENCE | S1, S2 | medium | Supports the research decision | Deterministic extraction from lane artifact |

## 8. Domain / Market / Competitor Observations
Not applicable.

## 9. Contradictions
| Contradiction ID | Contradiction | Evidence A | Evidence B | Current interpretation | Decision impact |
| --- | --- | --- | --- | --- | --- |
| C1 | Planned lunar-landing objective conflicts with actual mission-abort outcome | S1 | S2 | S2 is stronger for actual outcome; S1 is stronger for planned intent | how much planned science was partially salvaged is outside this lane |
| C2 | The transcript records observed symptoms while the review board assigns latent causes | S3 | S4 | S4 is stronger for root cause; S3 is stronger for what operators knew in the moment | exact causal weighting needs full report |
| C3 | The recovery was operationally successful, but the underlying system still required corrective redesign | S2 | S4 | both are strong for different claims | detailed operational tradeoffs are not fully extracted |
| C4 | Planned lunar-landing mission versus actual abort and emergency return | S1 | S2 | S1 is stronger for planned intent; S2 is stronger for actual outcome | science-objective losses are not quantified here |

## 10. Negative Evidence
| Negative ID | What weakens the thesis | Evidence ID | Decision impact |
| --- | --- | --- | --- |
| N1 | The excerpt pack cannot support a complete second-by-second timeline | S3 | keep final claims bounded |
| N2 | The checked corpus does not include complete engineering appendices or physical recovered tank evidence | S4 | do not overstate mechanical certainty beyond the report |
| N3 | Safe return alone does not prove the original system was acceptably safe | S4 | final brief must not confuse rescue success with system validation |
| N4 | The source pack does not support claiming Apollo 13 achieved its original lunar-surface objective | S1, S2 | final synthesis must keep mission-objective failure explicit |

## 11. Blocked / Weak Sources
| Source | Attempt | Block reason / weakness | Substitute | Confidence impact |
| --- | --- | --- | --- | --- |
| Full original PDFs during runtime | local-only example execution | Runtime example intentionally avoids live web collection | source-pack excerpts | medium: excerpt-bounded |
| Physical tank inspection | source-pack review | tank was not recovered in this example corpus | review-board source pack | medium |
| Full flight-controller loop audio | source-pack review | not included in checked local source pack | mission-report and transcript excerpts | medium |
| Scientific experiment postmortems | source-pack review | excluded from minimal example scope | press kit and mission report excerpts | low |

## 12. Source-To-Evidence Map
| Source ID | Records | Quantitative signals | Patterns | Contradictions / negative evidence |
| --- | --- | --- | --- | --- |
| S1 | R1, R13, R14 | n/a | P1, P2, P7, P8 | n/a |
| S2 | R2, R4, R7, R9, R10, R11, R15 | n/a | P1, P2, P3, P4, P5, P6, P7, P8 | n/a |
| S3 | R3, R8 | n/a | P1, P2, P3, P4 | n/a |
| S4 | R5, R6, R12, R16 | n/a | P3, P4, P5, P6, P7 | n/a |

## 13. Confidence Notes
Strongest evidence is primary/public-domain source material. Confidence is bounded by the deliberately small source pack and by deterministic extraction from 4 lanes.

## 14. Candidate Project Context
- The timeline should be synthesized as planned lunar mission, oxygen-system accident, emergency recovery, and safe return rather than as a simple binary success/failure story. Source: S1, S2, S3. (P1)
- Apollo 13 can be represented as planned lunar landing, in-flight oxygen-system accident, emergency recovery, and safe return from the checked source pack. Source: S1, S2, S3. (P2)
- The final synthesis should distinguish the proximate in-flight event from the latent hardware/process/design chain. Source: S4, S2, S3. (P3)
- The source pack supports a layered causal read: symptom record, systems consequence, and review-board root-cause frame are different evidence layers. Source: S4, S2, S3. (P4)
- Recovery success is real operational evidence, but it should not be used to soften the engineering-failure finding. Source: S2, S4. (P5)
