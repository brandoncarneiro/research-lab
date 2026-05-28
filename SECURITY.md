# Security

Do not report secrets, credentials, private source documents, account exports, generated research outputs, or sensitive exploit details in a public issue.

## Reporting A Vulnerability

Use GitHub private vulnerability reporting for this repository:

<https://github.com/sommbc/research-lab/security/advisories/new>

Include:

- affected files, scripts, prompts, or docs
- steps to reproduce or a minimal synthetic example
- impact and who could be affected
- whether any token, credential, private URL, private source, or generated research output may be exposed
- suggested remediation, if known

If the private report form is unavailable, do not disclose sensitive details publicly. Open a minimal public issue that says a private security contact is needed, without including exploit details, secrets, URLs, account identifiers, or private data.

## Public Issues

Use public issues only for non-sensitive documentation, packaging, or workflow problems.

- Do not paste tokens, API keys, private URLs, raw datasets, account identifiers, private documents, or generated research outputs.
- If you discover committed sensitive material, stop and use the private vulnerability report path above.

## Research Boundary

Default research runs must not mutate production accounts or external systems. Do not use billing tools, production databases, deployment systems, posting/sending tools, private account actions, or access-control bypasses unless a run brief explicitly scopes an approved, documented process.

## Supported Versions

Security fixes target the default branch until versioned releases exist.
