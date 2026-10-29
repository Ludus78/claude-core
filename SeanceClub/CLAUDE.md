# SéanceClub

Plateforme sociale francophone pour cinéphiles : score cinéphile, avis, calendrier des sorties, « séances » avec chat en direct.

## État du dossier

Cadrage terminé et **projet de démarrage intégré** (npm workspaces) : `db/migrations/001_init.sql`, `db/tests/age_rules.sql`, `packages/score/` (calcul du score, testé), `docker-compose.yml` (PostgreSQL 16 et Redis 7), `.env.example`. `apps/` est vide : l'application web est à créer en phase 1 (voir `ROADMAP.md`). Le `README.md` explique le démarrage local.

Commandes (depuis `SeanceClub/`) : `npm install`, puis `npm test` (tests du score). `docker compose up -d` lance la base.

## Sources de vérité

- `CONTEXTE.md` : objectifs et décisions prises. À lire en premier.
- `seanceclub_schema.sql` : schéma PostgreSQL v1.
- `Spécification du score cinéphile.md` : formule du score.
- `copilot-instructions.md` : stack cible, **règles non négociables sur les mineurs et les données personnelles**. À lire avant toute tâche touchant aux films, à l'âge ou aux séances.
- `workflow.instructions.md` : règles de travail (périmètre strict, sobriété, 2 tentatives maximum par problème). Elles s'appliquent aussi à Claude.

## Règles

- `seanceclub-starter.zip` a été décompressé ici : ne pas le re-décompresser. `seanceclub_schema.sql` est identique à `db/migrations/001_init.sql` (doublon, ne pas le supprimer sans accord).
- Les changements de schéma passent par de nouvelles migrations, jamais par une modification de `001_init.sql`.
- Ne jamais mettre de vraie valeur dans `.env.example` ; `.env` n'est jamais commité.
- Ne pas créer `apps/web` avant la phase 1 de `ROADMAP.md`, sauf demande explicite.
- Les décisions de `CONTEXTE.md` ne se rouvrent pas sans que l'utilisateur le demande.
- Les chiffres de licence (TMDB, liste de référence) sont « à vérifier à la source ».
