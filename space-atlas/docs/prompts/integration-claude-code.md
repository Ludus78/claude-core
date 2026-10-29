# Prompt d'intégration à Claude Code

Prompt utilisé pour intégrer les deux projets au dépôt existant (il a servi à produire la structure actuelle de `space-atlas/`).

---

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
