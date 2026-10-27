# Security policy

OKULAR is an early **non-production** safety prototype, not a certified fraud-detection service. Do not submit secrets, sensitive financial data or private documents. Please avoid publishing exploit details involving real users.

For vulnerabilities, use GitHub's **private vulnerability reporting** only if enabled for this repository; otherwise contact the repository owner through an established private channel. No private contact address is published here.

Current guardrails: bounded input, required consent, no external side-effects, no server case database, explicit \`unknown\`. Current gaps: authentication/abuse quotas, adversarial pen test, encrypted retained cases (not present), real model/vendor and source review. Refer to [threat model](docs/security/threat-model.md).
