# Roadmap Confio

Tâches tirées de l'état réel du dépôt (octobre 2026). La commande `/next Confio` prend la première tâche non cochée **sans** la mention « validation requise ».

## Phase 0 : fiabiliser l'existant

- [x] Écrire les tests de `src/detection/signals/auth.ts` (2026-10-29)
- [x] Écrire les tests de `src/detection/signals/sender.ts` (2026-10-29)
- [x] Écrire les tests de `src/detection/signals/urgency.ts` (2026-10-29)
- [x] Écrire les tests de `src/gmail/headers.ts` (2026-10-30)
- [x] Écrire les tests de `src/gmail/client.ts` (client simulé, jamais de vraie boîte Gmail) (2026-10-30)
- [x] Ajouter un script `lint` : abandonné, `typescript-eslint` 8.72.1 refuse TypeScript 7 (erreur « does not support TS 7.0 », 2 essais). `tsc --noEmit` du build sert de contrôle ; à reprendre quand `typescript-eslint` supportera TS 7 (à vérifier à la source) (2026-11-04)
- [x] `claudetest.md` supprimé : ancien script de rejeu du scoring qui importait un `./scoring` inexistant, récupérable dans l'historique git (2026-11-04)
- [x] `sersestechestestoile` supprimé : ancienne copie de `src/gmail/headers.ts`, accents corrompus, sans les correctifs récents, récupérable dans l'historique git (2026-11-04)

## Phase 1 : produit

À définir par toi (publication de l'extension, nouveaux signaux de détection, autres messageries…). La revue hebdomadaire propose des pistes, à valider.

## Légende

`- [ ]` à faire · `- [x]` fait (date et pull request notées en fin de ligne par `/next`).
