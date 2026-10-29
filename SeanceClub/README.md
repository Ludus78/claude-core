# SéanceClub — projet de démarrage (phase 1)

Contenu de ce dossier :

- `db/migrations/001_init.sql` : schéma PostgreSQL complet (utilisateurs, films, avis, séances, score, modération), avec les règles d'âge en base.
- `db/tests/age_rules.sql` : 27 tests des règles d'âge (films interdits aux mineurs, séances réservées aux majeurs, groupes, date de naissance verrouillée).
- `packages/score` : le calcul du score cinéphile (formule v1) en TypeScript, avec 11 tests dont les 4 cas de référence de la spécification.
- `docker-compose.yml` : PostgreSQL 16 et Redis 7 en local.
- `apps/` : vide pour l'instant (application web à créer, voir ci-dessous).

## Démarrer

```bash
docker compose up -d          # PostgreSQL + Redis ; le schéma est appliqué au premier démarrage
cp .env.example .env
npm install
npm test                      # tests du score
```

Tests des règles d'âge (sur une base jetable) :

```bash
docker compose exec db createdb -U seance seanceclub_test
docker compose exec -T db psql -U seance -d seanceclub_test < db/migrations/001_init.sql
docker compose exec -T db psql -q -U seance -d seanceclub_test < db/tests/age_rules.sql
# attendu : pass = 27, fail = 0
```

## Checklist phase 1 (semaines 4 à 6 de la roadmap)

1. [ ] Créer l'application : `npx create-next-app@latest apps/web --typescript`
2. [x] Brancher la base (`DATABASE_URL`) et choisir l'accès aux données (voir notes).
3. [ ] Auth.js : Google, Discord, e-mail.
4. [ ] Inscription : pseudo unique, date de naissance, consentement. Refus sous 13 ans (la base le refuse aussi).
5. [ ] Moins de 15 ans : compte `pending_parental`, e-mail au parent, validation dans `parental_consents`.
6. [ ] Reprendre les couleurs des maquettes : fond `#0E0E10`, texte `#F5F2EC`, accent rouge `#D7263D`.
7. [ ] Premiers écrans : accueil, inscription, profil.

## Notes importantes

- Les fichiers de `db/migrations` ne s'exécutent qu'au premier démarrage du volume. Dès que le schéma change, utilise un outil de migrations (par exemple `node-pg-migrate`) au lieu de modifier `001_init.sql`.
- Le schéma utilise des triggers et une colonne calculée (`films.effective_min_age`) : garde le SQL comme source de vérité. Si tu utilises Prisma, limite-le à la lecture et à l'écriture des données, jamais à la génération des migrations, et n'écris jamais dans `effective_min_age`.
- Pour la recherche, les listes et le calendrier, passe par `films_for_user(user_id)` afin de masquer les films interdits au membre.
- Les tables `genre_families` et `country_regions` sont vides : à remplir pour que la diversité du score fonctionne.
- Licence commerciale de l'API de films : à obtenir avant d'ouvrir le premium.
