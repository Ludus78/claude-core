# Journal des décisions

Une entrée par décision : quoi, pourquoi. **Ajouter une entrée à chaque nouvelle décision**, avec la date.

Les décisions D1 à D17 viennent de [`synthese.md`](synthese.md) (rédigée le 2026-10-29) : leur date d'origine n'est pas connue. Les faits techniques cités sont à vérifier à la source.

## Produit

| # | Décision | Raison |
|---|---|---|
| D1 | Deux modules reliés (globe + observatoire), développés séparément puis fusionnés (M9-11) | Chacun reste livrable seul |
| D2 | La narration passe avant la donnée brute | Un globe de satellites existe déjà ailleurs (satvis, KeepTrack, Stuff in Space) : la différence vient des explications et des histoires |
| D3 | Observatoire petit et curé à la main : environ 30 fiches, pas de scraping, date de mise à jour et sources sur chaque fiche | Les données vieillissent vite : peu de fiches, mais soignées |
| D4 | Corrections par pull request, fiches versionnées dans le dépôt | Maintenance communautaire sans backend |
| D5 | Hors périmètre en v1 : comptes utilisateurs, IA, backend lourd, base de données | Rester petit tant qu'il n'y a pas d'utilisateurs |

## Stack envisagée

| # | Décision | Raison |
|---|---|---|
| D6 | Next.js + TypeScript | Cohérent avec le reste du dépôt (immonova2.0) |
| D7 | CesiumJS **ou** Three.js : **à trancher** après recherche (`research/cesium-vs-threejs.md`) | Licences et performances à comparer |
| D8 | satellite.js (propagation SGP4 dans le navigateur) | Les positions sont calculées, pas stockées |
| D9 | Données orbitales CelesTrak (GP/OMM de préférence, TLE en secours), avec cache serveur obligatoire (route API Next.js), jamais d'appel direct depuis le navigateur | Respecter la politique d'usage (à vérifier à la source) |
| D10 | Lancements : Launch Library 2, avec cache et environnement de test | Limites des requêtes anonymes (à vérifier à la source) |
| D11 | Stockage de l'observatoire : fichiers JSON ou YAML + schéma de validation | Pas de base de données |

## Pilotage

| # | Décision | Raison |
|---|---|---|
| D12 | Une étape qui déborde perd des fonctions au lieu de prendre du retard | Tenir les 12 mois |
| D13 | Un mois creux pendant les examens du MBA | Réalisme |
| D14 | Commencer petit : ISS + quelques constellations (20 à 500 objets), à partir d'un template existant | Éviter de tout construire |
| D15 | 2D ou rendu simple d'abord si la 3D bloque | Piège n°1 : perdre 2 à 3 mois sur la configuration 3D |
| D16 | Un post public par jalon, pas plus | La visibilité est un bonus, pas le but |
| D17 | Bilan à M12 : continuer, pivoter ou s'arrêter avec un projet fini. Si la motivation flanche à M6, pivoter en réutilisant le moteur | Garder une sortie honnête |

L'objectif de recrutement dans le spatial a été **retiré** de ce projet : il est mené par passion.

## Idées écartées ou mises en réserve

- **MissionScope** (planning de contacts satellite / stations sol) : trop « outil métier » pour un projet passion. En réserve, éventuel « acte 2 ».
- **Tableau de bord d'actualités et de financements** : trop de collecte de données, risque de corvée.
- **Station de réception DIY (RTL-SDR)** : peu de motivation.
- **Pistes en réserve** : simulateur de durée de vie orbitale et de rentrée atmosphérique, jeu « design ton orbite », explorateur d'exoplanètes (NASA Exoplanet Archive), « zoomeur » du système solaire à l'échelle.

## Décisions d'intégration au dépôt (2026-10-29)

| # | Décision | Raison |
|---|---|---|
| D18 | Dossier parent `space-atlas/` avec `globe/` et `observatory/` (la synthèse prévoyait `apps/globe` et `apps/observatory`) | Un dossier = un projet indépendant dans ce dépôt. Le dossier `apps/` sera reconsidéré au démarrage du code (M1) |
| D19 | Schéma partagé dans `data-contract/` (la synthèse prévoyait `data/schema/`) | Dossier déjà en place et référencé dans les README |
| D20 | Emplacement des fiches (`data/companies/` dans la synthèse) : **à décider** | Aucune fiche n'existe encore |
| D21 | Noms de fichiers de recherche conservés : `company-shortlist.md` et `story-ideas.md` (la synthèse écrit `companies-shortlist.md` et `stories-ideas.md`) | Les liens existent déjà |
| D22 | Aucun squelette de code avant le choix Cesium ou Three.js | Le squelette dépend de ce choix |
| D23 | `.github/` (CI, modèles de pull request pour les corrections de fiches) reporté à l'observatoire (M6) | Il sortirait de `space-atlas/` : à la racine du dépôt |
| D24 | Textes en français, nom « space-atlas » provisoire | Le nom définitif reste à choisir |
