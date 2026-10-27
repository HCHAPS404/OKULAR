# Evaluation policy

Synthetic regression fixtures are intentionally tiny. They test deterministic code behavior, NOT model quality or real-world efficacy.

Run: \`PYTHONPATH=services/api python evals/run_evals.py\`.

Before making detection claims: collect authorized labeled cases, compare static and contextual baselines, measure false positives / false negatives / abstentions per situation, create train/eval separation by campaign, and document harms. See the V4 master document and \`docs/security/threat-model.md\`.
