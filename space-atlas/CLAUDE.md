# space-atlas

Deux projets spatiaux liés par les NORAD IDs : `globe/` (globe pédagogique des orbites) et `observatory/` (écosystème spatial européen). Contrat de données partagé dans `data-contract/`.

## État

**Phase de recherche : documentation uniquement, aucun code.** Voir `README.md` et `docs/roadmap.md`.

## Règles

- Ne pas écrire de code avant que `docs/research/cesium-vs-threejs.md` contienne une décision.
- Tout fait technique (quota, licence, format, API, NORAD ID) est marqué « à vérifier à la source », avec source et date. Ne jamais l'inventer.
- Chaque entreprise de la shortlist exige 3 sources. Pas de logos de marques sans vérification des conditions d'usage.
- Textes en français. Pas de comptes utilisateurs, pas d'IA, pas de backend lourd avant une v1 avec utilisateurs.
- Une étape qui déborde perd des fonctions au lieu de prendre du retard. Si la 3D bloque, passer à la 2D ou à un rendu simple.
- Toute décision se note dans `docs/decisions.md` (date, décision, raison). Les tâches se suivent dans `docs/roadmap.md`.
- La phase de recherche est menée par l'utilisateur : ne pas remplir `docs/research/` à sa place avec des faits non vérifiés.
- `docs/prompts/brainstorm-passion.md` et `docs/synthese.md` (section 4.2) contiennent des informations personnelles (âge, employeur) : ne pas les citer dans un document destiné à être public, et les retirer ou les réduire avant de rendre le dépôt public.
- Plus tard : stack TypeScript, npm, un `package.json` par projet, comme le reste du dépôt.
