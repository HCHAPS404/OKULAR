# ADR-002 — Ramas permanentes por área de trabajo

**Estado:** aceptado por decisión expresa del fundador, 2026-10-26.
**Sustituye:** únicamente la política Git de ramas cortas descrita en ADR-001 y documentos V4 históricos. No cambia las decisiones de seguridad, arquitectura hexagonal, alcance o datos.

## Contexto y razón

El fundador desea disponer desde ahora de ramas visibles para frontend, backend, data, IA y todo el stack, conservar la historia de cada línea de desarrollo y fusionar trabajo pulido en main sin olvidar áreas pendientes.

## Decisión

Crear 14 ramas permanentes `area/*`, todas desde `main`, una por dominio, mantener `main` estable, exigir PR y CI, fusionar **con merge commit**, actualizar las ramas del área después. Nunca borrar ramas `area/*` automáticamente.

## Consecuencias

Beneficios: organización por área, continuidad, asignación de tareas a agentes, espacios preparados para el futuro.

Riesgos: ramas divergentes, PRs grandes, código a medio terminar, conflictos en contratos. Mitigaciones: integrar cambios pequeños y completos, mantener ramas sincronizadas, aislar trabajo simultáneo inacabado en ramas auxiliares, no permitir cambios concurrentes del contrato, CI sobre las ramas, no hacer force push.

## Fuentes de verdad

Lista de ramas y comandos: [BRANCHES.md](../engineering/BRANCHES.md). Stack y ownership: [WORKSTREAMS.md](../engineering/WORKSTREAMS.md). El megaprompt V4 íntegro se preserva; los detalles Git antiguos se consideran superados por esta ADR.

## Protección pendiente

Las reglas de GitHub contra borrado/force-push y la exigencia de revisiones requieren configuración en la cuenta. La creación de ramas y CI no equivalen a que las Rulesets ya estén habilitadas.
