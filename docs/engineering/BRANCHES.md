# Git branches — how every OKULAR discipline works

## Verified starting point
On 2026-10-26 only \`main\` existed on GitHub, containing the product README. The bootstrap branch \`chore/BOOT-001-foundation-monorepo\` was merged into \`main\` through PR #1 after green CI. The branch may remain temporarily as history. The workstream names below are **conventions and examples, not pre-existing branches**.

## Primary rule: GitHub Flow
\`main\` = reviewed, demo-capable branch. **No permanent \`frontend\`, \`backend\`, \`data\`, \`dev\` or \`develop\`**. A one-person startup benefits from short-lived isolated work per issue instead of long-lived branches that drift. Agents may work in separate git worktrees but never write the same contract files concurrently.

## Prefixes by workstream

| Workstream | Branch example | Owned scope | Acceptance / primary tests |
|---|---|---|---|
| Foundation | \`chore/BOOT-001-foundation-monorepo\` | repo docs/config | smoke + CI |
| Contracts | \`feat/CON-001-assessment-schema\` | packages/contracts | consumer schema/API tests |
| Frontend | \`feat/WEB-001-checkpoint-ui\` | apps/web | build, typecheck, keyboard checks |
| Backend | \`feat/API-001-assessment-endpoint\` | services/api | pytest + security |
| Model / AI | \`feat/AI-001-meta-adapter\` | outbound/model/evals | real synthetic smoke + benchmark |
| Data / Evals | \`feat/DATA-001-eval-fixtures\` | data, evals | tests, provenance, no PII |
| Verification | \`feat/VER-001-evidence-receipts\` | verifier registry/adapters | allowlist, provenance, timeout |
| Security | \`security/SEC-001-ssrf-guards\` | policies/security tests | exploit regression |
| Infrastructure | \`chore/OPS-001-ci-deploy\` | .github, infra, config | CI, deployment smoke |
| Browser Guardian | \`feat/EXT-001-selected-tab\` | apps/extension | minimal permissions, opt-in |
| Mobile | \`feat/MOB-001-share-entry\` | apps/mobile | permission/device checks |
| Documentation | \`docs/DOC-001-playbooks\` | docs | links/accuracy review |
| Fixes | \`fix/API-002-consent-validation\` | scoped bug | reproduction regression |
| Release | \`release/0.1.0-rc1\` | optional only when needed | release gate |

## Ordering: what depends on what?
Contract -> API baseline -> web UI -> contract tests -> evaluator -> external verifier -> Meta AI adapter -> Guardian/SDK. Work can overlap only when stable contracts exist. Data packs depend on valid source/locale; business claims depend on observed evals and user research. Do not spin up all branches in advance.

## One task / one branch / one PR
1. Create Issue with description, risks, files, owner, dependencies and acceptance.
2. \`git switch main && git pull --ff-only\`
3. \`git switch -c feat/WEB-002-<short-name>\` (choose actual Issue ID)
4. Make smallest coherent change, test \`make test\`, \`make eval\`, \`make lint\` as applicable.
5. \`git push -u origin <branch>\`, open PR targeting \`main\`.
6. Review diff, CI, privacy and change to contracts; squash merge; delete merged branch.
7. Sync local \`main\`; stop/rebase other branches if the contract changed.

## Agent coordination
One writer per issue/file. If two agents must build frontend and backend in parallel, finalize and merge contract first. Handoffs must list: issue, branch/SHA, touched files, commands *actually* run, evidence, missing tests, risks, owner. Founder's approval is required for public deploy, data collection, external actions and merges.

## Protection and emergency
Recommend PR review/check requirements on \`main\` where plan/settings allow; rulesets were NOT configured by this bootstrap. No force-push to main. A hotfix is a short \`fix/*\` branch off current main, with test and PR. A revert is safer than silent history rewriting.

## Practical git worktrees (optional)
\`git worktree add ../okular-web -b feat/WEB-001-checkpoint-ui main\`; another branch/worktree for API after contract merge. Do not assume worktrees enforce shared database isolation; avoid concurrent dependencies/lockfile changes.
