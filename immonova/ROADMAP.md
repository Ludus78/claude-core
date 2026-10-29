# Roadmap immonova (immonova2.0)

Tâches tirées de l'état réel du dépôt (octobre 2026). La commande `/next immonova` prend la première tâche non cochée **sans** la mention « validation requise ».

## Phase 0 : clarifier l'existant

- [x] Documenter les routes API dans `immonova2.0/docs/api.md` : `auth`, `chat`, `contact`, `leads`, `market-rates`, `news`, `seed-news`, `simulations`, `web-search` (lecture du code, aucune modification de l'application) (2026-10-29)
- [ ] Décider de l'authentification : `next-auth` ou Kinde (décision de ta part, validation requise)
- [ ] Supprimer les doublons de configuration : `next.config.js` / `.mjs`, `next-sitemap.config.js` / `.cjs`, `app/globals.css.save` (validation requise : suppression)
- [ ] Décider si le hook Husky doit lancer un build complet à chaque commit (validation requise)
- [ ] Ajouter un script de test et les premiers tests (validation requise : nouvelle dépendance)

## Phase 1 : produit

À définir par toi (nouveaux calculateurs, contenu, acquisition…). La revue hebdomadaire propose des pistes, à valider.

## Légende

`- [ ]` à faire · `- [x]` fait (date et pull request notées en fin de ligne par `/next`).
