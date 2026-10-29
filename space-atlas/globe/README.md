# Globe pédagogique des orbites

Projet 1 de [space-atlas](../README.md). **Statut : recherche, aucun code pour l'instant.**

## Pourquoi

Il existe déjà des trackers 3D de satellites (par exemple satvis, KeepTrack, Stuff in Space). Ce projet ne cherche pas à en être un de plus : la différence est la **narration et l'explication**. Un globe qui montre où sont les satellites, et surtout pourquoi cette orbite a été choisie.

## Cible

Des personnes curieuses, sans connaissances en mécanique orbitale, qui doivent comprendre quelque chose en quelques secondes.

## Ce que ça fera

- Un globe 3D interactif avec des satellites en mouvement.
- Une couche pédagogique sur les familles d'orbites : LEO, MEO, GEO, héliosynchrone, polaire, HEO.
- Des mini-histoires (Skylab, un lancement d'Ariane 6, les satellites de Kinéis) et des infobulles.

## Comment ça marche

Les positions ne sont pas stockées : elles sont calculées à partir de paramètres orbitaux publics (format GP/OMM ou TLE) avec le modèle SGP4, via la bibliothèque satellite.js.

## Stack envisagée

Next.js, TypeScript, satellite.js, et CesiumJS ou Three.js (choix à trancher après recherche, voir [`cesium-vs-threejs`](../docs/research/cesium-vs-threejs.md)).

## Données

- **CelesTrak** pour les paramètres orbitaux. Cache côté serveur obligatoire (route API Next.js), jamais d'appel direct depuis le navigateur. Fréquence de téléchargement conforme à leur politique d'usage (à vérifier à la source).
- **Launch Library 2** (The Space Devs) pour les lancements, avec cache et environnement de test en développement (à vérifier à la source).

## Pièges connus

- Afficher des milliers d'objets demande des collections de points (par exemple `PointPrimitiveCollection` dans Cesium), pas une entité par satellite.
- Les repères de coordonnées (ECI / ECEF) sont une source classique de bugs.
- La précision des TLE se dégrade avec le temps : les données doivent être rafraîchies.
- Commencer petit (ISS + quelques constellations, 20 à 500 objets) et partir d'un template existant.

## Roadmap résumée

| Mois | Objectif |
|---|---|
| M1-3 | Globe de départ sur un template : ISS, quelques constellations, cache CelesTrak |
| M4-5 | Lancements, couleurs par type d'orbite, infobulles pédagogiques |
| M9-11 | Fusion avec l'observatoire, 2 ou 3 mini-histoires |

Détail dans la [roadmap globale](../docs/roadmap.md).
