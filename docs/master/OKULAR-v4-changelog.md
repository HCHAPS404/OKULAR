# OKULAR V4 — Registro de ampliación y verificación

**26 de octubre de 2026** · Cambio exclusivamente documental.

## Qué quedó preservado

La totalidad de la V3 se encuentra íntegra en V4, incluida su introducción histórica, sus 55 capítulos, conflictos documentados, cronograma y criterios de aceptación. Ninguna funcionalidad es marcada implementada por su aparición en el prompt.

## Qué se añadió

- Capítulos 56–61: fuentes, inteligencia adaptativa, outcomes, seguridad humana de alto riesgo, gobierno de datasets y permisos por plataforma.
- Capítulos 62–71: decisiones de stack completo y herramientas condicionales, monorepo, workstreams, GitHub Flow con ramas cortas, CI/CD, Guardian/SDK, multi-tenancy, roadmap, costos, gates y fuentes.
- Guía separada con los capítulos 62–71 para usar como referencia de arquitectura y organización de ingeniería.

## Hechos externos verificados en este trabajo

- Conexión a GitHub: repositorio `HCHAPS404/OKULAR`, predeterminada `main`, búsqueda de ramas: `main`; README describe fase conceptual.
- Fuentes oficiales de GitHub, Next.js, uv, Chrome, OWASP y OpenTelemetry consultadas para fundamentar recomendaciones.

## Lo que NO se ha hecho

- No se han creado ramas, Issues, archivos, commits o pull requests en GitHub.
- No se han implementado frontend, backend, dataset, evaluación, API de Meta ni despliegues.
- No se han comprobado créditos, saldos, planes contratados, condiciones regulatorias o resultados de benchmark del producto.

## Decisiones arquitectónicas propuestas

- Branching: `main` única permanente; `feat/fix/docs/test/chore/security` por Issue, con labels de área, CI y squash merge.
- Stack H0: Next.js/React/TypeScript/Tailwind, Python/FastAPI/Pydantic, Meta ModelPort (condicionado a acceso), JSON Schema/OpenAPI, Vitest/Playwright/pytest/Ruff, pnpm/uv, GitHub Actions, Vercel y un servicio simple API.
- Datos: sin persistencia de conversaciones para H0; PostgreSQL administrado solo al necesitar estado persistente con base legal, límites de retención y aislamiento.
- Guardian y mobile: posteriores al núcleo E2E salvo prueba mínima controlada por clic.

## Verificación editorial automatizada

- Se conservaron exactamente los capítulos originales de V3.
- Se encontraron los capítulos numerados 1–71 una sola vez.
- El archivo contiene un marcador de inicio y un marcador de fin del prompt.
