# space-atlas

> Nom de travail provisoire.

Deux projets personnels autour du spatial, faits par passion et pour apprendre (3D, mécanique orbitale, données satellites). L'objectif : des résultats visuels et partageables, compréhensibles par un non-expert en quelques secondes.

**Statut : phase de recherche.** Aucun code fonctionnel pour l'instant, uniquement de la documentation.

## Les deux projets

| Projet | Dossier | En une phrase |
|---|---|---|
| Globe pédagogique des orbites | [`globe/`](globe/README.md) | Un globe 3D interactif qui montre des satellites en mouvement et explique pourquoi chaque orbite existe |
| Observatoire de l'écosystème spatial européen | [`observatory/`](observatory/README.md) | Une base d'acteurs du spatial européen curée à la main, avec fiches, carte et filtres |

## Le lien entre les deux

Chaque satellite possède un identifiant de catalogue (NORAD ID). En stockant ces identifiants dans les fiches de l'observatoire :

- un clic sur une entreprise affiche ses objets sur le globe ;
- un clic sur un satellite renvoie vers la fiche de son opérateur.

Les deux projets partagent un **contrat de données** simple (schéma des fiches et des NORAD IDs), décrit dans [`data-contract/`](data-contract/README.md). Ils sont développés séparément, puis fusionnés dans un même site.

## Organisation du dossier

```
space-atlas/
├── README.md
├── docs/
│   ├── roadmap.md
│   └── research/        ← un fichier par thème de recherche
├── data-contract/       ← schéma partagé (brouillon)
├── globe/               ← projet 1
└── observatory/         ← projet 2
```

Chaque projet aura son propre `package.json` (npm, TypeScript), comme les autres projets de ce dépôt. Des workspaces npm pourront être ajoutés dans `space-atlas/` au moment de la fusion, pas avant.

## Cadre

- 5 à 7 h par semaine, sur 12 mois fermes, avec un éventuel « acte 2 » ensuite.
- Une étape qui déborde perd des fonctions au lieu de prendre du retard.
- Pas de comptes utilisateurs, pas d'IA, pas de backend lourd tant que la v1 n'a pas d'utilisateurs.
- Tout fait technique cité dans la documentation (quota, licence, format, API) est à vérifier à la source avant d'être utilisé.

Voir la [roadmap](docs/roadmap.md) et le [dossier de recherche](docs/research/).
