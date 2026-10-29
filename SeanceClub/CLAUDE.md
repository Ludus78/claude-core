# SéanceClub

Plateforme sociale francophone pour cinéphiles : score cinéphile, avis, calendrier des sorties, « séances » avec chat en direct.

## État du dossier

Pour l'instant : **cadrage et documents, pas de code d'application** dans ce dossier. Le code vit dans `seanceclub-starter.zip` (non décompressé dans le dépôt) ou reste à créer.

## Sources de vérité

- `CONTEXTE.md` : objectifs et décisions prises. À lire en premier.
- `seanceclub_schema.sql` : schéma PostgreSQL v1.
- `Spécification du score cinéphile.md` : formule du score.
- `copilot-instructions.md` : stack cible, **règles non négociables sur les mineurs et les données personnelles**. À lire avant toute tâche touchant aux films, à l'âge ou aux séances.
- `workflow.instructions.md` : règles de travail (périmètre strict, sobriété, 2 tentatives maximum par problème). Elles s'appliquent aussi à Claude.

## Règles

- Ne pas décompresser les `.zip` dans le dépôt sans demande.
- Les changements de schéma passent par de nouvelles migrations, jamais par une modification de `001_init.sql`.
- Les décisions de `CONTEXTE.md` ne se rouvrent pas sans que l'utilisateur le demande.
- Les chiffres de licence (TMDB, liste de référence) sont « à vérifier à la source ».
