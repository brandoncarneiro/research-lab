# Apollo 13 Oxygen Tank Review

## Project

**Project name:** Research Lab public example

**Project profile path:** `profiles/example/PROFILE.md`

**Decision owner / audience:** AI builder evaluating whether Research Lab is a real runnable research tool

**Durable context destination:** checked-in example output

## Research Title

Apollo 13 oxygen tank failure: source-bounded incident review

## Date

1970 source record, reconstructed as a local runtime example

## Run Slug

`examples/apollo-13-oxygen-tank-review/`

## One-Line Decision

This research exists to decide whether a small filesystem-first runner can preserve primary-source evidence, contradiction handling, runtime state, and final artifact contracts without pretending to be an autonomous agent framework.

## Core Research Question

What does the checked public-domain Apollo 13 source pack support about the oxygen tank failure, mission abort, recovery decisions, and limits of the evidence?

## Decision Gates

| Gate | Question | Evidence needed | Pass / fail / unclear standard |
| --- | --- | --- | --- |
| Runtime credibility | Does the run produce real manifests, logs, metrics, validation, and artifacts? | `run.json`, lane manifests, JSONL logs, metrics, validation report | Pass when `npm run example:run` completes with validation passed |
| Evidence discipline | Are claims tied to source IDs and confidence limits? | Raw lanes and final digest cite source IDs | Pass when validation finds no unknown evidence references |
| Anti-overclaim | Are contradictions and negative evidence preserved? | Contradiction and negative-evidence rows in raw lanes and digest | Pass when final artifacts include C# and N# records |

## Source Context To Read First

- `source-pack/README.md`
- `source-pack/sources.json`
- `source-pack/S1-review-board-report-excerpts.md`
- `source-pack/S2-mission-report-excerpts.md`
- `source-pack/S3-air-ground-transcript-excerpts.md`
- `source-pack/S4-press-kit-excerpts.md`

The source pack is a checked local excerpt ledger that points to public NASA/NTRS sources. It is not a replacement for the original full documents.

## Scope

Include:

- Mission: Apollo 13 only
- Topic: oxygen tank failure, immediate mission impact, recovery constraints, and planned-vs-actual mission objective
- Source types: NASA report, NASA mission report, NASA air-to-ground transcript, NASA press kit
- Output: bounded incident review, not a full Apollo program history

## Out Of Scope

Exclude:

- Full NASA risk-culture history
- Full engineering reconstruction beyond the cited source pack
- Claims about every Apollo risk-control process
- Cinematic, memoir, or secondary retellings
- New web collection during example execution

## Evidence Lanes

| Lane | Mission | Lane question | Target sources | Required output file | Evidence threshold |
| --- | --- | --- | --- | --- | --- |
| Timeline reconciliation | Reconcile planned mission, accident timing, crew report, and recovery endpoint | What sequence does the source pack support? | S2 mission report, S3 transcript, S4 press kit | `raw/timeline-reconciliation.md` | At least three dated or mission-elapsed-time facts |
| Failure chain | Separate observed trigger from latent failure chain | What does the source pack support about immediate symptoms versus root cause? | S1 review board, S2 mission report | `raw/failure-chain.md` | At least three cited causal facts and one contradiction |
| Operational recovery | Extract recovery constraints and actions without turning success into root-cause absolution | What operational moves made crew return plausible? | S2 mission report, S3 transcript | `raw/operational-recovery.md` | At least three cited recovery facts and one negative-evidence limit |
| Mission objective counterevidence | Compare planned lunar mission with actual abort/recovery outcome | What did the mission cease to prove after the oxygen failure? | S4 press kit, S1 review board, S2 mission report | `raw/mission-objective-counterevidence.md` | At least two planned-objective facts and one actual-outcome contradiction |

## Target Sources

### Primary Sources

- NASA, `Report of Apollo 13 Review Board`
- NASA, `Apollo 13 Mission Report`
- NASA/NTRS, `Apollo 13 Technical Air-To-Ground Voice Transcription`
- NASA, `Apollo 13 Press Kit`

### Sources To Avoid Or Treat Carefully

- Secondary retrospectives: useful for discovery only, excluded from this checked example
- Popular quotes: excluded unless present in the checked source pack

## Tool Menu

This example uses local file execution only. The runner must not perform live web collection, private-account access, paid extraction, sending, posting, deployment, or external mutation.

Approved exceptions for this run:

- None

## Research Budgets

- Maximum lanes: 4
- Maximum concurrent lanes: 2
- Maximum runtime expectation: under 10 seconds on a local development machine
- Stop if a required source-pack excerpt is missing.

## Required Raw Outputs

- `raw/timeline-reconciliation.md`
- `raw/failure-chain.md`
- `raw/operational-recovery.md`
- `raw/mission-objective-counterevidence.md`

## Required Extracted Outputs

- `extracted/findings.md`
- `extracted/contradictions.md`
- `extracted/tables.md`
- `extracted/open-questions.md`

## Required Final Outputs

- `output/RAW_DATA_DIGEST.md`
- `output/CEO_BRIEF.md`
- `output/PROJECT_CONTEXT.md`

## Citation Rules

Every factual claim must carry a lane-local Source ID in raw artifacts. Final artifacts must reference IDs defined in `RAW_DATA_DIGEST.md`.

## Stop Conditions

Stop when each lane either completes from the checked source pack or records an explicit blocker. Do not compensate for missing source excerpts with confident prose.
