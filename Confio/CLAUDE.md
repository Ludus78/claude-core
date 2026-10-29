# Confio

Extension Chrome qui signale les mails Gmail suspects pour des utilisateurs non techniques.

## Stack

TypeScript (ESM), Vite + `@crxjs/vite-plugin`, Vitest, `googleapis`. Gestionnaire : npm.

## Commandes (depuis `Confio/`)

- `npm run dev` : serveur de dev de l'extension
- `npm run build` : `tsc --noEmit && vite build`
- `npm test` : Vitest
- `npm run test:inbox` : lance le script sur une **vraie boîte Gmail**. Ne jamais l'exécuter sans demande explicite.

## Structure

- `src/gmail/` : client Gmail, parsing des messages et en-têtes
- `src/detection/` : signaux (`signals/` : lien, expéditeur, urgence, authentification) et `riskScorer.ts`
- `src/popup/`, `src/background/`, `src/auth/` : interface, service worker, identité

## Règles

- Toute modification d'un signal ou du scoring s'accompagne d'un test Vitest (`*.test.ts` voisin).
- Aucun contenu de vrai mail, token OAuth ni clé privée dans le dépôt.
- Réponses courtes, code direct, pas de fonctionnalité non demandée (voir `.github/copilot-instructions.md`).

## À clarifier avant d'y toucher

- `claudetest.md` contient du code TypeScript (extension probablement erronée).
- `sersestechestestoile` : fichier au nom inexpliqué.
