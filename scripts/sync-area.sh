#!/usr/bin/env bash
# Sincronizar main en una rama permanente sin force-push. El push es manual.
set -euo pipefail
branch="${1:-}"
case "$branch" in
  area/frontend|area/backend|area/contracts|area/data|area/ai|area/verification|area/security|area/infrastructure|area/guardian|area/mobile|area/platform|area/qa|area/documentation|area/research) ;;
  *) echo "Uso: bash scripts/sync-area.sh area/<dominio>" >&2; exit 2 ;;
esac
if [[ -n "$(git status --porcelain)" ]]; then
  echo "Working tree con cambios sin registrar. Haz commit/stash antes." >&2
  exit 1
fi
git fetch origin main "$branch"
if git show-ref --verify --quiet "refs/heads/$branch"; then
  git switch "$branch"
else
  git switch --track "origin/$branch"
fi
echo "Fusionando origin/main en $branch; si hay conflictos, resuélvelos, ejecuta pruebas y revisa el resultado."
git merge origin/main
echo "Sincronización local lista. Después de probar, ejecuta: git push origin $branch"
