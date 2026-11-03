# CesiumJS ou Three.js

**Statut : brouillon de recherche (2026-11-03), décision non prise.** Tout fait technique (licence, performances, version) est à vérifier à la source. Les cases « à vérifier » n'ont pas été constatées sur la page officielle.

## Contexte

Le globe doit afficher des centaines, puis potentiellement des milliers d'objets, avec des repères de coordonnées (ECI / ECEF) corrects, et rester compréhensible pour un non-expert. Intégration prévue dans Next.js + TypeScript.

## Critères de comparaison

| Critère | CesiumJS | Three.js |
|---|---|---|
| Globe terrestre prêt à l'emploi (terrain, imagerie) | Oui : diffuse terrain, imagerie et 3D Tiles depuis Cesium ion ou d'autres sources [1][2] | Non natif : il faut fournir texture, sphère et éventuellement une surcouche comme globe.gl [5] (à vérifier) |
| Gestion des repères ECI / ECEF et du temps | À vérifier à la source (non constaté) | À faire soi-même : exemples qui convertissent la sortie de satellite.js (ECI) en ECEF ou lat/lng [5][6] |
| Affichage de milliers de points (performances) | Exemple annoncé : plus de 10 000 satellites propagés avec satellite.js, dans un worker [3] (auto-déclaré, non mesuré) | Exemples avec `InstancedMesh` au-delà de 16 000 objets [6] ; globe.gl plafonné à 2 000 dans son exemple [5] (non mesuré) |
| Intégration Next.js (SSR, bundling) | Faisable mais lourd : les fichiers statiques de Cesium sont à copier via la configuration (exemple Next.js 14 avec `CopyWebpackPlugin`) [4] ; rendu côté client uniquement à prévoir | Plus simple : simple dépendance npm (à vérifier) ; rendu côté client uniquement à prévoir |
| Courbe d'apprentissage | À vérifier | À vérifier ; plus de code à écrire soi-même (globe, repères, caméra) |
| Licence et conditions d'usage des données d'imagerie | Bibliothèque Apache 2.0, gratuite en usage commercial et non commercial [1]. **Conditions et quotas gratuits de Cesium ion : non trouvés, à vérifier sur cesium.com** | Bibliothèque MIT (à vérifier). Imagerie : à choisir, avec ses propres conditions |
| Taille du bundle | Cesium est le principal poste de poids ; satellite.js est petit comparé [7]. Aucun chiffre Next.js vérifié : mesurer avec `source-map-explorer` | À mesurer |
| Templates et exemples existants (satellites) | Plusieurs dépôts Next.js + Cesium + satellite.js [3][4] | Exemple officiel de globe.gl avec satellites [5], devlogs de projets [6] |
| Contrôle visuel pour la couche pédagogique | Fort pour du cartographique, plus contraint pour du sur-mesure (à confirmer par le prototype) | Contrôle total, mais tout est à construire (à confirmer par le prototype) |
| Communauté et documentation | Forum communautaire actif [7] ; à vérifier | Très large communauté (à vérifier) |

## À tester (prototype jetable)

- [ ] Afficher l'ISS avec satellite.js dans chaque bibliothèque.
- [ ] Afficher 500 puis 5 000 points et mesurer la fluidité.
- [ ] Vérifier le comportement dans Next.js (rendu côté client uniquement).
- [ ] Mesurer le poids du bundle avec `source-map-explorer`.

## Décision

**Three.js retenu (2026-11-03, décision du propriétaire, voir D25 dans `../decisions.md`).** Raison : contrôle visuel total pour la couche pédagogique. À mesurer au prototype : fluidité à 5 000 points, poids du bundle.

Lecture provisoire, **à confirmer par le prototype** : CesiumJS donne un globe et des repères corrects sans effort (utile pour une v1 rapide) mais alourdit l'intégration Next.js et dépend de conditions Cesium ion à vérifier ; Three.js donne plus de liberté visuelle mais demande de construire le globe et les repères.

## Sources

| # | Source | URL | Date de consultation |
|---|---|---|---|
| 1 | npm, paquet `cesium` (licence Apache 2.0) | https://npmjs.com/package/cesium | 2026-11-03 |
| 2 | Cesium, sources de terrain/imagerie (résultat de recherche, page officielle à relire) | https://www.npmjs.com/package/cesium | 2026-11-03 |
| 3 | Exosphere (Cesium + satellite.js, 10 000+ satellites) | https://github.com/Sem-CSA/exosphere | 2026-11-03 |
| 4 | sgp4gl demo (Next.js 14 + Cesium) | https://github.com/Kayhan-Space/sgp4gl-demo | 2026-11-03 |
| 5 | globe.gl, exemple satellites | https://github.com/vasturiano/globe.gl/blob/7dc68f5a3338efea883b5a64fcbc4ab5668a68f1/example/satellites/index.html | 2026-11-03 |
| 6 | Rendu de 8 000 satellites dans un navigateur (billet de blog) | https://moonligh7er.github.io/developer-site/portfolio-pieces/DeepSeer/blog/rendering-8000-satellites-browser | 2026-11-03 |
| 7 | Forum Cesium, taille de bundle | https://community.cesium.com/t/webpack-cesium-mobile-desktop/17529 | 2026-11-03 |
