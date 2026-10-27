> **Cambio posterior a V4:** el fundador adoptó ramas permanentes `area/*`. Este documento se conserva íntegro como referencia histórica; prevalecen [BRANCHES](BRANCHES.md) y [ADR-002](../architecture/ADR-002-permanent-branches.md).

# OKULAR — Guía de ingeniería, stack y ramas (extracto V4)

La fuente maestra es `OKULAR-mega-prompt-maestro-v4-integral.md`. Las decisiones aquí son propuestas de ingeniería; no se han creado ramas ni archivos en GitHub.

# 62. DECISIONES DE STACK COMPLETO — FRONTEND, BACKEND, DATA, IA, MOBILE, DEVOPS

**Madurez: decisiones de arquitectura RECOMENDADAS, sujetas a validar contra runtime, costo, disponibilidad, permisos y requisitos de entrega. No equivalen a instalaciones realizadas.** Este capítulo desarrolla el capítulo 10; no impone dependencias de módulos futuros durante el MVP.

## 62.1 Principio rector: un monorepo, un core, múltiples superficies

Un único repositorio `HCHAPS404/OKULAR`; un monolito modular backend con puertos/adaptadores; web y futuras superficies consumen contratos tipados; bases y proveedores son sustituibles. Evitar microservicios, bases vectoriales, orquestadores de agentes, data lakes, colas distribuidas o K8s porque «parecen enterprise». Primero cumplir la función, después añadir la capacidad mínima requerida.

**Regla de versiones:** fijar versiones realmente instaladas mediante lockfiles; no asumir que una versión sugerida existe o es compatible. Registrar runtime LTS probado en CI y producción, no instalar la última versión por defecto sin pruebas.

### Stack aprobado para evaluar en H0 (hackathon)

| Dominio | Tecnología principal propuesta | Motivo y política de activación |
|---|---|---|
| Lenguaje web | TypeScript estricto | Tipar interfaces y validación estática. |
| Frontend | Next.js (App Router), React, Tailwind CSS | Web/PWA responsiva, despliegue simple y comunidad. |
| Componentes UI | Componentes React accesibles; Radix/shadcn/ui como opción curada | No introducir un framework visual si dificulta test/accesibilidad. |
| Iconos | Lucide React | Iconografía consistente. |
| Formularios | React Hook Form + Zod **solo si hay complejidad real** | Validar en cliente sin sustituir validación servidor. |
| Web HTTP client | `fetch` nativo + cliente tipado derivado de OpenAPI/JSON Schema | Evitar duplicar contratos; no guardar secretos en el browser. |
| Backend | Python compatible (preferencia 3.12 validada), FastAPI, Pydantic v2 | API tipada, validación y modelo de dominio desacoplado. |
| HTTP saliente | `httpx` con allowlist, límites y timeouts | Acceso controlado a verificadores; prevenir SSRF. |
| Provider AI | Meta Model API, mediante puerto `ModelPort` | Solo si modelo, cuota, privacidad y acceso están confirmados. |
| Provider fake | `FakeModelPort` determinista | CI/fixtures reproducibles y desarrollo offline. |
| Contrato | JSON Schema versionado + OpenAPI generado | Fuente única y compatibilidad web/back/SDK. |
| Persistencia de casos | Sin almacenamiento de contenido en el servidor inicialmente | Alineado con privacidad y bajo costo. |
| Datos de tests | Fixtures JSON/JSONL sintéticos, versionados | Comparación controlada y regresión. |
| Gestor Python | `uv` + `pyproject.toml` + `uv.lock` | Instalaciones rápidas reproducibles. |
| Gestor TS | `pnpm` + `pnpm-lock.yaml` | Dependencias reproducibles, posibilidad de workspaces. |
| Tests backend | `pytest` + `httpx` + fixtures; `pytest-asyncio` si se necesita | Unitarios, contrato, integración, seguridad. |
| Calidad Python | Ruff y type checking graduado (mypy o pyright, elegir uno) | Reducir fallos básicos. |
| Tests web | Vitest + Testing Library cuando haya lógica, Playwright en flujo end-to-end | Cumplir accesibilidad, estados y E2E; no forzar tests triviales. |
| Calidad TS | ESLint, TypeScript `noEmit`, Prettier | Lint, tipos, formato. |
| Automatización | GitHub Actions + Makefile | Ejecutar la misma cadena local/CI. |
| Deploy web | Vercel o alternativa que ya esté configurada | Preview por PR, producción desde `main`; revalidar límites. |
| Deploy API | Render, Fly.io u otro servicio simple **escoger uno** | Un único runtime público con HTTPS, timeouts y healthchecks. |
| Telemetría MVP | Logs estructurados minimizados + métricas técnicas | No registrar conversaciones, capturas, prompts completos ni PII. |
| Gestión de secretos | Variables server-side del proveedor/CI, `.env.example` | Nunca comitear tokens, cookies, claves ni fotos sensibles. |

### Stack diferido por necesidad real

| Capacidad futura | Solución candidata | Requisito que activa evaluación |
|---|---|---|
| Base relacional | PostgreSQL administrado (Neon, Supabase u otro, **uno**) | Casos opt-in persistentes, autenticación, tenants o auditoría real. |
| SQL/ORM | SQLAlchemy 2 + Alembic | Migrations y persistencia en Python que no cabe en código simple. |
| Almacenamiento de archivos | Object storage cifrado con TTL y borrado | Documentos opt-in temporalmente almacenados. |
| Autenticación B2C | Proveedor administrado compatible con riesgo/privacidad | Usuarios recurrentes, cuentas y borrado verificable. |
| B2B tenancy | PostgreSQL con `tenant_id` + controles de aislamiento y tests; RLS evaluado | Primer partner aprobado; no confiar solo en frontend. |
| Cola/jobs | Workers y Redis gestionado o tarea gestionada simple | Procesamientos lentos/asíncronos probados; idempotencia requerida. |
| Extensión browser | Chrome Manifest V3, TypeScript y toolkit tipo WXT **si se verifica** | MVP web estable y necesidad demostrada de captura por pestaña. |
| App móvil | React Native + Expo para UI; módulos nativos cuando permisos lo exijan | Flujo share nativo validado y pruebas con dispositivos reales. |
| Analítica privada | Métricas agregadas autoalojadas o proveedor con política compatible | Medición que no recabe contenido sensible. |
| Observabilidad | OpenTelemetry + backend de trazas apropiado con redacción | Tráfico real y diagnóstico distribuido sin contenido personal. |
| Monitor de errores | Sentry u otro con scrubber y sample rate apropiados | Errores en producción y revisión legal de datos enviados. |
| Feature flags | Configuración por entorno o flags administradas si crecen | Gradual rollout, rollback y pruebas A/B seguras. |
| Seguridad automatizada | Dependabot/Renovate, CodeQL/Semgrep, secret scanning, SBOM | CI estable y madurez de dependencias. |
| Analítica de fraude on-chain | `viem`, RPC de red, proveedor de inteligencia con términos claros | Primer pack Web3 y una comprobación verificable autorizada. |
| Email add-on/OAuth | SDK oficial y proveedor de identidad compatible | Integración consentida, scopes y revisión completados. |
| Detección local avanzada | Modelo on-device especializado/ONNX/TFLite según benchmark | Evidencia de ventaja coste-privacidad y presupuesto del dispositivo. |
| NLP/ML propios | scikit-learn o PyTorch solo tras validar dataset/objetivo | Baseline demostrado insuficiente y datos gobernados. |

**No duplicar proveedores por crédito promocional:** Meta como primario solo si cumple condiciones; Baseten/Modal/Fireworks se consideran opciones de infraestructura, no dependencias simultáneas. No enlazar dos servicios de inferencia sin evaluación de privacidad, saldos y latencia.

## 62.2 Reglas de selección de herramientas

Toda nueva herramienta debe pasar una `Technology Decision Card`:

1. Problema específico que ninguna solución actual cubre.
2. Alternativas (incluida *no añadir dependencia*).
3. Madurez/licencia/actualización y riesgo de supply chain.
4. Compatibilidad con Python/Node/CI/proveedores.
5. Costos de uso, egreso de datos, escalado y límites gratuitos.
6. Retención, entrenamiento de datos y jurisdicción del proveedor.
7. Complejidad de mantenimiento por fundador único.
8. Mecanismo de salida/exportación y pruebas de rollback.
9. Decisión `ADOPT`, `TRIAL`, `HOLD` o `REJECT` y ADR asociada.

Si faltan licencia, precio, cuotas o pruebas de integración, dejar `pending_verification`.

## 62.3 Renderizado de modelos y procesamiento multimodal

Preferir capacidades de modelo hospedado oficialmente accesibles para texto e imágenes si están disponibles; antes de aceptar PDF, vídeo o audio, definir extracción segura, tamaño, sanitización, límites de tiempo, procedencia, permisos y política de datos. No confiar en conversiones OCR silenciosas como «evidencia verificada»; OCR es extracción de texto, no comprobación del mundo.

## 62.4 Datos públicos versus personales

Datos de benchmark sintético son aptos para repositorio público si fueron creados/legalizados correctamente; archivos privados de casos no. No usar buckets públicos para uploads; firmar accesos de corta duración si se activa almacenamiento. Los secrets viven en gestores separados por ambiente y deben poder rotarse.

# 63. MONOREPO Y CONTRATOS — ORGANIZACIÓN POR RESPONSABILIDADES

## 63.1 Árbol de destino incremental

```text
OKULAR/
├── README.md
├── AGENTS.md
├── CLAUDE.md
├── .cursor/rules/
├── .github/
│   ├── workflows/ci.yml
│   ├── workflows/security.yml                  # posterior
│   ├── ISSUE_TEMPLATE/
│   └── pull_request_template.md
├── apps/
│   ├── web/                                    # NEXT.JS — H0
│   │   ├── app/
│   │   ├── features/checkpoint/
│   │   ├── features/assessment/
│   │   ├── components/
│   │   ├── lib/api/
│   │   └── tests/
│   ├── extension/                              # GUARDIAN — H1
│   │   ├── src/background/
│   │   ├── src/content/
│   │   ├── src/popup/
│   │   └── tests/
│   └── mobile/                                 # FUTURO
│       ├── app/
│       └── features/share/
├── services/
│   └── api/                                    # PYTHON/FASTAPI — H0
│       ├── pyproject.toml
│       ├── uv.lock
│       ├── okular/
│       │   ├── domain/
│       │   ├── application/
│       │   ├── adapters/inbound/
│       │   ├── adapters/outbound/
│       │   ├── packs/home/
│       │   ├── packs/identity/                  # cuando haga falta
│       │   ├── policies/
│       │   └── prompts/
│       └── tests/
│           ├── unit/
│           ├── integration/
│           ├── contracts/
│           └── security/
├── packages/
│   ├── contracts/                              # fuente JSON Schema/OpenAPI — H0
│   │   ├── assessment.v1.schema.json
│   │   ├── event.v1.schema.json                 # cuando haya timeline
│   │   └── README.md
│   ├── ts-client/                              # futuro SDK
│   └── shared-ui/                              # solo si web+extension lo requieren
├── data/
│   ├── README.md                               # gobierno, sin datos personales
│   ├── synthetic/                              # solo fixtures sin datos privados
│   ├── taxonomies/
│   ├── schemas/
│   └── source-registry/                        # metadatos permitidos
├── evals/
│   ├── fixtures/
│   ├── runner/
│   ├── metrics/
│   └── reports/                                # sin PII
├── infra/
│   ├── environments/                           # ejemplos sin secretos
│   ├── docker/                                 # si realmente se usa
│   ├── terraform/                              # posponer hasta infraestructura compleja
│   └── monitoring/                             # posterior
├── docs/
│   ├── architecture/adr/
│   ├── product/
│   ├── research/
│   ├── security/
│   ├── business/
│   ├── operations/
│   └── hackathon/
├── scripts/
├── pnpm-workspace.yaml                         # al tener >1 paquete TS
├── pnpm-lock.yaml
├── Makefile
├── .env.example
├── SECURITY.md
├── PRIVACY.md
└── .gitignore
```

**Regla de realidad:** no crear carpetas vacías para aparentar avance. El H0 mínimo solo requiere web, API, contrato, fixtures, CI y documentación operativa. La estructura restante es objetivo de crecimiento, no status confirmado.

## 63.2 Ownership lógico por área, no por microservicio

| Área lógica | Código y responsabilidad | Contrato de frontera |
|---|---|---|
| `frontend` | `apps/web/**`, pantallas, estados, UX, accesibilidad | Consume `Assessment v1`, no calcula riesgo autónomamente. |
| `extension` | `apps/extension/**`, permisos Chrome y selección de contenido | Emite `CaseEvent`; sin claves secretas. |
| `mobile` | `apps/mobile/**`, sharesheet y privacidad local | Solo contenido elegido, sin extracción clandestina. |
| `backend` | `services/api/okular/application`, HTTP, límites, seguridad y coordinación | No acoplar dominio a proveedor o frontend. |
| `domain` | `services/api/okular/domain` | Invariantes independientes del framework. |
| `ai` | `adapters/outbound/meta_model`, `prompts`, extracción estructurada | Salida no confiable validada, no decide permisos. |
| `data` | `data/`, `evals/`, contratos de evidencias y fuentes | Dataset con licencia, privacidad, procedencia y versionado. |
| `verification` | adapters de fuentes + registry | Único responsable de `EvidenceReceipt` marcado externo. |
| `security` | tests de amenazas, autorizaciones, retención, rate limits | Capacidad de bloquear features inseguras. |
| `infra` | `.github`, deploy, secrets, monitoring, costos | Sin datos sensibles en telemetría. |
| `business/product` | `docs/business`, `docs/product`, entrevistas, hipótesis | No confundir demanda con interés anecdótico. |

## 63.3 Dominio único entre frontend, API, data y packs

Fuente de verdad para comunicación: `packages/contracts/assessment.v1.schema.json`. Los modelos Python y tipos TypeScript se verifican contra el mismo contrato; cambios de campos obligatorios rompen CI cuando el consumidor no se actualiza. Versiones incompatibles requieren nueva versión, migración y pruebas.

Para un flujo Guardian posterior: `event.v1.schema.json` define evento, captura autorizada, `consent_scope`, `case_ref`, tiempo y fuente. Los packs no tienen acceso directo al DOM, credenciales, tablas ajenas ni canales de mensajería: reciben un `Case` normalizado.

## 63.4 Estrategia de datos progresiva

**H0:** request volátil, sin base con mensajes reales. Fixtures sintéticos y logs técnicos sin payload. **H1:** solo si hace falta continuidad, almacenamiento opt-in cifrado en cliente o base con TTL y borrado verificable. **H2:** PostgreSQL administrado para usuarios/tenants/casos, con migrations versionadas, roles, índices y tests de aislamiento; los uploads van a object storage privado con expiración. **H3:** inteligencia de amenazas agregada y ETL gobernado solo si existen datos legítimos, contratos y evaluación de reidentificación.

Nunca usar PostgreSQL como excusa para recolectar por defecto conversaciones o contraseñas. No cachear respuestas que contienen PII de varios usuarios en una misma key; un dashboard de métricas no debe poder reconstruir un caso privado.

## 63.5 Matriz de dependencias entre áreas

- `contracts` precede a web, API y SDK.
- `domain` y `packs` preceden a decisiones.
- `verification/source-registry` precede a afirmar «verificado».
- `auth+tenant isolation` precede a integrar datos B2B reales.
- `consent+permissions` precede a Guardian continuo.
- `harness+security` preceden a publicar claims de eficacia.
- `backend E2E` precede a expansión móvil nativa.

# 64. GIT, RAMAS Y FLUJO DE TRABAJO — ESTRATEGIA PARA UN FUNDADOR CON AGENTES

## 64.1 Estado comprobado y distinción importante

Consulta del repositorio vía GitHub el 26 de octubre de 2026: `HCHAPS404/OKULAR` existe, rama predeterminada `main`, y la búsqueda de ramas devolvió únicamente `main`; el README declara estado conceptual y no implementación funcional. **No se han creado ramas nuevas ni comiteado archivos por el solo hecho de editar este prompt.** Volver a consultar GitHub antes de ejecutar comandos.

Una **rama Git** representa una unidad temporal de cambio y un PR. Una **línea de trabajo (workstream)** representa propiedad lógica de archivos y resultados. `frontend`, `backend`, `data`, `ai`, `security`, `infra` son workstreams/etiquetas; **no deben ser ramas largas y permanentes** en un proyecto de un solo desarrollador.

## 64.2 Política elegida: GitHub Flow / trunk-based ligero

- `main`: única rama de larga duración, siempre compilable y potencialmente demostrable.
- Ramas por Issue: cortas, iniciadas desde `main`, creadas cuando haya tarea con aceptación y borradas tras squash merge.
- Un Pull Request por cambio coherente; pequeñas diffs, tests en CI, revisión humana del fundador.
- Branch protection/ruleset en `main` con checks obligatorios; impedir force push y borrado. En un único desarrollador, evitar exigir aprobación de otra persona inexistente si bloquea por completo integración; preferir tests y checklist documentado.
- No rama persistente `frontend`, `backend`, `data`, `develop`, `staging` ni una rama permanente por agente. Entornos de deploy no necesitan ramas especiales.
- Releases estables con tags (`v0.1.0`, etc.) y, si aparece necesidad real de mantener dos versiones, evaluar ramas `release/*` temporales.

## 64.3 Convención de nombres de ramas cortas

`feat/<ISSUE>-<slug>`, `fix/<ISSUE>-<slug>`, `docs/<ISSUE>-<slug>`, `test/<ISSUE>-<slug>`, `chore/<ISSUE>-<slug>`, `security/<ISSUE>-<slug>`.

Ejemplos **propuestos, no creados**:

| Trabajo | Rama temporal propuesta | Archivos principales | Gate obligatorio |
|---|---|---|---|
| Frontend / checkpoint | `feat/WEB-001-checkpoint-ui` | `apps/web/**` | lint/types, flujo Playwright cuando aplique. |
| Backend / casos | `feat/API-001-assessment-endpoint` | `services/api/**` | pytest, contrato, seguridad básica. |
| Contratos compartidos | `feat/CON-001-assessment-schema` | `packages/contracts/**` | JSON Schema y consumers compatibles. |
| AI/model adapter | `feat/AI-001-meta-model-adapter` | adapters y prompts | validación JSON, fake adapter + smoke autorizado. |
| Data / fixtures | `feat/DATA-001-synthetic-fixtures` | `data/synthetic`, `evals/fixtures` | licencia, anonimato sintético y validador. |
| Verificación | `feat/VER-001-source-receipt` | source adapter + receipts | tests fuentes/timeouts/sin verificación falsa. |
| Seguridad | `security/SEC-001-request-boundaries` | controles API/tests | SSRF, límites, injection y error semantics. |
| Infraestructura | `chore/OPS-001-ci-deploy` | `.github`, `infra`, Makefile | lint/build/test/secret scan. |
| Guardian browser | `feat/EXT-001-active-tab-check` | `apps/extension/**` | permisos `activeTab`, revocación y E2E. |
| Documentación | `docs/DOC-001-architecture-readme` | `docs/**`, README | enlaces, hechos, status confirmado. |

**No abrir todas estas ramas de antemano.** La primera actividad es Issue + contrato; crear una rama justo antes de implementar; cerrarla después de integrarla.

## 64.4 Etiquetas de Issue y tablero

**Labels:** `area:frontend`, `area:backend`, `area:domain`, `area:ai`, `area:data`, `area:verification`, `area:security`, `area:infra`, `area:extension`, `area:mobile`, `area:docs`, `area:business`, `kind:feature`, `kind:bug`, `kind:research`, `prio:p0/p1/p2`, `state:blocked`, `scope:h0/h1/h2`.

**Board:** `Backlog → Ready → In progress → Review/CI → Done`, con `Blocked` como indicador separado. Una tarea debe tener Issue ID, aceptación, dependencia, responsable (fundador/agent asistente), áreas/archivos permitidos, escenario de prueba y gate.

## 64.5 Trabajo paralelo con agentes

- Solo permitir paralelismo cuando las tareas son independientes y tienen rutas de archivo separadas. No editar a la vez el contrato ni un mismo prompt con dos agentes.
- Un único humano integra y hace merge. Los modelos proponen código; no tienen autoridad independiente para desplegar, mover dinero, conectar datos privados o cambiar reglas de seguridad.
- Usar **Git worktrees** opcionalmente si dos agentes trabajan en ramas distintas, por ejemplo:

```bash
git fetch origin
git switch main
git pull --ff-only
git switch -c feat/CON-001-assessment-schema
# una vez integrado el contrato en main:
git switch main
git pull --ff-only
git worktree add ../okular-web -b feat/WEB-001-checkpoint-ui main
git worktree add ../okular-api -b feat/API-001-assessment-endpoint main
```

Los ejemplos son instrucciones de trabajo, **no comandos ya ejecutados**. Para evitar conflictos, API y web dependen de un contrato que ya debe existir en `main` o de un stub aprobado y compatible.

## 64.6 Checklist de Pull Request

- [ ] Issue y objetivo sin ambigüedad.
- [ ] Scope y archivos cambiados corresponden al área.
- [ ] Contrato actualizado si cambió comunicación entre servicios.
- [ ] Tests locales pasaron (adjuntar comandos/resultados reales) y CI verde.
- [ ] No se añadieron datos personales, fixtures reales, secrets, tokens ni claves.
- [ ] Comprobaciones de seguridad y privacidad aplicables revisadas.
- [ ] La feature tiene estado real (`implemented`, `experimental`, `planned`).
- [ ] Si cambia modelo, prompt, política, fuente o contrato: evals/regresión.
- [ ] Demo y README ajustados cuando impacta uso.
- [ ] Merge con squash y borrar rama.

## 64.7 Política de emergencias y hotfix

Para incidente real: crear `fix/SEC-...` desde `main`, añadir test reproducible, aplicar mínimo cambio, pasar gates de seguridad, squash merge y tag si es release. Si la vulnerabilidad implica exposición inmediata, revocar credenciales o desactivar la función antes del arreglo. Ningún agente hará force push sobre `main`.

## 64.8 Qué condiciones justificarían otra estrategia

Una rama permanente por dominio solo cuando haya equipos autónomos, versionado independiente, despliegues no sincronizados y un costo de merge justificable. Con solo un desarrollador y un monorepo, genera deuda e incompatibilidades entre front/back/data; no adoptarla por estética organizacional.

# 65. CI/CD, ENTORNOS, CALIDAD, DESPLIEGUE Y RELEASE ENGINEERING

## 65.1 Matriz de entornos

| Ambiente | Fuente | Datos | Secretos | Propósito |
|---|---|---|---|---|
| `local` | rama en desarrollo | sintéticos por defecto | `.env` no comiteado | Implementar y probar sin exponer contenido. |
| `preview` | PR/pull request | exclusivamente sintéticos | credenciales de preview limitadas | Revisión visual/funcional; apagar tras merge. |
| `staging` | artifact del commit candidato | sintéticos/permitidos | secrets separados | Smoke y validación pre-release. |
| `production` | tag/commit validado desde `main` | datos reales solo con políticas completas | secrets productivos aislados | Uso público. |

No hay necesidad de ramas Git `staging` o `production`; los ambientes son configuraciones de despliegue. Staging solo se introduce si no puede usarse preview de manera segura y reproducible.

## 65.2 Pipeline mínimo por PR

1. Validar estructura, licencias y archivos prohibidos (secret scans y fixtures sensibles).
2. Instalar con lockfiles (`pnpm install --frozen-lockfile`; `uv sync --locked` en `services/api`).
3. Contratos: validar JSON Schema, generar tipos o comprobar que no difieren, tests de compatibilidad.
4. Frontend: ESLint, `tsc --noEmit`, unit tests relevantes y build Next.js.
5. Backend: Ruff, type check acordado, pytest unit/contract/security.
6. Evals: smoke determinista con `FakeModelPort`, test de evidencias y abstención.
7. E2E mínimo con Playwright sobre app con API fake o staging; no obligar modelos externos a ejecutarse en cada PR.
8. Publicar reporte de resultado sin prompts, secretos ni contenido real.
9. Si mergea a `main`, desplegar preview estable o staging y ejecutar smoke.

**Separar jobs por cambios para optimizar costo, pero en PR que toque contrato ejecutar consumidor web + API aunque solo haya cambiado un archivo.** No permitir que `continue-on-error` o `allow_failure` oculten tests de seguridad críticos.

## 65.3 Checks que protegen `main`

Se propone que `contracts`, `backend`, `frontend`, `eval-smoke` y `security-minimal` sean requeridos cuando estén implementados y estables. Para un solo fundador no configurar revisores humanos obligatorios imposibles, pero sí evitar merge sin checks y aplicar restricciones a force push/borrado. Revisar disponibilidad de rulesets/branch protection en la cuenta real.

## 65.4 Dependencias y supply chain

Usar lockfiles; no comitear artefactos binarios ni credenciales; revisar licencias; fijar acciones externas por versión estable o SHA si política lo requiere; updates dependabot/bot solo con CI; análisis de cambios mayores antes de auto-merge. Si se añade motor de extensiones, evaluar permisos y distribución antes de publicar.

## 65.5 Despliegue y reversión

- Registrar `git SHA`, entorno, build id, modelo/prompt/pack/contrato versionados, fecha, pruebas y endpoint de smoke.
- Verificar `GET /healthz` (proceso vivo) y `GET /readyz` (dependencias críticas configuradas) sin dar detalles sensibles.
- Circuit breaker para proveedor de IA y verificadores; degradar a guía manual/unknown cuando fallen.
- Rollback reproducible de código, prompts, fuentes y reglas; los reportes de evaluación no se borran para maquillar fallos.
- `feature kill switch` global o por pack para retirar rápidamente una capacidad insegura.

## 65.6 SLO/observabilidad propuesta

En MVP medir latencia p50/p95, timeouts, fallos de parseo, proporción `unknown`, errores de verificación, costos de inferencia y rechazos por rate limit. No prometer 99.9% SLA antes de operar producción. Para B2B diseñar SLO/SLA con mediciones reales, contractualización, cobertura y horarios de soporte.

## 65.7 Política de release

`v0.1.0` prototipo; `v0.2.0` guardian manual si supera gates; `v1.0.0` solo con revisión de seguridad y aceptación comercial definidas, no por cumplir una fecha. Cada release requiere changelog con `Added`, `Changed`, `Fixed`, `Security`, `Known limitations`, `Eval reference`.

# 66. GUARDIAN, SDK Y EVENTOS EN TIEMPO REAL — PLAN DE INGENIERÍA

## 66.1 Tres modos operativos explícitos

1. `CHECK_ON_DEMAND`: el usuario pega o comparte contenido y solicita análisis. MVP primero.
2. `GUARDIAN_SESSION`: autorización para inspeccionar la pestaña/sitio durante una sesión definida, con indicador visible y revocación; **futuro validado por navegador**.
3. `PARTNER_EVENT`: una plataforma integrada invoca OKULAR en eventos de riesgo de su propia aplicación, según contrato, consentimiento y finalidad; **piloto futuro**.

No llamar «monitoreo universal en tiempo real» a una web PWA. No anunciar protección continua fuera de las superficies autorizadas.

## 66.2 Event-driven, no surveillance-driven

Eventos candidatos: `page_opened`, `user_requested_check`, `payment_prompt_observed`, `new_recipient_observed`, `credential_request_observed`, `identity_claim_changed`, `permission_request_observed`, `document_uploaded_by_user`, `safety_warning_dismissed` (solo local/consentido), `session_revoked`.

Solo generar esos eventos si son legal y técnicamente observables con permisos. Aplicar debounce, deduplicación, TTL y límites de tamaño; extraer **características mínimas**, nunca snapshots completos en cada tecla. Dar prioridad a comprobaciones locales y modelos ligeros, y escalonar a modelo remoto únicamente cuando el usuario permita y la utilidad lo justifique.

## 66.3 Contrato mínimo de evento para SDK (posterior)

```json
{
  "schema_version": "case-event.v1",
  "event_id": "demo-event-0001",
  "case_id": "demo-case-001",
  "origin": "partner_app",
  "event_type": "payment_prompt_observed",
  "user_action": "considering_payment",
  "observed_at": "2026-10-26T16:00:00Z",
  "consent_scope": "payment_precheck",
  "data_classification": "minimized",
  "source_references": ["demo-ref-01"],
  "payload": {"currency": "COP", "new_recipient": true}
}
```

**Ejemplo con datos sintéticos, no API publicada.** El schema real debe añadir validación de autenticidad del emisor, idempotencia, firma/integridad cuando aplique, identificación tenant/autorización y rechazo de datos fuera de propósito. Los timestamps de ejemplo no acreditan observación real.

## 66.4 Modelo de decisión `observe → assess → verify → intervene`

`Observation` minimizada → `RiskTrigger` determinista → `ContextAssembler` de la sesión consentida → `PackRouter` → `VerificationPlanner` → `EvidenceReceipt` → `PolicyDecision` → `InterventionUI`.

La IA nunca tiene la capacidad de activar por sí sola captura de cámara, grabación, lectura de apps, mensajes de terceros, pago, cambios de permisos ni bloqueo de una cuenta. La extensión no debe construir un `fetch` arbitrario hacia cualquier URL maliciosa por orden del contenido analizado.

## 66.5 UX contra fatiga de alertas

- Alertas informativas no interrumpen tareas normales.
- Alertas importantes aparecen cerca de la acción bajo consideración, no como banners globales perpetuos.
- No repetir advertencia idéntica si no cambió la evidencia.
- Incluir «¿Qué observó?», «¿Qué no sabe?», «Verificar», «Ignorar esta advertencia», «Terminar sesión Guardian» y recurso de reporte de falso positivo.
- Si hay peligro urgente, usar protocolo del capítulo 59 sin retirar autonomía.

## 66.6 B2B partner API y seguridad

Al primer partner real: autenticación de aplicaciones server-to-server (credenciales rotables), autorización por `tenant_id`, firmas de webhooks con antirreplay/idempotencia, cuotas, aislamiento, reglas de retención por contrato, sandbox y manual de integración. La API pública nunca devolverá contenidos o evaluaciones de otro tenant por error de parámetros.

## 66.7 Entregable acotado de Guardian

Un `activeTab` click-to-analyze con un texto/enlace de ejemplo y reporte OKULAR sería una prueba honesta de integración; no demuestra monitorización continua, riesgo predictivo probado ni protección del dispositivo. La segunda etapa permite sesión voluntaria por sitio, tras revisar normativa y pruebas reales de Chrome MV3.

# 67. SEGURIDAD EMPRESARIAL, DATOS Y PRIVACIDAD OPERATIVA

## 67.1 Mapa de activos

Identificar: comunicaciones personales, documentos, URLs, nombres/entidades, registros de verificación, credenciales proveedor, claves de despliegue, tokens OAuth, tenant IDs, evaluaciones, datasets y resultados de pruebas. Asignar clasificación `public`, `internal`, `sensitive`, `highly_sensitive`, con retención, canal de almacenamiento, acceso y borrado para cada tipo.

## 67.2 Mínimo privilegio por función

`consumer`: solo su sesión/casos opt-in; `partner_app`: solo eventos de su tenant; `partner_analyst`: solamente casos permitidos por contrato; `platform_admin`: configuración sin privilegio por defecto para leer conversaciones; `security_operator`: métricas y eventos técnicos minimizados; `system_model`: sin credenciales de usuarios ni capacidades externas no necesarias.

## 67.3 Threat model por trust boundary

- Entrada usuario/terceros → API: archivos, URL maliciosa, payload gigante, prompts, PII.
- Contenido externo → modelo: prompt injection en texto, PDFs, web o imagen.
- Modelo → herramientas: parámetros falsificados o solicitudes de privilegios indebidos.
- API → proveedor externo: retención, transferencia internacional, cuotas, indisponibilidad.
- Extensión → browser: permisos excesivos, exfiltración DOM, almacenamiento inseguro.
- Partner → API: suplantación de webhook, replay, tenant confusion, secretos filtrados.
- Logs/telemetría → analytics: fuga de conversaciones, números, emails y screenshots.
- Dataset → evaluación: data poisoning, leakage entre train/test, licencias.

Controles: validación y minimización, listas permitidas, autenticación, rate limit, secretos server-side, escaneo de dependencias, request size, antivirus/sandbox de archivos cuando corresponda, neutralización de scripts HTML, pruebas con datos maliciosos sintéticos y prohibición de acciones externas sin permisos verificables.

## 67.4 Políticas de conservación y borrado

MVP sin retener casos en servidor. Futuro: ajustes con retención configurable, exportación, borrado, deadline por tipo de evidencia, revocación de consentimiento, backups con supresión planificada y política de respuesta a incidentes. Evitar que una «eliminación» en UI sobreviva inadvertidamente en logs, trazas o servicios de terceros.

## 67.5 Gobernanza y auditoría

Definir DPA/roles de responsable y encargado, política de subprocesadores, evaluación de transferencias internacionales, aviso de tratamiento, incident response y revisión de capacidades prohibidas por plataforma. La aplicabilidad legal depende del país y operación; no dar por resuelta conformidad GDPR/Colombia/sector financiero porque se nombran en documentación.

## 67.6 Prohibiciones de producto

Ningún panel público de acusaciones, ranking de personas «manipuladoras», scraping de conversaciones privadas, perfiles de vulnerabilidad psicológica, detección política para dirigir creencias, entrenamiento con mensajes no consentidos, venta de datos o instrucciones de explotación de víctimas. OKULAR trabaja sobre **riesgos observables y acciones**, nunca sobre supuestas identidades criminales inferidas por un LLM.

# 68. PORTAFOLIO DE ÉPICAS, ORDEN DE DEPENDENCIAS Y ROADMAP TÉCNICO

## 68.1 Epics concretos por capacidad

| Epic | Resultado | H0 | Depende de |
|---|---|---|---|
| `CON` | contrato `Assessment v1` y errores | Sí | definición del flujo. |
| `API` | FastAPI health + assessment | Sí | CON, domain. |
| `AI` | provider Meta/fake y JSON validado | Sí condicionado | API, acceso/terms. |
| `WEB` | checkpoint, resultado, incertidumbre, consent | Sí | CON, API. |
| `VER` | una fuente probada o guía manual clara | Sí con límites | source registry, pack. |
| `DATA` | fixtures sintéticos, normalización y gobernanza | Sí | política de etiquetas. |
| `EVAL` | regression/offline tests y resultados trazables | Sí | DATA, API, AI. |
| `SEC` | threat model, tests, hardening mínimo | Sí | interfaces de API. |
| `OPS` | CI, build, deploy, cost cap, smoke | Sí | estructura, ENV. |
| `HOME` | flujo inmobiliario completo | Sí (un escenario) | WEB, API, VER. |
| `IDENTITY` | segundo pack de demostración | Opcional | HOME y fuente legal disponible. |
| `EXT` | click-to-check Chrome | Stretch si no compromete calidad | WEB/API E2E. |
| `MOBILE` | sharing y native UI | No | experiencia y permisos. |
| `PLATFORM` | partner auth, SDK, tenant isolation | No | contratos/seguridad y demanda. |
| `WEB3` | on-chain verifier + preflight | No | partners, RPC, risk source, evals. |
| `THREAT` | campaña e indicadores compartidos | No | privacidad, alianzas, datos. |
| `OUTCOME` | experimentos/pilotos validados | Feedback mínimo | privacidad y metodología. |

## 68.2 Ruta crítica H0, siete días

`Producto/país/usuario/acción → Contrato → Backend + FakeModel → UI → Meta ModelPort con salida validada → Fuente/guía → Fixtures/Evals → Seguridad → Deploy + Demo`.

La preparación de scripts y tests puede avanzar en paralelo con UX, siempre que no se editen simultáneamente contratos sin acuerdo. **No sacrificar pruebas por añadir más packs**. La semana termina con una demostración reproducible, no con garantía de cobertura universal.

## 68.3 Plan por días con workstreams

| Día | Línea prioritaria | Entrega visible |
|---|---|---|
| 1 | `CON` + `OPS` + selección de Home | Issue board, esquema inicial, esqueleto compilable, repo status, fake adapter. |
| 2 | `API` + `AI` | health, assessment, salida estructurada real si Meta accesible. |
| 3 | `VER` + `DATA` | receipt permitido o ruta manual, fixtures críticos. |
| 4 | `WEB` + `HOME` | caso de arriendo ejecutado de extremo a extremo. |
| 5 | `EVAL` + `SEC` | regresiones, falsos positivos, adversarial y límites. |
| 6 | `OPS` + QA | preview, smoke, accesibilidad y móvil web. |
| 7 | release + demo | build log, reporte, video, README y submission kit. |

Si surge bloqueo Meta, migrar a `FakeModel` solo como demo de UX y explicitar que IA real no funciona; probar fallback únicamente cuando esté aprobado y documentado, sin afirmar cumplimiento no logrado.

## 68.4 Horizonte H1/H2/H3

- H1 (0–30 días): Guardian click-to-check y mejor verificación Home; estudio de usuarios; privacidad y feedback.
- H2 (31–90 días): primer piloto con plataforma pequeña, Identity/Commerce según demanda, auth/persistencia si está justificada, SDK beta.
- H3 (90–180 días): mobile share, mayor cobertura de fuentes, packs Finance/Work/Web3 solo si hay casos y acuerdos; primeros modelos de efectividad con datos autorizados.
- >180 días: red de campañas con evaluación de privacidad, protección proactiva por sitio/partner, colaboración en formato abierto y expansión a más países condicionada.

## 68.5 Stop criteria de ampliación

Rechazar o posponer un módulo si: no hay fuente verificable, coste supera valor medible, permiso de plataforma es inviable, falsos positivos dañan usuarios, no existe comprador/uso demostrable o requiere almacenar contenido sensible sin justificación. Pivotar por evidencia, no por complejidad acumulada del megaprompt.

# 69. OPERACIÓN FINANCIERA, LICENCIAS Y ELECCIÓN DE PROVEEDORES

## 69.1 Presupuesto auditable

Crear `docs/operations/credit-ledger.md` con `vendor`, cuenta/proyecto, modalidad, límite y saldo **confirmados en dashboard**, expiración, facturación, política de datos, consumo real, alertas, presupuesto máximo y kill switch. Los saldos promocionales de Meta, Baseten, Modal y Fireworks son desconocidos hasta consultar cada cuenta; no contarlos como efectivo disponible.

## 69.2 Costos por unidad de valor

`costo_por_análisis = tokens e inferencia + verificación externa + procesamiento de archivo + egress + hosting marginal + soporte variable + almacenamiento retención`.

`costo_por_intervención útil` requiere además medir si la advertencia ayudó; no dividir gastos entre «amenazas prevenidas» inventadas. Hacer escenarios pesimista/base/optimista solo cuando haya cotizaciones y observaciones reales.

## 69.3 Selección de SaaS

Para cada SaaS evaluar: región de procesamiento, contrato DPA, entrenamiento de contenidos, retención por defecto, eliminación, exportación, cuotas, límites de red, costo mínimo, costes de salida, observabilidad y reputación de seguridad. Prohibir usar APIs de reputación o scraping contrarias a los términos.

## 69.4 Costos de expansión móvil y B2B

Considerar costos de cuentas de publicación, validaciones de tiendas, OAuth scopes, soporte, seguros, auditorías, SDK maintenance, incident response y costos legales. El costo marginal de LLM puede ser pequeño pero no representa el costo de llevar una herramienta de seguridad a producción.

# 70. GOBERNANZA FINAL, MATRIZ DE COBERTURA Y ENTREGABLES DE IMPLEMENTACIÓN

## 70.1 Mapa de productos y líneas de ingeniería

| Producto | Interfaz | Núcleo | Datos y verificadores | Estado propuesto |
|---|---|---|---|---|
| OKULAR Personal Check | Web/PWA | Core + Home | user-selected + 1 fuente o manual | H0 MVP. |
| OKULAR Identity | Web/PWA/partners | Core + Identity | fuentes identidad autorizadas | H1/H2. |
| OKULAR Web & Guardian | Extensión permitida | Core + Web + Policy | DOM minimizado + reputación | H1. |
| OKULAR Social | Personal/partner | Core + temporal | eventos conversacionales consentidos | I+D/H2. |
| OKULAR Commerce/Work | Web/partner | Core + packs | comercios/empleadores y documentos | H2. |
| OKULAR Finance | Partner y personal | Core + finance | datos de pago preautorizados | H2/H3. |
| OKULAR Web3 | Web/wallet partner | Core + onchain | RPC + sources de riesgo | H3. |
| OKULAR Payments Fiat-Crypto | B2B | Core + integraciones | proveedor de pagos licenciado | H3+, NO movimiento de fondos propio. |
| OKULAR Response | Web/móvil | Core + guías locales | sources de reporte/contención | básico H0, profundo H1. |
| OKULAR Platform | APIs/SDK | Multi-tenant seguro | contratos y fuentes por partner | H2. |
| OKULAR Knowledge & Threat Intel | Infra | Verification + Pattern Governance | datos autorizados y evaluados | H2+, I+D. |
| OKULAR Outcome & Research | Interno | Evaluación y aprendizaje | feedback minimizado, datasets legales | H0 proceso, H2 expansión. |

## 70.2 Gate transversal de liberación

- `G0 Scope`: usuario, país, acción, situación y fuente/guía conocidos.
- `G1 Core`: API y modelo real si accesible, esquema validado, error y costos limitados.
- `G2 Evidence`: receipts correctos; herramientas permitidas; `unknown` honesto.
- `G3 UX`: experiencia end-to-end, accesible y sin alarmas excesivas.
- `G4 Trust`: threat model, privacy review, eval de fixtures y tests críticos.
- `G5 Operational`: deploy, logging seguro, rollback, runbook y demo.
- `G6 Commercial`: hipótesis de demanda contrastadas; piloto/compra no simulados.

Documentar para cada gate `status` (`not_started`, `in_progress`, `passed`, `blocked`, `failed`), evidencia, commit/URL, owner y fecha. **Los gates no se aprueban porque estén escritos en este prompt**.

## 70.3 Matriz de decisiones pendientes (no ocultar)

1. Jurisdicción inicial y fuentes disponibles para el primer caso Home.
2. API/modelo Meta y sus términos vigentes, límites y costo; disponibilidad no asumida.
3. Método mínimo de consentimiento/captura y si habrá algún tipo de almacenamiento local.
4. Hosting real y presupuesto fijado; elegir 1 proveedor por función.
5. Acceso a usuarios y validación del caso de arriendo frente a otras alternativas.
6. Licencia, marca OKULAR y riesgos de conflicto con el visor KDE.
7. Reglas oficiales de concurso y paquete obligatorio de entrega.
8. Umbrales de seguridad y límites reales medidos, no números aspiracionales.
9. Niveles de permiso y compatibilidad Android/iOS/Chrome si se habilita Guardian.
10. Controles y acuerdos antes de datos reales B2B/financieros.

## 70.4 Instrucción final para la IA desarrolladora

**Conserva las 70 secciones del megaprompt como alcance de VISIÓN y REQUISITOS; no intentes ejecutar todas simultáneamente.** Empieza comprobando GitHub, creando Issues y acordando el contrato del caso MVP, luego programa un vertical slice y añade tests y evidencia. Cuando un trabajo pertenezca a frontend, backend, data, AI o infra, identifica el workstream y crea una rama corta por Issue, no ramas permanentes por departamento. Todo cambio de contrato dispara pruebas entre consumidores. Nadie atribuye funcionalidades reales al repositorio sin commits y smoke tests verificables.

**Orden no negociable:** protección de personas → veracidad de evidencias → privacidad/autonomía → funcionamiento → medición → reducción de costo → escalado comercial. No sacrificar seguridad para hacer la demo más espectacular.

# 71. REFERENCIAS PRIMARIAS ADICIONALES PARA VALIDAR Y ACTUALIZAR

Estas referencias documentan comportamientos de herramientas o mejores prácticas, **no verifican el estado implementado de OKULAR**:

- GitHub — ramas protegidas y controles de merge: https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches
- GitHub — rulesets por repositorio: https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets
- Next.js — pruebas y Playwright: https://nextjs.org/docs/app/guides/testing y https://nextjs.org/docs/app/guides/testing/playwright
- Python uv — proyectos y lockfiles: https://docs.astral.sh/uv/guides/projects/
- Chrome — permisos mínimos de extensiones: https://developer.chrome.com/docs/extensions/develop/concepts/declare-permissions
- Chrome — uso de `activeTab`: https://developer.chrome.com/docs/extensions/get-started/tutorial/scripts-activetab
- OWASP — inyección indirecta y controles: https://cheatsheetseries.owasp.org/cheatsheets/LLM_Prompt_Injection_Prevention_Cheat_Sheet.html
- OpenTelemetry — instrumentación Python y minimización: https://opentelemetry.io/docs/languages/python/instrumentation/

Revalidar documentación y características antes de fijar dependencias en el repositorio. El término «verificado» se aplica únicamente a consultas reales, con fuente y fecha. La revisión actual de GitHub se limita a `main`, metadatos y README; no se ha realizado auditoría de código porque el README declara que aún no existe implementación.

