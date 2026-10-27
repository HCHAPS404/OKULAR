# OKULAR — Workstreams y stack asignados a ramas permanentes

El fundador es responsable de todas las áreas; los agentes de IA colaboran. Cada rama \`area/*\` permanece en GitHub después de integrar a \`main\`. No se considera funcional un módulo por tener su rama creada.

| Rama | Responsabilidad | Rutas | Issue |
|---|---|---|---|
| `area/frontend` | Web y UI/UX | apps/web | `WEB` |
| `area/backend` | API y dominio | services/api | `API` |
| `area/contracts` | Esquemas y contratos | packages/contracts | `CON` |
| `area/data` | Datos y fixtures | data, evals/fixtures | `DATA` |
| `area/ai` | Modelos, prompts e inferencia | services/api/okular/adapters/outbound, evals | `AI` |
| `area/verification` | Fuentes y evidencia verificable | services/api/okular/adapters/outbound | `VER` |
| `area/security` | Ciberseguridad, privacidad y abuso | docs/security, SECURITY.md, PRIVACY.md | `SEC` |
| `area/infrastructure` | CI/CD, hosting, entorno, dependencias | Makefile, .github, docs/operations | `OPS` |
| `area/guardian` | Extensión y navegación consentida | apps/extension (futuro) | `EXT` |
| `area/mobile` | Apps móviles y compartir | apps/mobile (futuro) | `MOB` |
| `area/platform` | API y SDK B2B | packages/ts-client (futuro) | `PLAT` |
| `area/qa` | Pruebas integradas, casos adversariales | services/api/tests, evals, tests/e2e | `QA` |
| `area/documentation` | README, guías, ADR y prompts | docs, README.md, AGENTS.md | `DOC` |
| `area/research` | Investigación, mercado, negocio | docs/business, docs/research | `BUS` |

## Herramientas y gates por especialidad

- **Frontend:** Next.js 15, React 19, TypeScript, Tailwind, ESLint; build, typecheck, usabilidad y E2E en \`area/frontend\`.
- **Backend:** Python/FastAPI/Pydantic, pytest y seguridad de API en \`area/backend\`.
- **Contratos:** JSON Schema/OpenAPI y compatibilidad entre TS/Python en \`area/contracts\`.
- **Data:** datos sintéticos, procedencia, etiquetas y retención en \`area/data\`. Sin conversaciones reales por defecto.
- **IA:** proveedor Meta condicionado a acceso y condiciones verificados, adaptadores y evaluación en \`area/ai\`; no suponer modelo ya integrado.
- **Verificación:** fuentes oficiales/autorizadas, receipts tipados, fechas, límites y fallos \`unknown\` en \`area/verification\`.
- **Seguridad:** OWASP, abuso de API, SSRF, inyección, privacidad y respuesta a incidentes en \`area/security\`.
- **Infraestructura:** GitHub Actions, uv/pnpm/lockfiles, configuración y deploy con controles en \`area/infrastructure\`.
- **Guardian:** Manifest V3 y análisis por intervención autorizada en \`area/guardian\`. Nada de monitorización oculta.
- **Móvil:** capacidades nativas, Expo/React Native y permisos oficiales en \`area/mobile\`.
- **Plataforma:** API/SDK B2B con autenticación, tenancy y cuotas en \`area/platform\`.
- **QA:** Pytest, Playwright, tests contractuales/adversariales, regresiones y falsos positivos en \`area/qa\`.
- **Documentación:** contratos, ADR, normas de agentes y roadmap en \`area/documentation\`.
- **Investigación:** pruebas con usuarios consentidos, análisis de mercado, validación comercial y riesgos legales en \`area/research\`.

Los cambios de una área pueden afectar rutas de otras: debe haber Issue, revisión del contrato y coordinación. Los cambios compartidos pueden originarse en el área más adecuada, pero no escribirse en paralelo sin acuerdo. Las ramas permanentes no crean automáticamente un monorepo multicapa: éste ya existe y cada rama representa una línea de trabajo.

## Definición de terminado

El PR para \`main\` debe presentar diff completo, estado de contratos, tests documentados, CI verde, límites y privacidad, costo/latencia cuando aplique, aprobación del fundador, y criterio de rollback. No mezclar funciones a medio terminar. Después del merge, mantener y actualizar la rama.
