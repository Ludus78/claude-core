# Hub de pilotage

Ce dossier est le poste de pilotage de tous les projets de `claude-core`. Il ne contient pas de code d'application.

## Contenu

- `PROJETS.md` : registre des projets (statut, état, reste à faire, prochaine action).
- `.claude/commands/status.md` (à la racine du dépôt) : commande `/status`.

## Comment tenir `PROJETS.md` à jour

- Les faits viennent de git (`git log -1 --format=%cs -- <dossier>`, `git status`) et des fichiers du projet, jamais de suppositions.
- Une information déduite et non vérifiée est notée « à confirmer ».
- Les champs inconnus restent « à renseigner » : ne rien inventer.
- Après une session de travail sur un projet, mettre à jour sa section et la date en tête de fichier.
- Les statuts possibles : `idée`, `étude`, `en cours`, `pause`.

## Règles

- Lecture seule sur les projets : le hub ne modifie que `_hub/`.
- `PROJETS.md` se modifie sur une branche `feat/...` avec une pull request, comme le reste (voir le `CLAUDE.md` racine).
- Réponses courtes.
