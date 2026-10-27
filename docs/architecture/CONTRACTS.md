# API contract and version control

Source: \`packages/contracts/assessment.v1.schema.json\`.

Current endpoints:
- GET \`/healthz\` (liveness)
- GET \`/readyz\` (readiness, offline mode)
- GET \`/v1/capabilities\` (truthful features flag)
- POST \`/v1/assessments\` (bounded text, action, scenario, explicit consent)

\`assessment_id\` is a randomly generated request identifier, **not** a stored case record.

Semantics: \`observed_signals\` = lexically observed in user-authorized input; \`external_checks\` = empty until a real allowlisted verifier returns receipts; \`inferences\` = unverified interpretation; \`unknowns\` = missing. The client must not display unknown as safe. Changing \`risk_level\` enum or request shape requires explicit migration/contract review.

Later: share entry points and signed partner events need distinct schemas, authorization, idempotency, replay defenses, quotas and tenancy isolation.
