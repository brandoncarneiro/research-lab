# Extracted Findings: Apollo 13 oxygen tank failure: source-bounded incident review

Run: `run_e398be625787c92a`

## Records

| Record ID | Lane | Finding | Source IDs |
| --- | --- | --- | --- |
| R1 | timeline-reconciliation | The pre-mission press kit supports that Apollo 13 was planned as a lunar-landing mission. Source: S1. Confidence: high. | S1 |
| R2 | timeline-reconciliation | The mission report excerpt supports that Apollo 13 was aborted after abrupt service-module oxygen loss associated with one oxygen tank at about 56 hours into flight. Source: S2. Confidence: high. | S2 |
| R3 | timeline-reconciliation | The transcript excerpt supports treating air-to-ground communications as the in-the-moment symptom record, not the later root-cause determination. Source: S3. Confidence: medium-high. | S3 |
| R4 | timeline-reconciliation | The mission report excerpt supports that the crew returned safely to Earth on April 17, 1970. Source: S2. Confidence: high. | S2 |
| R5 | failure-chain | The review-board excerpt supports that the accident chain centered on service module oxygen tank 2. Source: S4. Confidence: high. | S4 |
| R6 | failure-chain | The review-board excerpt supports framing the accident as a combination of mistakes and an unforgiving design rather than a random isolated malfunction. Source: S4. Confidence: medium-high. | S4 |
| R7 | failure-chain | The mission-report excerpt supports that oxygen loss reduced command/service module electrical power, oxygen, and water capability. Source: S2. Confidence: high. | S2 |
| R8 | failure-chain | The transcript excerpt supports that voice communications record symptoms and operator awareness around the accident window, not the full later engineering cause. Source: S3. Confidence: medium-high. | S3 |
| R9 | operational-recovery | The mission-report excerpt supports that oxygen loss reduced command/service module power, oxygen, and water capability. Source: S2. Confidence: high. | S2 |
| R10 | operational-recovery | The mission-report excerpt supports that the lunar module became central to survival and recovery after the service module failure. Source: S2. Confidence: high. | S2 |
| R11 | operational-recovery | The mission-report excerpt supports that the crew returned safely to Earth on April 17, 1970. Source: S2. Confidence: high. | S2 |
| R12 | operational-recovery | The review-board excerpt supports that corrective redesign and recertification followed for later Apollo missions. Source: S4. Confidence: medium-high. | S4 |
| R13 | mission-objective-counterevidence | The press-kit excerpt supports that Apollo 13 was planned as a lunar-landing mission. Source: S1. Confidence: high. | S1 |
| R14 | mission-objective-counterevidence | The press-kit excerpt supports using the pre-mission document as planned-objective evidence, not actual-outcome evidence. Source: S1. Confidence: high. | S1 |
| R15 | mission-objective-counterevidence | The mission-report excerpt supports that Apollo 13 was aborted after service-module oxygen loss. Source: S2. Confidence: high. | S2 |
| R16 | mission-objective-counterevidence | The review-board excerpt supports that the post-accident record led to corrective action for later missions. Source: S4. Confidence: medium-high. | S4 |

## Patterns

| Pattern ID | Lane | Pattern | Source IDs |
| --- | --- | --- | --- |
| P1 | timeline-reconciliation | The timeline should be synthesized as planned lunar mission, oxygen-system accident, emergency recovery, and safe return rather than as a simple binary success/failure story. Source: S1, S2, S3. | S1, S2, S3 |
| P2 | timeline-reconciliation | Apollo 13 can be represented as planned lunar landing, in-flight oxygen-system accident, emergency recovery, and safe return from the checked source pack. Source: S1, S2, S3. | S1, S2, S3 |
| P3 | failure-chain | The final synthesis should distinguish the proximate in-flight event from the latent hardware/process/design chain. Source: S4, S2, S3. | S4, S2, S3 |
| P4 | failure-chain | The source pack supports a layered causal read: symptom record, systems consequence, and review-board root-cause frame are different evidence layers. Source: S4, S2, S3. | S4, S2, S3 |
| P5 | operational-recovery | Recovery success is real operational evidence, but it should not be used to soften the engineering-failure finding. Source: S2, S4. | S2, S4 |
| P6 | operational-recovery | The source pack supports both emergency recovery success and a need for corrective action after the accident. Source: S2, S4. | S2, S4 |
| P7 | mission-objective-counterevidence | Apollo 13 is better described in this run as a failed lunar-landing objective plus a successful crew-return operation, not as an uncomplicated success. Source: S1, S2, S4. | S1, S2, S4 |
| P8 | mission-objective-counterevidence | The checked sources support planned lunar-landing intent and actual mission abort as separate, conflicting evidence layers. Source: S1, S2. | S1, S2 |

## Lane Limits

### Timeline reconciliation

- It does not prove the full console-level operational timeline. Source: S3.

### Failure chain

- It does not independently reproduce the full tank engineering analysis. Source: S4.

### Operational recovery

- It does not prove that every recovery procedure was captured in this checked example. Source: S3.

### Mission objective counterevidence

- It does not quantify every planned scientific objective lost after the abort. Source: S1.
