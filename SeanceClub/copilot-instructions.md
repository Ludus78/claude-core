# SéanceClub : instructions pour Copilot

## Le projet

SéanceClub est une plateforme sociale francophone pour cinéphiles : score cinéphile, avis et notes, calendrier des sorties, et « séances » (chacun lance le film en même temps sur sa propre plateforme, puis on discute dans un chat en direct). Le site n'héberge aucun film. Pas de publicité. Modèle freemium (premium autour de 3,99 €/mois). Développeur unique.

## Stack et structure

- Monorepo npm workspaces :
  - `apps/web` : Next.js (App Router), TypeScript strict, Tailwind.
  - `apps/realtime` : Node + Socket.IO (phase 4, pas avant).
  - `packages/score` : calcul du score cinéphile, déjà écrit et testé.
  - `db/migrations` : SQL, source de vérité du schéma.
- PostgreSQL 16, Redis 7, Auth.js (OAuth Google et Discord), Stripe (phase 6), Vitest, Zod.
- Accès aux données : `pg` avec requêtes paramétrées uniquement. Pas de Prisma Migrate. Jamais de concaténation de chaînes dans du SQL.
- Les changements de schéma passent par de nouveaux fichiers `db/migrations/00N_nom.sql`. Ne jamais modifier `001_init.sql`.

## Règles non négociables (mineurs et données personnelles)

1. Tout film affiché, cherché, recommandé ou listé passe par le filtre d'âge : la fonction SQL `films_for_user(user_id)` ou `WHERE effective_min_age <= <âge>`. Jamais de requête brute sur `films` pour un membre.
2. `films.effective_min_age` est calculée par la base : ne jamais l'écrire. Pour corriger l'âge d'un film, écrire `min_age_override`.
3. Les séances (création, participation, chat) sont réservées aux majeurs. La base refuse déjà (`adults_only`), mais l'API et l'interface doivent vérifier avant.
4. Âge minimum d'inscription : 13 ans. Entre 13 et 14 ans, le compte reste `pending_parental` tant que l'accord parental n'est pas validé.
5. La date de naissance est immuable, jamais exposée publiquement et jamais renvoyée au navigateur, sauf à son propriétaire. L'âge se calcule côté serveur.
6. Erreurs de la base à reconnaître et à traduire en messages clairs : `too_young`, `film_age_restricted`, `adults_only`, `birth_date_locked`, `group_audience_mismatch`.
7. RGPD : collecte minimale, suppression de compte complète (les clés étrangères en cascade existent), messages de chat supprimés après 30 jours.
8. Hors périmètre en v1 : rencontres en personne, messagerie privée entre membres, hébergement de films, publicité.

## Score cinéphile

Toujours utiliser `@seanceclub/score` (`computeScore`, `buildInput`, `levelFor`). Ne jamais recoder la formule. Toute modification des constantes se fait dans `packages/score/src/config.ts`, incrémente `version` et met à jour les tests.

## Données de films

- Fournisseur : TMDB (licence commerciale à obtenir avant le premium). Passer par une interface `FilmProvider` pour pouvoir changer de fournisseur. Mettre chaque film en cache dans la table `films`.
- Classification d'âge : lire la certification FR dans `release_dates`, prendre la première valeur non vide, convertir `U` en 0 et `10`, `12`, `16`, `18` en nombre. Sinon laisser `min_age` à NULL (la base traite NULL comme -16).
- Afficher l'attribution TMDB partout où ses données apparaissent.

## Design

- Interface sombre : fond `#0E0E10`, cartes `#17171A`, bordures `#26262B`, texte `#F5F2EC`, texte secondaire `#A09A92`, accent rouge `#D7263D` (seul accent).
- Polices : Bebas Neue (titres, logo), DM Sans (texte).
- Logo : siège de cinéma rouge, « SÉANCE » en blanc, « CLUB » plus petit en gris.
- Affiches de films en avant, titre en blanc dessous. Fiche film : affiche, note de la communauté, avis des membres, puis seulement le synopsis.
- Accessibilité : contraste suffisant, zones cliquables d'au moins 44 px, focus visible, textes alternatifs.

## Conventions de code

- TypeScript strict, pas de `any`. Valider toute entrée avec Zod aux frontières (API, formulaires).
- Vérifier la session et les droits côté serveur dans chaque route ou action, jamais seulement dans l'interface.
- Assainir tout texte saisi par un membre (avis, pseudo, chat) et limiter le débit des requêtes sensibles.
- Code, noms et commentaires techniques en anglais ; textes de l'interface en français.
- Un test Vitest pour chaque règle métier (âge, score, consentement). Petits commits, un par tâche.
- Secrets uniquement dans `.env` (voir `.env.example`), validés au démarrage.
