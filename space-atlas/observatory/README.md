# Observatoire de l'écosystème spatial européen

Projet 2 de [space-atlas](../README.md). **Statut : recherche, aucun code pour l'instant.**

## Pourquoi

Les informations sur les acteurs du spatial européen sont dispersées et vieillissent vite. L'idée : peu de fiches, mais soignées, sourcées et datées.

## Cible

Étudiants, curieux, personnes qui cherchent un emploi ou un acteur du secteur, qui veulent une vue claire de l'écosystème.

## Ce que ça fera

Une base d'environ **30 entreprises** au départ, curée à la main, avec fiches, carte et filtres. Segments visés : lanceurs, satellites et constellations, transport orbital, industriels, agences, services aval.

### Champs d'une fiche

Nom, segment, ville / pays, produit, date de création, satellites ou lanceurs associés (avec NORAD IDs quand ils existent), lien carrières, sources, date de dernière mise à jour.

## Stockage

Fichiers JSON ou YAML versionnés dans le dépôt, avec un schéma de validation. Pas de base de données, pas de backend, pas de scraping. Voir le [contrat de données](../data-contract/README.md).

## Maintenance

Le projet est conçu pour que d'autres personnes puissent proposer des corrections par pull request. Chaque fiche affiche sa date de mise à jour et cite ses sources.

## Pièges connus

- Les données vieillissent vite : peu de fiches, mais bien soignées.
- Les logos sont des marques déposées : affichage sobre (texte ou usage conforme). À vérifier à la source pour chaque cas.

## Roadmap résumée

| Mois | Objectif |
|---|---|
| M6-8 | Observatoire v1 : 30 entreprises, carte, filtres |
| M9-11 | Fusion avec le globe via les NORAD IDs |

Détail dans la [roadmap globale](../docs/roadmap.md). La liste des 30 entreprises se prépare dans [`company-shortlist`](../docs/research/company-shortlist.md).
