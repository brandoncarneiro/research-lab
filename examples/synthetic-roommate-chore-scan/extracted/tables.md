# Extracted Tables

> Synthetic example only. Counts and source IDs are fictional fixtures.

## Normalized Records

| Record ID | Category / segment | Source ID | Normalized observation | Data type | Decision relevance | Caveat |
| --- | --- | --- | --- | --- | --- | --- |
| R1 | Reminder burden | SYN-S1 | 5 of 8 fictional interview snippets mention one person having to remind others. | Synthetic coded interview note | Supports reminder-burden problem shape. | Not real prevalence. |
| R2 | Fairness confusion | SYN-S2 | 7 of 12 fictional forum-style snippets mention rotation or fairness confusion. | Synthetic coded forum snippet | Supports rotation and ownership as prototype scope. | Frustrated voices may be overrepresented. |
| R3 | Substitute weakness | SYN-S3 | Paper charts, group chats, spreadsheets, and generic task apps each have a repeated failure mode. | Synthetic substitute comparison | Shows differentiation must be sharper than "track chores." | Fictional substitute analysis. |
| R4 | Reminder tone | SYN-S4 | 6 of 10 fictional support-style complaints mention reminder fatigue or tone. | Synthetic support-style complaint | Makes reminder tone a validation question. | Complaint-style corpus is biased toward problems. |
| R5 | Non-chore household pain | SYN-S5 | Some synthetic notes center on groceries, clutter, and meal planning instead of chores. | Synthetic no-signal note | Prevents overgeneralizing the category. | Low relevance to chore-specific workflow. |

## Quantitative Signals

| Signal ID | Metric | Value | Source ID | Population / corpus | Caveat |
| --- | --- | --- | --- | --- | --- |
| Q1 | Fictional interview snippets mentioning reminder burden | 5 of 8 | SYN-S1 | Synthetic interview-note fixture | Demonstration count only. |
| Q2 | Fictional forum snippets mentioning fairness or rotation confusion | 7 of 12 | SYN-S2 | Synthetic forum-style fixture | Demonstration count only. |
| Q3 | Substitute types with at least one repeated failure mode | 4 of 5 | SYN-S3 | Synthetic substitute-comparison fixture | Demonstration count only. |
| Q4 | Fictional support-style complaints involving reminder fatigue | 6 of 10 | SYN-S4 | Synthetic complaint fixture | Demonstration count only. |

## Pattern Library

| Pattern ID | Pattern | Signal | Evidence IDs | Strength | Decision relevance | Caveat |
| --- | --- | --- | --- | --- | --- | --- |
| P1 | Chore pain clusters around fairness and follow-through. | INFERENCE | R1, R2, Q1, Q2 | Medium | Prototype should focus on ownership and rotation. | Synthetic only. |
| P2 | Substitutes decay because they need social enforcement. | INFERENCE | R3, SYN-S3 | Medium | Product value must reduce coordination work. | Needs real substitute validation. |
| P3 | Reminder tone is part of the product surface. | INFERENCE | R4, Q4, C1 | Medium | Reminder defaults should be tested carefully. | Synthetic only. |
