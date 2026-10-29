# Roadmap : 12 mois fermes, puis un acte 2

Rythme : 5 à 7 h par semaine.

| Période | Ce que tu fais | Ce que tu peux montrer |
|---|---|---|
| M1-3 | Globe de départ sur un template : ISS + quelques constellations, cache CelesTrak | Vidéo de 15 s |
| M4-5 | Lancements, couleurs par orbite, infobulles pédagogiques | Lien en ligne partageable |
| M6-8 | Observatoire v1 : 30 entreprises, carte, filtres | Page publique + post « j'ai fait la fiche de X » |
| M9-11 | Fusion des deux modules + 2 ou 3 mini-histoires | Vidéo de démo du lien |
| M12 | Bilan : continuer, pivoter ou s'arrêter avec un projet fini | Décision |

## Acte 2 (M13-24), si la motivation est là

Automatisation partielle des données, parcours « comment entrer dans le spatial », ou workflow MissionScope en fonction avancée.

## Garde-fous

- Un mois creux prévu pendant les examens du MBA.
- Pas de comptes utilisateurs ni d'IA tant que la v1 n'a pas d'utilisateurs.
- Une étape qui déborde perd des fonctions, elle ne prend pas de retard.
- Un post à chaque jalon, pas plus.
- Cache côté serveur pour CelesTrak, jamais d'appels directs depuis le navigateur.
- 2D ou rendu simple d'abord si la 3D bloque. Si la motivation flanche à M6, pivoter en réutilisant le moteur.

## Suivi

La commande `/next space-atlas` ne prend que les tâches **sans** « validation requise » : ici, la phase de recherche est menée par toi.

### Fait

- [x] Choix des deux projets et de leur articulation (globe + observatoire + lien par NORAD ID)
- [x] Cadrage du périmètre v1 et des règles de pilotage
- [x] Roadmap sur 12 mois
- [x] Confrontation d'avis (plusieurs IA) et arbitrage
- [x] Prompts de brainstorm et d'intégration rédigés
- [x] Intégration au dépôt : README racine, README des deux modules, `CLAUDE.md`, dossier de recherche, contrat de données (brouillon)
- [x] Journal des décisions (`decisions.md`) et plan de recherche (`research/README.md`)

### Phase de recherche (en cours)

- [ ] Choisir le nom définitif du projet (validation requise)
- [ ] Remplir les 8 fichiers de `research/` selon le plan de recherche (validation requise : menée par toi)
- [ ] Trancher Cesium ou Three.js dans `research/cesium-vs-threejs.md` (validation requise)
- [ ] Valider le brouillon du schéma des fiches `data-contract/company.schema.json` (validation requise)

### Réalisation

- [ ] M1-3 : globe de départ (ISS + quelques constellations, cache CelesTrak), vidéo de 15 s (validation requise : démarre après le choix de la 3D)
- [ ] M4-5 : lancements, couleurs par orbite, infobulles pédagogiques, premier lien en ligne
- [ ] M6-8 : observatoire v1 (30 entreprises, carte, filtres)
- [ ] M9-11 : fusion des modules + 2 ou 3 mini-histoires
- [ ] M12 : bilan

## État des fichiers de recherche

| Thème | Fichier | Statut |
|---|---|---|
| Politique d'usage CelesTrak | [celestrak-usage-policy.md](research/celestrak-usage-policy.md) | à remplir |
| Launch Library 2 | [launch-library-2.md](research/launch-library-2.md) | à remplir |
| Space-Track | [space-track.md](research/space-track.md) | à remplir |
| Cesium vs Three.js | [cesium-vs-threejs.md](research/cesium-vs-threejs.md) | à remplir |
| Familles d'orbites | [orbit-families.md](research/orbit-families.md) | à remplir |
| Projets existants | [existing-projects.md](research/existing-projects.md) | à remplir |
| Shortlist d'entreprises | [company-shortlist.md](research/company-shortlist.md) | à remplir |
| Idées d'histoires | [story-ideas.md](research/story-ideas.md) | à remplir |
