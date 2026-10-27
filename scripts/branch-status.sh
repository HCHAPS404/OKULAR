#!/usr/bin/env bash
# Comprueba ahead/behind de ramas area/*; solo lectura de estado Git.
set -euo pipefail
git fetch origin --prune
printf '%-26s %12s %12s\n' 'RAMA' 'DETRAS main' 'DELANTE main'
while IFS= read -r ref; do
  branch="${ref#refs/remotes/origin/}"
  counts="$(git rev-list --left-right --count "origin/main...$ref")"
  read -r behind ahead <<< "$counts"
  printf '%-26s %12s %12s\n' "$branch" "$behind" "$ahead"
done < <(git for-each-ref --format='%(refname)' refs/remotes/origin/area/)
