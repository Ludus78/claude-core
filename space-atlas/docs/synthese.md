# space-atlas : synthèse du projet

> Document de cadrage à verser dans le dépôt. Rédigé le 29/10/2026.
> Tout fait technique cité (quotas, licences, formats, API) est **à vérifier à la source**. Rien n'a été contrôlé en ligne lors de la rédaction.

## 0. Le projet en bref

**space-atlas** (nom provisoire) est un site avec deux modules reliés :

1. **Globe pédagogique des orbites** : un globe 3D de satellites en mouvement, avec des explications (LEO, GEO, héliosynchrone...) et des mini-histoires (Skylab, Ariane 6, Kinéis).
2. **Observatoire de l'écosystème spatial européen** : une trentaine de fiches d'acteurs saisies à la main, avec carte et filtres.

**Le lien :** chaque satellite a un NORAD ID. Stocké dans la fiche d'une entreprise, il permet d'afficher ses objets sur le globe en cliquant sur l'entreprise, et inversement.

**Motivation :** projet personnel, par passion et pour apprendre (3D, mécanique orbitale, données satellites). La visibilité sur les réseaux est un bonus, pas le but.

**Contraintes :** 5 à 7 h par semaine, 12 mois fermes, puis un éventuel « acte 2 » (mois 13-24) si la motivation est là.

---

## 1. Arborescence prévue

Structure cible, à adapter aux conventions du dépôt d'accueil (monorepo ou dossiers séparés : à décider après exploration). Les éléments marqués `(*)` sont facultatifs et ne sont créés que s'ils sont cohérents avec les autres projets du dépôt.

```
space-atlas/
├── README.md                      # Pourquoi, cible, les deux modules, lien, roadmap résumée
├── CLAUDE.md                      # Instructions pour Claude Code (règles ci-dessous)
├── docs/
│   ├── synthese.md                # Ce document
│   ├── roadmap.md                 # Roadmap 12 mois
│   ├── decisions.md               # Journal des décisions (ADR légers)
│   ├── prompts/
│   │   ├── brainstorm-passion.md  # Prompt de confrontation d'avis auprès d'autres IA
│   │   └── integration-claude-code.md  # Prompt d'intégration au dépôt
│   └── research/
│       ├── celestrak-usage-policy.md   # Quotas, formats, fréquence autorisée
│       ├── launch-library-2.md         # Limites, environnement de test
│       ├── space-track.md              # Compte, règles d'usage
│       ├── cesium-vs-threejs.md        # Licence, performances, exemples
│       ├── orbit-families.md           # LEO, MEO, GEO, SSO, HEO
│       ├── existing-projects.md        # satvis, KeepTrack, Stuff in Space
│       ├── companies-shortlist.md      # 30 entreprises, 3 sources chacune
│       └── stories-ideas.md            # 3 à 5 histoires à raconter
├── data/                          # Contrat de données partagé entre les deux modules
│   ├── schema/
│   │   └── company.schema.json    # Schéma de validation des fiches
│   └── companies/
│       └── *.json                 # Une fiche par entreprise (ou YAML)
├── apps/                          # (*) squelette technique
│   ├── globe/                     # Module 1 : Next.js + TypeScript + Cesium/Three.js + satellite.js
│   │   └── app/api/gp/            # Route API : cache serveur des données CelesTrak
│   └── observatory/               # Module 2 : carte, filtres, fiches
└── .github/                       # (*) CI, modèles de pull request pour corrections de fiches
```

---

## 2. Décisions prises

### Produit
- **Deux modules reliés**, développés séparément puis fusionnés (M9-11).
- **Narration avant donnée brute** : le globe seul est déjà fait ailleurs (satvis, KeepTrack, Stuff in Space). La différenciation vient des explications et des histoires.
- **Observatoire petit et curé à la main** : environ 30 fiches soignées, pas de scraping, date de mise à jour et sources sur chaque fiche.
- **Maintenance communautaire** : fiches versionnées dans le repo, corrections proposées par pull request.
- **Hors périmètre en v1 :** comptes utilisateurs, IA, backend lourd, base de données.

### Stack envisagée
- Next.js + TypeScript.
- CesiumJS **ou** Three.js (à trancher après recherche, voir `docs/research/cesium-vs-threejs.md`).
- satellite.js (propagation SGP4 dans le navigateur).
- Données orbitales : CelesTrak (format GP/OMM de préférence, TLE en secours). Cache côté serveur obligatoire (route API Next.js), jamais d'appel direct depuis le navigateur.
- Lancements : Launch Library 2 (The Space Devs), avec cache et environnement de test.
- Stockage de l'observatoire : fichiers JSON ou YAML + schéma de validation.

### Règles de pilotage
- **Une étape qui déborde perd des fonctions au lieu de prendre du retard.**
- **Un mois creux** est prévu pendant les examens du MBA.
- **Commencer petit** : ISS + quelques constellations (20 à 500 objets), à partir d'un template existant.
- **2D ou rendu simple d'abord** si la 3D bloque : le piège n°1 est de perdre 2-3 mois sur la config 3D.
- **Un post public par jalon**, pas plus.
- **Pas de backend ni de comptes** tant que la v1 n'a pas d'utilisateurs.
- **Bilan à M12** : continuer, pivoter ou s'arrêter avec un projet fini. Si la motivation flanche à M6, pivoter en réutilisant le moteur.

### Pièges techniques connus (à vérifier)
- Afficher des milliers d'objets impose des collections de points (ex. `PointPrimitiveCollection` dans Cesium), pas une entité par satellite.
- Les repères ECI/ECEF sont une source classique de bugs (satellite qui « traverse la Terre »).
- La précision des TLE se dégrade en quelques heures à quelques jours : il faut rafraîchir.
- Quotas : CelesTrak (fréquence de téléchargement), Launch Library 2 (requêtes anonymes limitées).
- Licences : Cesium (fonds de carte, relief), logos d'entreprises (marques déposées).

### Idées écartées ou mises en réserve
- **MissionScope** (outil de planning de contacts satellite/stations sol) : trop « outil métier » pour un projet passion. Mis en réserve, éventuel « acte 2 ».
- **Tableau de bord d'actualités/financements** : trop de collecte de données, risque de corvée.
- **Station de réception DIY (RTL-SDR)** : peu de motivation.
- **Pistes alternatives notées** (réserve d'idées) : simulateur de durée de vie orbitale / rentrée atmosphérique, jeu « design ton orbite », explorateur d'exoplanètes (NASA Exoplanet Archive), « zoomeur » du système solaire à l'échelle.

### Contexte de l'auteur
- Développeur full stack (React/Next.js, Vue/Nuxt, TypeScript, Laravel, Java Spring Boot, React Native, Python), MBA Chef de projet / Product Owner en alternance.
- Non-ingénieur, passionné de spatial.
- L'objectif de recrutement dans le spatial a été **retiré de ce projet** : il est mené par passion. Toute analyse précédente centrée sur les candidatures et le réseau professionnel est caduque pour ce dépôt.

---

## 3. État d'avancement

### Fait
- [x] Choix des deux projets et de leur articulation (globe + observatoire + lien par NORAD ID).
- [x] Cadrage du périmètre v1 et des règles de pilotage.
- [x] Roadmap sur 12 mois.
- [x] Confrontation d'avis (plusieurs IA) et arbitrage.
- [x] Rédaction du prompt de brainstorm « passion » et du prompt d'intégration à Claude Code.

### En cours
- [ ] **Phase de recherche** avant tout code (voir `docs/research/`), à mener par l'auteur.
- [ ] Intégration du projet dans le dépôt existant via Claude Code (exploration de la structure, puis plan validé).

### À faire
- [ ] Choisir le nom définitif du projet.
- [ ] Rédiger le README racine et les README des deux modules.
- [ ] Rédiger `CLAUDE.md`.
- [ ] Remplir les 8 fichiers de `docs/research/`.
- [ ] Trancher Cesium vs Three.js.
- [ ] Définir le schéma des fiches (`company.schema.json`).
- [ ] M1-3 : globe de départ (ISS + quelques constellations, cache CelesTrak), vidéo de 15 s.
- [ ] M4-5 : lancements, couleurs par orbite, infobulles pédagogiques, premier lien en ligne.
- [ ] M6-8 : observatoire v1 (30 entreprises, carte, filtres).
- [ ] M9-11 : fusion des modules + 2 ou 3 mini-histoires.
- [ ] M12 : bilan.

### Plan de recherche suggéré (2 semaines)

| Étape | Durée | Livrable |
|---|---|---|
| Lire les politiques d'usage de CelesTrak, Launch Library 2, Space-Track | 1 h | Notes sur quotas et formats |
| Tester satvis et KeepTrack, noter ce qui plaît et ce qui manque | 2-3 h | Liste de 5 constats |
| Apprendre les familles d'orbites | 3-4 h | Résumé en ses mots |
| Tutoriel SGP4 / satellite.js, essai local | 2-3 h | L'ISS qui s'affiche |
| Comparer Cesium et Three.js (licence, exemples, communauté) | 2 h | Choix argumenté |
| Liste de 30 entreprises avec 3 sources chacune | 3-4 h | Tableur brouillon |
| Repérer 3 à 5 histoires à raconter | 1-2 h | Liste de scénarios |

---

## 4. Contenu des fichiers rédigés

État honnête : **aucun README ni `CLAUDE.md` n'a encore été rédigé**. Les seuls textes déjà écrits sont la roadmap et deux prompts, reproduits ci-dessous. Un premier prompt de brainstorm, centré sur le recrutement, a été écrit puis abandonné car il ne correspondait pas à l'objectif (passion) : il n'est volontairement pas versé au dépôt.

### 4.1 `docs/roadmap.md`

````markdown
# Roadmap : 12 mois fermes, puis un acte 2

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
````

### 4.2 `docs/prompts/brainstorm-passion.md`

Prompt à donner à d'autres IA pour confronter les idées, centré sur la passion (et non sur le recrutement).

````markdown
Tu es un mentor passionné d'espace et de développement logiciel. Je veux ton avis honnête et créatif, pas des compliments : dis-moi ce qui est cool, ce qui est irréaliste, et ce que tu ferais à ma place.

## MON PROFIL
- 38 ans, développeur full stack (React/Next.js, Vue/Nuxt, TypeScript, Laravel, Java Spring Boot, React Native, Python), actuellement en alternance chez Geodis, en MBA Chef de projet / Product Owner.
- 15 ans de vente avant ma reconversion. Je sais présenter, convaincre et structurer un produit.
- Je ne suis pas ingénieur, mais je suis passionné par le spatial : exploration, exoplanètes, trous noirs, SpaceX, lanceurs européens, startups françaises comme HyPrSpace.

## MON OBJECTIF
Réaliser pendant 2 ans un projet autour de l'espace, d'abord par passion et pour apprendre. Si le projet attire l'attention sur les réseaux (LinkedIn, communautés spatiales) et me fait connaître, c'est un bonus bienvenu, mais ce n'est pas le but. Je ne cherche pas de stratégie de recrutement ni de candidatures pour l'instant.

## MES CONTRAINTES
- 5 à 7 heures par semaine, en plus du travail et du MBA.
- 24 mois devant moi : le projet doit rester motivant sur la durée.
- Je veux un résultat visuel et partageable, que des gens non experts comprennent en quelques secondes.
- Je suis ouvert à apprendre de nouveaux outils (3D, mécanique orbitale, données satellites...).

## IDÉES EN COURS (à challenger)
1. Un visualiseur 3D du trafic orbital (CesiumJS, satellite.js, données CelesTrak, lancements via Launch Library) avec une couche pédagogique expliquant les orbites.
2. Un outil qui montre quand un satellite passe au-dessus de stations sol et ce qui change quand une station est indisponible (idée appelée MissionScope).
3. Un tableau de bord de l'écosystème spatial européen (entreprises, lancements, actualités).
Idée écartée : une station de réception DIY avec RTL-SDR (peu de motivation).

## CE QUE JE TE DEMANDE
Fais des recherches web si possible, cite tes sources et distingue les faits des hypothèses.
1. **Mes idées :** laquelle te paraît la plus excitante et la plus réaliste en 5-7 h par semaine ? Quels sont les pièges techniques (précision des données, quotas d'API, complexité de la 3D) ?
2. **Autres idées :** propose 3 à 5 projets spatiaux que tu trouves plus fun ou plus impressionnants pour un dev web (visualisations de données, outils pour passionnés, jeux, simulations, vulgarisation interactive...). Pour chacun : effet "wow", difficulté, temps estimé pour une première version.
3. **Les différents jalons :** découpe le projet gagnant en étapes de 2 à 3 mois, chacune avec un résultat visible et partageable, pour que je ne perde pas la motivation.
4. **Partage et communauté :** comment montrer l'avancement sans que ça devienne une corvée ? Quelles communautés (forums, Discord, associations, open source) accueillent bien ce genre de projet ?
5. **Les risques :** qu'est-ce qui fait abandonner ce type de projet au bout de 6 mois, et comment l'éviter ?
6. **Ta recommandation :** quel projet lancerais-tu, et quelles seraient les 3 premières actions pour le week-end ?

## FORMAT
Réponds en français, de façon structurée et concise. Termine par un verdict en 5 lignes maximum. Si une information te manque, pose-moi jusqu'à 3 questions à la fin.
````

### 4.3 `docs/prompts/integration-claude-code.md`

Prompt à coller dans Claude Code pour intégrer les deux projets au dépôt existant.

````markdown
Je veux intégrer deux nouveaux projets dans ce repo, qui contient déjà plusieurs projets. Commence par explorer la structure du repo (organisation, gestionnaire de paquets, config partagée, conventions, CI), résume-moi ce que tu trouves en quelques lignes, puis propose-moi où et comment intégrer les deux projets. Ne crée rien avant mon accord.

# CONTEXTE GÉNÉRAL
Je suis développeur full stack (Next.js, TypeScript, React, Laravel, Java Spring Boot, Python) et je fais un MBA Chef de projet / Product Owner. Je suis passionné par le spatial. Ces deux projets sont personnels : je les fais par passion et pour apprendre (3D, mécanique orbitale, données satellites). Le but est d'obtenir des résultats visuels et partageables, compréhensibles par des non-experts en quelques secondes. La visibilité sur les réseaux est un bonus, pas l'objectif.
Je consacre 5 à 7 h par semaine, sur 12 mois fermes, avec un éventuel "acte 2" ensuite si la motivation est là.
Nom de travail commun : "space-atlas" (provisoire).

# PROJET 1 : GLOBE PÉDAGOGIQUE DES ORBITES
**Quoi :** un globe 3D interactif qui affiche des satellites en mouvement, avec une couche pédagogique qui explique les orbites (LEO, MEO, GEO, héliosynchrone, polaire, HEO).
**Comment ça marche :** les positions ne sont pas stockées mais calculées à partir de paramètres orbitaux publics (format GP/OMM, ou TLE) avec le modèle SGP4 via la bibliothèque satellite.js. Le rendu se fait avec CesiumJS (ou Three.js : à trancher après recherche).
**Stack envisagée :** Next.js, TypeScript, CesiumJS ou Three.js, satellite.js.
**Données :**
- CelesTrak pour les paramètres orbitaux. Un cache côté serveur est obligatoire (route API Next.js), jamais d'appel direct depuis le navigateur, et la fréquence de téléchargement doit respecter leur politique d'usage.
- Launch Library 2 (The Space Devs) pour les lancements, avec cache et environnement de test pour le développement.
**Différenciation :** pas un énième tracker 3D (il en existe déjà : satvis, KeepTrack, Stuff in Space), mais la narration et l'explication. Des mini-histoires (Skylab, un lancement d'Ariane 6, les satellites de Kinéis) et des infobulles qui expliquent pourquoi une orbite est utilisée.
**Pièges connus :**
- Afficher des milliers d'objets exige des collections de points (par exemple PointPrimitiveCollection dans Cesium), pas une entité par satellite.
- Les repères de coordonnées (ECI/ECEF) sont une source classique de bugs.
- La précision des TLE se dégrade avec le temps, donc il faut rafraîchir les données.
- Commencer petit : ISS plus quelques constellations (20 à 500 objets), et partir d'un template existant plutôt que de tout construire.

# PROJET 2 : OBSERVATOIRE DE L'ÉCOSYSTÈME SPATIAL EUROPÉEN
**Quoi :** une base d'acteurs du spatial européen curée à la main, avec fiches, carte et filtres. Environ 30 entreprises au départ (lanceurs, satellites et constellations, transport orbital, industriels, agences, services aval).
**Champs d'une fiche :** nom, segment, ville/pays, produit, date de création, satellites ou lanceurs associés (avec NORAD IDs quand ils existent), lien carrières, sources, date de dernière mise à jour.
**Stockage :** fichiers JSON ou YAML versionnés dans le repo, avec un schéma de validation. Pas de base de données, pas de backend, pas de scraping.
**Maintenance :** le repo est conçu pour que des gens puissent proposer des corrections (pull requests). Chaque fiche affiche sa date de mise à jour, et les sources sont citées.
**Pièges connus :**
- Les données vieillissent vite, donc peu de fiches mais bien soignées.
- Les logos sont des marques déposées, donc prévoir un affichage sobre (texte ou usage conforme).

# LE LIEN ENTRE LES DEUX PROJETS
Chaque satellite a un identifiant de catalogue (NORAD ID). En stockant ces identifiants dans les fiches de l'observatoire, un clic sur une entreprise affiche ses objets sur le globe, et un clic sur un satellite renvoie vers la fiche de son opérateur. Les deux projets doivent partager un contrat de données simple (schéma des fiches et des NORAD IDs), et pouvoir être développés séparément avant d'être fusionnés dans un même site.

# ROADMAP (12 mois fermes)
- M1-3 : globe de départ sur un template (ISS + quelques constellations, cache CelesTrak)
- M4-5 : lancements, couleurs par type d'orbite, infobulles pédagogiques
- M6-8 : observatoire v1 (30 entreprises, carte, filtres)
- M9-11 : fusion des deux modules + 2 ou 3 mini-histoires
- M12 : bilan (continuer, pivoter, ou s'arrêter avec un projet fini)
Règles : une étape qui déborde perd des fonctions au lieu de prendre du retard. Un mois creux est prévu pendant les examens du MBA. Pas de comptes utilisateurs, pas d'IA, pas de backend lourd tant que la v1 n'a pas d'utilisateurs.

# ÉTAT ACTUEL : PHASE DE RECHERCHE
Je suis en phase de recherche avant de coder les fonctionnalités. Je veux donc :
1. Les deux projets intégrés au repo, avec un README chacun (pourquoi, cible, stack, roadmap résumée) et un README racine pour "space-atlas" qui explique le lien entre eux.
2. Un dossier `docs/research/` avec des fichiers markdown à remplir, un par thème : politique d'usage CelesTrak, Launch Library 2, Space-Track, Cesium vs Three.js, familles d'orbites, projets existants (satvis, KeepTrack, Stuff in Space), shortlist d'entreprises (30, avec 3 sources chacune), idées d'histoires.
3. Un fichier `docs/roadmap.md` avec la roadmap ci-dessus.
4. Un squelette technique minimal seulement s'il est cohérent avec les autres projets du repo, sinon uniquement la documentation.

# RÈGLES
- Ne modifie aucun autre projet du repo.
- Respecte les conventions existantes (lint, format, scripts, CI, structure).
- Si un choix est ambigu (monorepo ou dossiers séparés, nom des projets, emplacement), pose-moi la question au lieu de deviner.
- Tout fait technique que tu cites (quota, licence, format, API) doit être signalé comme "à vérifier à la source".
````

### 4.4 Fichiers à rédiger (pas encore écrits)

| Fichier | Statut | Contenu attendu |
|---|---|---|
| `README.md` | À rédiger | Pourquoi le projet, cible, les deux modules, le lien, roadmap résumée |
| `CLAUDE.md` | À rédiger | Règles de la section 2 (stack, cache CelesTrak, pas de backend, périmètre, vérification des faits) |
| `docs/decisions.md` | À rédiger | Journal des décisions de la section 2, avec dates |
| `docs/research/*.md` (8 fichiers) | Vides, à remplir par la recherche | Voir l'arborescence |
| `data/schema/company.schema.json` | À rédiger | Champs : nom, segment, ville/pays, produit, date de création, NORAD IDs, lien carrières, sources, date de mise à jour |
