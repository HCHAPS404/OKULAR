# Workstreams, owners, stack, tasks and deliverables

**Solo founder** is accountable for all workstreams; AI tools are assistants, not separate project owners or reviewers. Keep one issue per deliverable and merge through main.

| Area | Code/docs | Stack | Bootstrap deliverable | Next tasks | Gate |
|---|---|---|---|---|---|
| Product | docs/product | Markdown, experiments | MVP + pack matrix | user tests and country/source selection | clear job/action |
| Frontend | apps/web | Next.js 15, React 19, TS, Tailwind 4 | text checkpoint UI | accessibility, responsive QA, receipts UI | build/types/E2E |
| Backend | services/api | Python 3.11+, FastAPI, Pydantic 2 | endpoints + offline rules | external verification, errors, quotas | pytest + contract |
| Domain/contracts | packages/contracts | JSON Schema v2020-12 | assessment response v1 | versioned request schema/codegen | cross-app tests |
| Data | data | synthetic JSON, registry metadata | no personal data | source policy, annotations, dataset splits | provenance/privacy |
| AI/ML | services/api/adapters, evals | replaceable model provider | *offline only* baseline | Meta adapter after verified access, calibrated eval | benchmark/safety |
| Verification | services/api/adapters | allowlisted HTTP source adapters | none yet | independent receipt, country sources | verifiable provenance |
| Security | docs/security + API tests | threat model, OWASP, CI | boundaries, consent | SSRF limits/rate limits/adversarial | no severe failure |
| Infra/DevOps | .github, Makefile, hosting | GitHub Actions, uv, pnpm | CI workflow and runbook | pinned lockfiles, environments, preview deploy | green CI + smoke |
| Browser Guardian | apps/extension (future) | Manifest V3, TS | not started | selected-tab click-to-analyze | permission review |
| Mobile | apps/mobile (future) | Expo/RN | not started | share intent and privacy UX | native device QA |
| Platform B2B | packages/ts-client (future) | OpenAPI, auth, quotas | not started | tenant-scoped pilot APIs | partner contract |
| Business | docs/business | interviews, unit economics | assumptions documented | validate first buyer, costs, legal/IP | evidence of demand |

## Interface contracts
- Browser talks only to documented versioned API.
- API owns validation, safety policy, verification semantics and response.
- Domain does not depend on Next.js or provider SDK.
- Data ingestion cannot collect content without purpose and permission.
- The first external verification must have source, time, method, receipt ID and failure semantics before being shown as "checked".
- Every feature that uses a model must declare provider, model, prompt version, latency, token cost, failure behavior and evaluation results.

## Entry criteria for a new workstream
Business case, permission/legal basis, bounded interface, synthetic test path, error handling, cost/time ceiling, acceptance and rollback plan.

## Definition of Done
Implementation is committed; local/CI tests are reported truthfully; known limits documented; no PII/secrets or false claims; contracts compatible; UI understandable; PR accepted. Folder names alone do NOT count.
