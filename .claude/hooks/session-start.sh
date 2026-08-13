#!/bin/bash
# Démarrage d'une session Claude Code sur le web : installe de quoi faire
# tourner `npm test`. Le conteneur est mis en cache une fois ce script terminé,
# si bien que les sessions suivantes repartent avec node_modules déjà là.
#
# Idempotent, non interactif, sans effet en local.
set -euo pipefail

# Rien à faire hors d'un environnement distant : en local, les dépendances
# sont celles de la machine de l'auteur.
if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

cd "$CLAUDE_PROJECT_DIR"

# `npm install` plutôt que `npm ci` : il ne repart pas de zéro quand le cache du
# conteneur a déjà servi, là où `ci` efface node_modules à chaque fois.
npm install --no-audit --no-fund

# Les six suites tournent sous jsdom, qui lit les fichiers de `app/` sur le
# disque ; le gardien et ESLint les suivent dans `npm test`. Rien d'autre à
# préparer : pas de build, pas de service, pas de base.
