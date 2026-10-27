# Development and operations runbook

## Prerequisites
Python 3.11+ (CI uses 3.12); uv; Node 22; pnpm 9. No model API account necessary for the **offline demonstrator**. Check local availability before commands.

## Local start
1. Clone repo and \`cd OKULAR\`.
2. \`cp .env.example apps/web/.env.local\` (sample environment contains no secrets).
3. \`make bootstrap\` (uv + pnpm dependencies; requires internet). No lockfiles are committed yet; generate and commit \`uv.lock\` and \`pnpm-lock.yaml\` once versions are resolved and CI green.
4. Terminal A: \`make api\` (http://127.0.0.1:8000).
5. Terminal B: \`make web\` (http://localhost:3000).
6. Submit a synthetic example only. CORS defaults to http://localhost:3000.

## API smoke
\`curl http://127.0.0.1:8000/healthz\`

\`curl http://127.0.0.1:8000/v1/capabilities\`

Request example:
\`\`\`bash
curl -X POST http://127.0.0.1:8000/v1/assessments \
  -H 'Content-Type: application/json' \
  -d '{"scenario":"home","action_under_consideration":"pay","text":"Pagar el anticipo hoy, sin avisar a nadie.","consent":true}'
\`\`\`

Expected: \`engine_mode=offline_rules_demo\`, empty \`external_checks\`, explicit \`unknowns\`. This does not imply real model inference.

## Tests
\`make test\`; \`make eval\`; \`make lint\`; \`make build\`. CI mirrors them. If package/registry access is unavailable, do not claim npm/uv runs completed.

## Deployment (not performed)
- Frontend: choose one managed Next.js provider, root directory \`apps/web\`; set \`NEXT_PUBLIC_OKULAR_API_BASE_URL\` to an actual trusted HTTPS endpoint.
- API: choose one Python hosting provider, working directory \`services/api\`; install app dependencies, ASGI command \`uvicorn okular.main:app --host 0.0.0.0 --port $PORT\`.
- Set \`OKULAR_CORS_ORIGINS\` to exact HTTPS frontend domain(s); no wildcard with credentials.
- Configure request size caps, rate limits, auth/quotas and safety review *before* publicizing. No public rollout until privacy/security gates are met.
- Secrets on hosting only; never in \`NEXT_PUBLIC_*\`, logs, README or CI artifacts.
- Post-deploy: health/ready/capabilities, synthetic API assessment, smoke UI, check logs for PII and errors.
- Rollback: revert offending PR, redeploy last known-good commit, disable provider/verification feature; document incident.

## Production readiness blockers
No deploy URL, no real Meta adapter, no verified source, no lockfiles, no public auth/rate limit, no tenancy, no independent user safety evaluation. These are intentional explicit blockers, not hidden incomplete work.
