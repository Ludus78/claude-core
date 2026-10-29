# Roadmap Confio

Tâches tirées de l'état réel du dépôt (octobre 2026). La commande `/next Confio` prend la première tâche non cochée **sans** la mention « validation requise ».

## Phase 0 : fiabiliser l'existant

- [ ] Écrire les tests de `src/detection/signals/auth.ts`
- [ ] Écrire les tests de `src/detection/signals/sender.ts`
- [ ] Écrire les tests de `src/detection/signals/urgency.ts`
- [ ] Écrire les tests de `src/gmail/headers.ts`
- [ ] Écrire les tests de `src/gmail/client.ts` (client simulé, jamais de vraie boîte Gmail)
- [ ] Ajouter un script `lint` à `package.json` (validation requise : nouvelle dépendance)
- [ ] Renommer `claudetest.md` en fichier TypeScript, ou le supprimer (validation requise : il contient du TypeScript)
- [ ] Identifier le fichier `sersestechestestoile` et le renommer ou le supprimer (validation requise)

## Phase 1 : produit

À définir par toi (publication de l'extension, nouveaux signaux de détection, autres messageries…). La revue hebdomadaire propose des pistes, à valider.

## Légende

`- [ ]` à faire · `- [x]` fait (date et pull request notées en fin de ligne par `/next`).
