---
mode: agent
description: SéanceClub, phase 1 (projet web, base, authentification, inscription avec règles d'âge)
---

Lis d'abord `.github/copilot-instructions.md` et `README.md`. Tu ne modifies jamais `db/migrations/001_init.sql`.

## Objectif

Mettre en place les fondations de SéanceClub : l'application web, la connexion à la base, l'authentification Google et Discord, et l'inscription avec les règles d'âge (refus sous 13 ans, accord parental entre 13 et 14 ans).

## Méthode

Travaille dans l'ordre, une tâche à la fois. Après chaque tâche : lance les tests, le lint et la vérification des types, corrige, puis propose un message de commit. Ne passe pas à la tâche suivante si quelque chose échoue. Si un choix n'est pas couvert ici, prends l'option la plus simple et signale-la.

## Tâche 1 : application web

- Crée `apps/web` avec create-next-app : TypeScript, App Router, Tailwind, ESLint, dossier `src`, alias `@/`.
- Ajoute la dépendance workspace `@seanceclub/score` et vérifie qu'elle s'importe.
- Configure Tailwind avec les couleurs et les polices des instructions (Bebas Neue et DM Sans via `next/font`).
- Crée un composant `Logo` (siège rouge en SVG, « SÉANCE » en blanc, « CLUB » plus petit en gris).

Critère : `npm run dev -w apps/web` démarre et la page d'accueil affiche le logo sur fond sombre.

## Tâche 2 : environnement et base

- `src/lib/env.ts` : valide `process.env` avec Zod (`DATABASE_URL`, `AUTH_SECRET`, `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`, `AUTH_DISCORD_ID`, `AUTH_DISCORD_SECRET`). L'application refuse de démarrer si une variable manque.
- `src/lib/db.ts` : pool `pg` et helper `query<T>(sql, params)`. Une fonction `withTransaction` pour les écritures multiples.
- Crée `db/migrations/002_auth.sql` : table `auth_accounts` (`provider text`, `provider_account_id text`, `user_id uuid` référence `users(id)` en `ON DELETE CASCADE`, clé primaire `(provider, provider_account_id)`). N'utilise pas l'adapter Auth.js : il crée sa propre table `users`, incompatible avec la nôtre.
- Mets à jour le README (commande pour appliquer la migration 002 sur une base existante).

Critère : une requête `SELECT 1` réussit au démarrage et la migration 002 s'applique sans erreur.

## Tâche 3 : authentification (Auth.js v5)

- Fournisseurs Google et Discord, sessions JWT, sans adapter.
- Callback `signIn` :
  - si `(provider, provider_account_id)` est lié à un utilisateur : connexion ;
  - sinon, si l'e-mail correspond à un utilisateur existant : lier le compte uniquement si le fournisseur confirme que l'e-mail est vérifié, sinon refuser ;
  - sinon : session « onboarding requis » (provider, id, e-mail, avatar dans le JWT) et redirection vers `/onboarding`.
- La session expose `userId`, `pseudo`, `accountStatus` et `isAdult` (booléen calculé côté serveur). Jamais la date de naissance.
- Page `/login` avec les boutons Google et Discord.

Critère : un nouveau compte Google ou Discord est redirigé vers `/onboarding`, un compte existant arrive connecté.

## Tâche 4 : règles d'âge (module pur et testé)

- `src/lib/age.ts` :
  - `ageFromBirthDate(birth: Date, today = new Date()): number`
  - `signupDecision(age: number): 'refused' | 'pending_parental' | 'active'` (moins de 13 : refused ; 13 et 14 : pending_parental ; 15 et plus : active)
  - `isAdult(age: number): boolean`
- Tests Vitest : la veille du 13e anniversaire, le jour même, le 29 février, 14 ans et 364 jours, 17 ans et 364 jours, 18 ans pile.

Critère : tous les tests passent.

## Tâche 5 : inscription (onboarding)

- Page `/onboarding` : pseudo (3 à 20 caractères parmi `A-Za-z0-9_.-`), date de naissance, case de consentement obligatoire (conditions d'utilisation et politique de confidentialité, pages provisoires). Si l'âge calculé est inférieur à 15 ans : champ e-mail du parent.
- Server action :
  - valide avec Zod ;
  - moins de 13 ans : refuse avec un message clair, ne crée aucun compte et ne conserve pas la date de naissance ;
  - crée `users` et `auth_accounts` dans une même transaction ;
  - moins de 15 ans : `account_status = 'pending_parental'`, ligne `parental_consents` (`method = 'email_link'`, token aléatoire dont seul le hash SHA-256 est stocké, expiration à 14 jours) et envoi d'un e-mail via une interface `Mailer` (implémentation de développement : affichage dans la console ; Resend viendra plus tard) ;
  - traduit les erreurs de la base : pseudo déjà pris (violation d'unicité) et `too_young`.
- Page `/parental-consent/[token]` : vérifie que le token existe, n'est pas expiré et est en attente ; passe `parental_consents.status` à `approved` avec `decided_at`, passe le compte à `active`, affiche une confirmation.

Critère : les quatre scénarios de la section « Vérifications finales » fonctionnent.

## Tâche 6 : garde d'accès

- Helper `requireActiveUser()` : non connecté vers `/login` ; onboarding requis vers `/onboarding` ; `pending_parental` vers `/attente-parent` (message explicatif et renvoi de l'e-mail limité à une fois par heure).
- Helper `requireAdult()` pour les futures pages de séances : renvoie un refus 403 avec un message pour les mineurs.
- Tests unitaires de ces deux helpers (session simulée).

Critère : un compte `pending_parental` ne peut ouvrir aucune page protégée.

## Tâche 7 : pages de base

- Layout avec navigation (logo, Films, Sorties, Séances, Communauté). Le bouton « Créer une séance » n'apparaît que pour un majeur actif.
- Accueil provisoire inspiré de la maquette : titre d'accroche, carte « Ton score cinéphile » avec des valeurs d'exemple clairement marquées comme provisoires.
- Interface entièrement en français.

Critère : l'application est utilisable de bout en bout sur ordinateur et sur mobile.

## Vérifications finales

Scénarios à tester à la main, puis à décrire dans le README :

1. Un adulte s'inscrit : compte actif, bouton « Créer une séance » visible.
2. Un jeune de 14 ans s'inscrit : compte en attente, e-mail du parent affiché dans la console, après validation du lien le compte devient actif.
3. Un enfant de 12 ans : inscription refusée, aucune ligne créée dans `users`.
4. Un jeune de 16 ans : actif, mais ni bouton « Créer une séance » ni accès aux pages de séances.

Définition de « terminé » : `npm test`, le lint et la vérification des types passent, aucun secret dans le dépôt, README à jour.

## Hors périmètre

Recherche de films, notes et avis, séances et chat, paiement, application mobile.
