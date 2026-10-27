# Assessment contract

The versioned response in \`assessment.v1.schema.json\` is the shared API/Web contract. Source of truth for responses returned by \`POST /v1/assessments\`.

- Version: \`1.0\`; changes to field shape require a new schema and compatibility review.
- \`observed_signals\` are rules applied to supplied text. They are not external confirmations.
- \`external_checks\` remains empty until a real allowlisted verifier creates evidence receipts.
- \`engine_mode=offline_rules_demo\` is explicit; this is NOT Meta model inference or reliable fraud classification.
- Never interpret \`unknown\` as a safe verdict.
- Consumer contract tests validate responses against this schema.
