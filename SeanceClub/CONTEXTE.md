# SéanceClub : synthèse du projet

*Projet personnel mené en solo. Mise à jour : octobre 2026.*

## 1. Objectif

SéanceClub est une plateforme sociale francophone pour cinéphiles. Elle répond à une question de départ : **combien de films as-tu vus, et en as-tu vu assez pour juger un film ?**

Ce que le produit permet :
- mesurer sa culture cinéma avec un **score cinéphile** (volume, diversité, références) ;
- noter les films et lire trois niveaux d'avis : le sien, celui de son groupe, celui de la communauté, avec un vote « OK ou pas » par film ;
- regarder ensemble avec les **séances** : chacun lance le film sur sa propre plateforme au même moment (« 3, 2, 1, play »), puis on discute dans un chat en direct inspiré de mIRC ;
- consulter le calendrier des sorties et l'exporter dans son agenda, créer des tier lists, des favoris et des listes saisonnières.

Principes : aucun film n'est hébergé, aucune publicité, modèle freemium. Public visé : 18-35 ans.

## 2. Décisions prises

| Sujet | Décision |
|---|---|
| Nom | **SéanceClub** (« Séance » seul est déjà pris). Domaine seanceclub, sans accent. |
| Logo | « SÉANCE » en blanc, « CLUB » plus petit en gris, siège de cinéma rouge |
| Design | Interface sombre (fond `#0E0E10`), rouge `#D7263D` comme seul accent, polices Bebas Neue et DM Sans. Fiche film : affiche, note, avis des membres, puis synopsis. |
| Modèle économique | Freemium sans publicité. Premium à 3,99 €/mois ou 29,99 €/an. Films vus et favoris gratuits. |
| Score | Score sur 100 = 50 % volume, 30 % diversité, 20 % références. Cinq niveaux : Curieux, Amateur, Passionné, Cinéphile, Encyclopédie. |
| Liste de référence | v1 : Top 250 d'IMDb comme liste de départ (droits à vérifier). v2 : liste de 200 films avec quotas de diversité. |
| Mineurs | Inscription refusée sous 13 ans. Accord parental entre 13 et 14 ans. Séances et chat réservés aux majeurs. Films filtrés selon la classification française. |
| Rencontres en salle | Hors v1 |
| Messagerie privée entre membres | Non prévue en v1 |
| Données de films | TMDB pour les films et la classification d'âge (licence commerciale à obtenir). Classification absente : saisie manuelle, sinon traitée comme -16. OMDb envisagé en complément, non tranché. |
| Authentification | OAuth 2.0 avec Auth.js : Google et Discord, sessions JWT, sans adaptateur (table `auth_accounts` dédiée). |
| Temps réel | Serveur Node séparé avec Socket.IO (pas d'hébergement serverless pour le chat). |
| Outil de développement | GitHub Copilot dans VS Code, piloté par des fichiers d'instructions. |
| Effet d'ouverture | Intro « salle de cinéma » à la connexion (faisceau de lumière, « chut », pop-corn), une fois par session, désactivable. |

## 3. État d'avancement

**Réalisé**
- Concept, périmètre du MVP et roadmap en 7 phases.
- **Maquettes** (ordinateur uniquement) : accueil, fiche film, salon de séance.
- **Business plan** : hypothèses, projections sur trois ans, risques.
- **Spécification du score** : formule, niveaux, cas de test, schéma SQL associé.
- **Schéma PostgreSQL** : 27 tables avec les règles d'âge en base. Testé sur une vraie base PostgreSQL 16 : 27 tests sur 27 passent.
- **Module de score** en TypeScript : 11 tests passent, dont les 4 cas de référence de la spécification.
- **Projet de démarrage** (zip) : migrations, `docker-compose.yml` (PostgreSQL et Redis), tests, README.
- **Quiz de démonstration** (41 films à cocher) : démo uniquement, aucune donnée enregistrée.
- **Prompts Copilot** : instructions du projet, règles de travail, prompt de la phase 1, prompt de l'intro cinéma. Non testés avec Copilot.

**Pas encore fait** : aucune ligne de l'application web n'est écrite (le dossier `apps/` est vide). Le schéma n'a pas été lancé avec Docker, seulement avec PostgreSQL installé directement.

## 4. Ce qui reste à faire

**Avant ou pendant les premières semaines de code**
1. Écrire à TMDB pour la licence commerciale et tester la récupération de la classification d'âge française.
2. Vérifier la marque à l'INPI, acheter le domaine, réserver les pseudos.
3. Recopier la liste de référence (250 titres) dans un tableur, puis remplir `genre_families` et `country_regions`.
4. Rédiger les conditions d'utilisation, la politique de confidentialité et les mentions légales. Faire valider le parcours d'accord parental.
5. Définir les règles du chat (déroulé d'une séance, synchronisation, modération, conservation des messages).
6. Prévoir un back-office minimal : corriger la classification d'un film, traiter les signalements, bannir.
7. Compléter les maquettes : inscription, profil et score, recherche, listes et tier lists, page premium, version mobile.
8. Choisir l'hébergement du serveur de chat et le service d'e-mails.
9. Remplacer la démo du quiz par une vraie liste d'attente avec consentement RGPD.

**Roadmap (environ 10 heures par semaine, soit 5 mois)**

| Phase | Semaines | Contenu |
|---|---|---|
| 0. Validation | 1 à 3 | Points bloquants, vraie liste d'attente avec le quiz |
| 1. Fondations | 4 à 6 | Application web, base, connexion, inscription avec règles d'âge |
| 2. Films et score | 7 à 10 | Données de films avec cache, fiche film, vus, notes, score, profil |
| 3. Avis et sorties | 11 à 12 | Avis, vote « OK ou pas », calendrier avec export agenda, signalement, back-office |
| 4. Séances | 13 à 16 | Serveur temps réel, salons, compte à rebours, chat, modération |
| 5. Bêta fermée | 17 à 19 | 30 à 50 testeurs, corrections, sécurité, documents RGPD |
| 6. Premium et lancement | 20 à 22 | Stripe, fonctions premium, licence API confirmée, ouverture publique |

**Plus tard** : vérification d'âge renforcée, application mobile, rencontres en salle, « wrapped » annuel, score par genre affiché à côté des avis.

## 5. Stack envisagée

| Couche | Choix |
|---|---|
| Application web | Next.js (App Router), TypeScript strict, Tailwind |
| Temps réel | Node.js avec Socket.IO, sur un serveur séparé |
| Base de données | PostgreSQL 16 (le SQL de `db/migrations` fait référence), accès avec `pg` et requêtes paramétrées |
| Cache et présence | Redis 7 |
| Authentification | Auth.js v5 (Google, Discord, e-mail plus tard) |
| Validation et tests | Zod, Vitest |
| Paiement | Stripe (phase 6) |
| Données de films | TMDB, derrière une interface `FilmProvider` ; cache local |
| E-mails | Resend ou Brevo (à décider) |
| Hébergement | Application web et serveur de chat à choisir (Railway, Fly.io, Render ou VPS) |
| Développement local | Docker Compose, npm workspaces, GitHub Copilot |

## 6. Hypothèses financières et risques

**Hypothèses (à valider)** : 3 % de conversion vers le premium, revenu net moyen de 2,60 € par abonné et par mois après TVA et frais Stripe. Résultat annuel du scénario central : environ -3 100 € en année 1, -1 000 € en année 2, +10 400 € en année 3. À 2 % de conversion, l'année 3 reste légèrement négative. Les coûts de licence de l'API, de modération et de marketing sont des estimations.

**Risques principaux**
- Licence commerciale de TMDB, et droits liés à la liste de départ inspirée d'IMDb.
- L'âge est déclaratif : un mineur peut mentir, la modération est indispensable.
- Communauté vide au lancement : validation par liste d'attente avant de développer tout.
- Charge de travail d'un développeur seul, en parallèle des études.
- Concurrence de Letterboxd et des acteurs établis : se différencier par le live, le score et le francophone.

## 7. Documents et fichiers

- Maquettes : https://claude.ai/artifact/LqwANByRN3WJz3FJfLYpNt
- Business plan : https://claude.ai/artifact/FSvHF7HBgabYK3va2FHTz8
- Spécification du score : https://claude.ai/artifact/3q8o3HjJLKy65qv2nQS1Um
- Quiz de démonstration : https://claude.ai/artifact/8eeDQsTf2Rf7REWEA32w61
- Fichiers : `seanceclub-starter.zip`, `seanceclub_schema.sql`, `seanceclub-landing.html`, `copilot-instructions.md`, `workflow.instructions.md`, `phase1-setup.prompt.md`, `intro-cinema.prompt.md`
