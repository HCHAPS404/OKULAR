[![CI](https://github.com/HCHAPS404/OKULAR/actions/workflows/ci.yml/badge.svg)](https://github.com/HCHAPS404/OKULAR/actions/workflows/ci.yml)

# OKULAR

**OKULAR is a user-controlled safety checkpoint for risky digital decisions.**

Before someone sends money, credentials, documents, or sensitive information, OKULAR helps them understand the situation, verify what can be checked, and choose a safer next step.

> **Understand. Verify. Prevent.**

## Project status

OKULAR is in **bootstrap**. The initial README preceded code. The main branch now contains a typed FastAPI API, versioned assessment contract, synthetic regression fixtures, a responsive web interface and CI configuration. This is an **offline rules demonstrator** only: no Meta inference, independent verification source, browser monitoring or production deployment has been proven. See the linked PR and build log before treating any part as complete.

This README defines the product direction and integration strategy. It does not claim that the capabilities below already work.

## The problem

Social engineering can start in a text message, email, social network, marketplace, messaging app, website, phone call, or crypto transaction. It may move across several channels before asking someone to act.

A channel-by-channel detector can miss the larger situation. OKULAR is designed to help a person make a decision in context, at the point where they are being asked to pay, share information, click, install, or grant access.

## How OKULAR should work across channels

OKULAR should not silently read every message or require the user to connect every account. The user selects the message, link, screenshot, or transaction detail they want help with. A channel adapter turns that selected input into a common case format; the OKULAR engine can then work independently of the original app.

```text
Channel → user-selected input → normalized case → OKULAR analysis
        → permitted verification → evidence and next step
```

A case can contain a user-approved timeline of events from more than one channel. For example: an investment pitch in Telegram, a link to an external site, and a request to transfer crypto. Each item keeps its source and its verification status. OKULAR must distinguish:

- **Observed:** present in the material the user supplied.
- **Externally checked:** checked through an identified, permitted source.
- **Inferred:** a possible interpretation, not a verified fact.
- **Unknown:** unavailable, unchecked, or inconclusive.

A failed lookup or missing data must remain **unknown**. It must not become proof of fraud or proof of safety.

## Integration roadmap

### Initial product: user-initiated web/PWA

Start with a responsive web experience where a user can paste text and a link, select the type of situation, and describe the action they are considering. The user presses **Analyze**; OKULAR does not monitor other apps or inboxes.

The first release should support one scenario and one jurisdiction well. Additional channels and scenarios can be added behind the same case contract.

### Next: explicit share and browser entry points

Add a share flow so a user can send selected content from a browser or mobile app to OKULAR. A browser extension may analyze the current page or link only after the user explicitly invokes it. It must not scan browsing history or page content in the background.

### Later: official, consent-based integrations

- **Telegram:** a user can forward content to an OKULAR bot or send it in a private chat with the bot. Telegram bots receive messages according to the user's interaction and the bot's permissions; group privacy mode limits which group messages are visible.
- **WhatsApp:** start with user-selected sharing to OKULAR. WhatsApp Business Platform APIs are business messaging interfaces, not a general connection to a person's private inbox. Any business-facing OKULAR bot must follow Meta's current onboarding, consent, and messaging rules.
- **Email:** prefer an add-on or flow that analyzes a message selected by the user, with the narrowest available OAuth permission. Do not ask for broad mailbox access unless a later product case and required reviews justify it.
- **SMS and calls:** consider operating-system extensions only after validating platform rules, device coverage, privacy, and the value of real-time intervention. These are separate mobile products, not a quick web integration.
- **Crypto:** begin with user-submitted network, address, URL, or transaction identifier. Later, explore wallet preflight integrations that can explain transaction risk before signing. OKULAR must never request or custody seed phrases or private keys.
- **Platforms and financial partners:** a future API/SDK can place a check inside a marketplace, bank, wallet, or other transaction flow. This requires an explicit partner agreement, defined data boundaries, and a measured pilot.

Integrations depend on the access and policies each platform actually provides. If a platform does not provide an appropriate official interface, OKULAR should use user-selected sharing or remain unavailable there; it should not scrape private accounts or rely on unofficial access.

## Product principles

1. **Intervene before an irreversible action.** Put the next safe step before lengthy explanation.
2. **Show evidence and uncertainty.** Each external check should identify its source, time, method, result, and limits.
3. **Never accuse a person.** Describe observed behavior and risk signals without declaring criminal intent.
4. **Keep the user in control.** No silent monitoring, hidden collection, automatic reporting, payment blocking, or messaging on the user's behalf.
5. **Minimize data.** Process only what is needed for the requested case; default to no server-side conversation history.
6. **Treat supplied content as untrusted.** Instructions inside an analyzed message cannot change OKULAR's rules or permissions.
7. **Localize advice.** Verification and recovery steps depend on country, channel, and scenario.

## Intended differentiation

OKULAR's potential distinction is a **portable, evidence-based decision workflow**, not merely AI classification:

1. Understand the request and the action it is trying to produce.
2. Connect selected events into a user-approved timeline across channels.
3. Show what was checked, what was inferred, and what remains unknown.
4. Offer a concrete next step for the user's scenario and location.
5. If the user already acted, provide a separate, locally reviewed incident-response path.

These are hypotheses to build and test, not proven advantages. Scam analyzers and platform-native protections already exist; OKULAR must demonstrate that its evidence and next-step workflow helps people decide better than those alternatives.

## Initial technical direction

- **Web:** Next.js, React, TypeScript, responsive PWA.
- **API:** Python, FastAPI, Pydantic.
- **AI:** Meta Model API as the planned primary model provider, subject to account access and terms.
- **Architecture:** modular monolith with hexagonal boundaries (ports and adapters), so channel, model, verification, and future storage adapters remain replaceable.
- **Contracts:** versioned JSON Schema shared by API and web.
- **Persistence:** none for the first vertical slice unless a tested user need requires it.
- **Verification:** fixed, allowlisted tools with explicit receipts; no arbitrary URL fetching by a model.
- **Testing:** synthetic cases, offline provider stub in CI, contract tests, security tests, and a versioned evaluation harness.

## First release scope

The first release should be a single end-to-end vertical slice:

1. A user submits a selected text/link and chooses the situation.
2. OKULAR extracts the request, action, pressure, and missing information into a validated structure.
3. A permitted verifier checks one specific fact, or the interface provides a manual verification checklist and clearly says no external check was performed.
4. The assessment separates evidence, inference, and unknowns.
5. The user sees practical next steps and the limits of the result.

Native mobile apps, continuous monitoring, all-channel inbox access, account history, social reporting, and broad multi-country coverage are out of scope until the first flow passes usability, safety, and source-coverage tests.

## Development status and contribution

The repository began with an initial README. The bootstrap foundation was merged through [PR #1](https://github.com/HCHAPS404/OKULAR/pull/1). It includes web/API scaffold, schema, health endpoints, CI and synthetic fixtures. GitHub CI passed on the merge commit; model inference, independent verification and public deployment remain unimplemented.

Every feature must be described as implemented only after its acceptance criteria and checks have been demonstrated. Report model/provider failures and missing verification sources honestly.

## References for platform constraints

- [Telegram Bot FAQ](https://core.telegram.org/bots/faq)
- [WhatsApp Business Platform terms](https://www.whatsapp.com/legal/meta-terms-whatsapp-business)
- [Gmail API OAuth scopes](https://developers.google.com/workspace/gmail/api/auth/scopes)
- [Apple SMS/MMS message filtering](https://developer.apple.com/documentation/identitylookup/sms-and-mms-message-filtering)
- [Android SMS role](https://developer.android.com/reference/android/app/role/RoleManager)
- [Next.js PWA guide](https://nextjs.org/docs/app/guides/progressive-web-apps)
- [Meta Model API documentation](https://dev.meta.ai/docs/overview)

## License

To be selected and documented before publishing implementation code.


## Developer foundation (main)

See [documentation index](docs/README.md), [full OKULAR V4 vision](docs/master/OKULAR-mega-prompt-maestro-v4-integral.md), [branch workflow](docs/engineering/BRANCHES.md), [workstream ownership](docs/engineering/WORKSTREAMS.md), and [runbook](docs/operations/runbook.md).

\`\`\`bash
cp .env.example apps/web/.env.local
make bootstrap
# terminal A
make api
# terminal B
make web
# checks
make test
make eval
make lint
make build
\`\`\`

Current API includes \`GET /healthz\`, \`GET /readyz\`, \`GET /v1/capabilities\` and \`POST /v1/assessments\`. The endpoint provides **synthetic/offline rule-based guidance**; \`external_checks\` is empty until a real verifier is implemented. No model was connected or benchmarked merely by committing these files.

**Engineering policy:** only \`main\` is stable; create short-lived issue-scoped branches, not permanent departmental \`frontend\`/\`backend\`/\`data\` branches. See [BRANCHES](docs/engineering/BRANCHES.md).
