# OKULAR — Política oficial de ramas permanentes

**Estado: activa (decisión del fundador, 26-10-2026).** Especificación técnica: [ADR-002](../architecture/ADR-002-permanent-branches.md). Este documento prevalece sobre las instrucciones históricas de ramas cortas en V4, que se conservan por trazabilidad.

## Política

- `main` es la única rama de integración estable: recibe exclusivamente cambios revisados y con CI aprobado.
- Existen **14 ramas permanentes por área `area/*`**, creadas desde la misma base de `main`. Se usan para desarrollar cada parte del monorepo.
- Las ramas permanentes **nunca se eliminan al fusionar**. Después de mergear en `main` se actualizan con la nueva historia.
- Existen ramas auxiliares opcionales `task/<area>/<issue>` para aislar trabajos incompletos simultáneos; no sustituyen las ramas `area/*`.
- Una rama Git contiene todo el repositorio, no solamente una carpeta. La tabla define responsabilidades, no aislamiento automático.
- La existencia de una rama **no significa** que el módulo esté desarrollado, desplegado o validado.

## Registro de ramas

| Rama permanente | Responsabilidad | Directorios primarios | Issues |
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

Se mantienen por separado los dominios del código y los Situation Packs: Home, Identity, Web, Social, Work, Commerce, Finance, Web3 y Response no necesitan una rama exclusiva para existir; se desarrollan a través de `area/backend`, `area/frontend`, `area/ai`, `area/verification` y `area/data`.

## Flujo cuando un área está lista para integrar

1. Abrir/seleccionar Issue con dueño, criterios de aceptación, rutas y riesgos.
2. Trabajar y hacer commits en la rama `area/<dominio>`; no tocar `main` directamente.
3. La rama del área puede conservar trabajo en progreso, pero **el PR solamente se abre si todos los cambios que aparezcan en su diff están terminados**. Para varios trabajos incompletos, crear `task/<dominio>/<issue>` y fusionarlos al área cuando estén listos.
4. Sincronizar con `main` antes de PR; revisar y resolver conflictos, ejecutar API, evaluación, seguridad, lint, build y pruebas pertinentes.
5. Abrir PR `area/<dominio> → main`. Revisar cambios, consentimientos, contratos, citas verificables, pruebas reales y límites.
6. Usar **merge commit (Create a merge commit)** en vez de squash/rebase por defecto, para conservar el linaje de la rama permanente. Un PR verde no equivale a autorización para desplegar a usuarios.
7. **No borrar la rama**. Una vez integrado el PR, actualizar la rama desde el nuevo `main`: normalmente fast-forward.
8. Actualizar las demás ramas de área desde `main` antes de empezar tareas nuevas o abrir PRs; nunca forzar pushes ni resetear commits ajenos.
9. Permisos y protecciones GitHub (Rulesets, bloquear force-push/borrado, exigir PR/checks) deben configurarse y verificarse por el propietario; este documento **no afirma** que ya estén activados.
10. Para ramas permanentes, desactivar en la configuración del repositorio la opción **Automatically delete head branches**, si está habilitada.

## Comandos para una rama permanente

Primera vez:

```bash
git clone https://github.com/HCHAPS404/OKULAR.git
cd OKULAR
git fetch origin
git switch --track origin/area/frontend
# trabajar, probar y registrar commits
git push origin area/frontend
```

Después de un PR **ya fusionado mediante merge commit**:

```bash
git fetch origin
git switch area/frontend
git merge --ff-only origin/main
git push origin area/frontend
```

Cuando `--ff-only` falle, hay commits propios sin integrar o divergencia. No usar `reset --hard`. Revisar historia y resolver un `git merge origin/main` seguro, comprobando todos los archivos y ejecutando pruebas. El script `scripts/sync-area.sh` facilita ese flujo, sin forzar pushes y sin empujar por sí solo.

**Las ramas no se fusionan directamente entre áreas** en ausencia de acuerdo sobre contratos. El orden recomendado: `area/contracts` → `main` → actualización de `area/backend` y `area/frontend`; después `area/data` + `area/ai` + `area/qa`; verificaciones y seguridad; finalmente producto integrado.

## Colaboración humano y agentes

- Una persona/agente responsable por Issue/ruta a la vez; no modificar el mismo esquema de dos sesiones paralelas.
- Cursor/Claude/GPT reciben rama, Issue, paths, contrato, pruebas y límites. Informan commit, pruebas realmente ejecutadas y bloqueos.
- Ningún agente fuerza pushes, borra ramas, fusiona cambios incompletos ni despliega sin autorización pertinente.
- `main` se mantiene verificable; todas las ramas deben conservar disciplina de calidad aunque existan permanentemente.

## CI

`push` en `main` y `area/**`, todos los PR y `workflow_dispatch` activan jobs web/API. Reglas de `main` y `area/*` son configuración de GitHub adicional, pendiente de comprobar.

## Historial

Las ramas anteriores `chore/BOOT-001-foundation-monorepo` y `docs/DOC-001-bootstrap-status` pertenecen al bootstrap ya integrado: son históricas, no ramas de área. Las 14 `area/*` permanecen incluso cuando todavía no se ha programado su primer módulo.

Para roadmap y herramientas por dominio: [WORKSTREAMS](WORKSTREAMS.md), [ADR-002](../architecture/ADR-002-permanent-branches.md).
