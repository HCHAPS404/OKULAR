# OKULAR hackathon build log

## Confirmed GitHub activity — 2026-10-26 (America/Bogota)

- Initial `main` inspected: README only at commit `884e9c6bc8f5e0ac82108f94e474898688cc3519`.
- Created `chore/BOOT-001-foundation-monorepo`; staged preserved V4 master text (71 chapters), engineering guide, changelog, runnable offline API + responsive Next.js web, shared contract, synthetic fixtures, CI, privacy/security/docs.
- [Pull request #1](https://github.com/HCHAPS404/OKULAR/pull/1) reviewed with GitHub checks and squash-merged.
- Merge commit on `main`: `095a3da9a68e17b9e7883eeb2b45e06a7d0873fd`.
- Locked installs: `services/api/uv.lock` and root `pnpm-lock.yaml` committed.
- [CI run on main](https://github.com/HCHAPS404/OKULAR/actions/runs/40434422506): backend and web jobs **passed**.
- CI API: 5 tests passed (1 upstream deprecation warning in dependency), 4/4 deterministic synthetic fixtures passed, Python lint passed.
- CI Web: dependency install, TypeScript typecheck, ESLint and production build passed.
- Open issues [#2–#10](https://github.com/HCHAPS404/OKULAR/issues) track contract, frontend, Meta model, data, verification, security, operations, Guardian and business validation.

## Boundaries (do not claim completed)
- Meta Model API inference has **not** been integrated or successfully exercised.
- External rental/identity verification has **not** been implemented.
- No real-world efficacy or independent users were evaluated.
- No hosted public release, browser monitoring, mobile app, B2B API tenancy, bank/crypto integration or production readiness.
- Current engine explicitly labels itself `offline_rules_demo`, never a verified fraud classifier.

## Next executable tasks
- Confirm model credentials/terms with synthetic test (#4), choose legal source/jurisdiction (#6), improve holdout dataset (#5), rate limit before public deployment (#7), and evaluate product usefulness with users (#10).
- Future implementation PRs link issue, change, actual tests, limits and user-impact risk. CI passing is necessary but not proof of production safety.

This log supersedes earlier provisional descriptions in the archived V4 text; preserve that master document intact for historical context.

- 2026-10-26: por decisión del fundador se adopta ADR-002: 14 ramas permanentes `area/*`, sincronizadas desde `main` y preservadas tras cada PR. El workflow valida pushes en `area/**`. El inventario debe verificarse en GitHub después de crearlas.
