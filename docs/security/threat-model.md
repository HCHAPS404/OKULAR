# OKULAR Threat Model — H0

Status: initial design review, **not independent security audit**.

## Protected assets
Submitted contextual text, user consent, API availability, future tokens/sessions, external evidence provenance, decision integrity. The initial backend does **not** store cases in a database.

## Trust boundaries
1. Browser -> API: untrusted text and user-selected values; input length 10–6000, Pydantic \`extra=forbid\`, explicit consent. Avoid body logging.
2. API -> analysis: text is data, never system instructions. Current rules engine makes no tool calls and no network requests.
3. API -> future external verifier/model: disabled pending allowlist, SSRF defense, timeouts, bounded responses, data terms, receipts and human review.
4. API -> browser: \`unknown\` and \`limitations\` explicit; no absolute fraud/safe labels.
5. Public repo -> CI/CD: never store real secrets, uploads, samples or private case transcripts.

## Main threats and mitigations
- Prompt injection in messages: no executable tools in H0; future model output must be strict JSON, validated and unable to set receipts.
- Malicious URL / SSRF: no general outbound fetching; future tools allowlist and deny internal/loopback/link-local, enforce DNS redirects/timeouts/bytes.
- Sensitive data submitted: warnings/minimization, no persistence; explicit limitations that upstream hosting/network may process traffic.
- Abuse / denial of service: request body limits and rate limits **not yet implemented**; DO NOT expose unrestricted public endpoint with real provider key.
- False positives, false negatives, overtrust: limited qualitative categories, repeat warnings and unknowns, synthetic evals; independent user evaluations pending.
- Targeted harassment: no public reputation score, no accusations, no auto-report or autonomous external actions.
- Credential leak: no secret in NEXT_PUBLIC variables and no credentials in repository. Rotate any exposed key immediately.
- Dependency compromise: CI and dependency audits planned, no claim of certification.

## Open security gates
Authorization/quota for any public deployment, source-verifier allowlist, content upload scanning, privacy policy/legal basis by jurisdiction, incident-response contact, accessibility and independent security review.
