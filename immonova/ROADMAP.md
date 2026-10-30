# Roadmap immonova (immonova2.0)

Tâches tirées de l'état réel du dépôt (octobre 2026). La commande `/next immonova` prend la première tâche non cochée **sans** la mention « validation requise ».

## Phase 0 : clarifier l'existant

- [x] Documenter les routes API dans `immonova2.0/docs/api.md` : `auth`, `chat`, `contact`, `leads`, `market-rates`, `news`, `seed-news`, `simulations`, `web-search` (lecture du code, aucune modification de l'application) (2026-10-29)
- [x] Décider de l'authentification : Kinde retenu, `next-auth` à retirer plus tard (2026-10-30)
- [x] Supprimer `next-sitemap.config.js` et `app/globals.css.save` (inutilisés) (2026-10-30)
- [ ] Fusionner `next.config.js` et `next.config.mjs` (le `.mjs` porte la config Sentry, probablement ignorée) (validation requise)
- [ ] Migrer `src/app/api/real-estate/route.ts` de `next-auth` vers Kinde, puis retirer `next-auth` (validation requise : dépendance)
- [x] Hook Husky : on garde le build complet à chaque commit (2026-10-30)
- [ ] Ajouter un script de test et les premiers tests (validation requise : nouvelle dépendance)

## Phase 1 : produit

À définir par toi (nouveaux calculateurs, contenu, acquisition…). La revue hebdomadaire propose des pistes, à valider.

## Légende

`- [ ]` à faire · `- [x]` fait (date et pull request notées en fin de ligne par `/next`).
