# OKULAR H0 — First executable product

## User / scenario / job
Initial candidate: Spanish-speaking user evaluating an advance payment for a rental property (jurisdiction/source to validate). User shares only text explicitly chosen, selects the proposed action, then receives an **explainable checkpoint**. A second \`identity\` scenario is present only as a limited guidance mode.

## Current executable slice
Browser form -> POST assessment -> offline deterministic rules -> visible signals, unknowns, next steps and limitations. No verification source, AI model, file upload, browser extension, database, user account or mobile app is yet implemented. Never market the baseline as production-grade fraud detection.

## Acceptance criteria
- An authorized, bounded request yields a versioned response with no fabricated external checks.
- Unauthorized or malformed requests fail with 422. Unknown remains unknown.
- Cases containing payment pressure are surfaced only as **signals**, not declarations of wrongdoing.
- Real/ambiguous controls do not get \`safe\` verdicts.
- API schema and UI types stay compatible.
- API and UI errors do not expose secrets or claim verification.
- Manual testing on mobile viewport and screenreader keyboard basics before public demos.

## Next build increments
1. Validate real Meta model credentials, retention/price and add a gated adapter; compare it against deterministic baseline.
2. One real, legally allowed, source-independent verification with evidence receipt; otherwise explicitly guide a manual check.
3. UI evidentiary distinctions and localization of vetted guidance.
4. Optional selected-tab Guardian entry point only after browser permissions and threat model review.

## Non-goals
Crawling private conversations, universal identity checks, monitoring device history, custody of crypto, real transactions, accusations or recovery guarantees.
