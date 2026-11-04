# PROJETS

Registre des projets de `claude-core`. Mis à jour par la commande `/status` (voir `_hub/CLAUDE.md`).

**Dernière mise à jour : 2026-11-03** (via `/status`). Changements : Confio, tests terminés ; immonova, actualités en construction ; SeanceClub, début de l'application ; Memories, Taverne (mise en ligne à vérifier).
Statuts : `idée` · `étude` · `en cours` · `pause`.

## Vue d'ensemble

| Projet | Chemin | Stack | Statut |
|---|---|---|---|
| Confio | `Confio/` | TypeScript, Vite, Vitest | en cours |
| immonova | `immonova/immonova2.0/` | Next.js 16, React 19, Prisma/Postgres (Neon), Kinde, PostHog, Tailwind | en cours |
| SeanceClub | `SeanceClub/` | Cible : Next.js, PostgreSQL, Socket.IO | étude (cadrage avancé) |
| Memories | `Memories/` | BD ; page de collecte `taverne/` (Next.js, Prisma/Postgres) | en cours |
| space-atlas | `space-atlas/` | Cible : Next.js, TypeScript, Cesium ou Three.js | étude (recherche) |

## Détail

### Confio
- **Nature** : extension Chrome qui signale les mails Gmail suspects pour des utilisateurs non techniques.
- **État** (dernier commit 2026-10-30) : code et tests en place (signaux de détection, scoring, client Gmail, popup). Tests de `auth`, `sender`, `urgency`, `gmail/headers` et `gmail/client` faits.
- **Roadmap** : `Confio/ROADMAP.md`
- **Reste à faire** : script `lint` (nouvelle dépendance), `claudetest.md` et `sersestechestestoile` à renommer ou supprimer (voir la roadmap). Roadmap produit à définir.
- **Prochaine action** : trancher les 3 tâches de nettoyage de la roadmap (chacune demande ta validation).
- **À clarifier** : `claudetest.md` contient du TypeScript ; `sersestechestestoile` est un fichier au nom inexpliqué.

### immonova
- **Nature** : site d'aide à l'achat et à la gestion immobilière (calculateurs, estimation, actualités, espace utilisateur). `immonova2.0` est la version active, `OldVersion` est figée.
- **État** (2026-11-01) : en ligne sur Vercel, Next.js 16, Kinde, base Postgres Neon. Positionnement national décidé (`docs/produit.md`), accueil réécrit, consentement PostHog, événements des calculateurs, e-mails du popup et connexions enregistrés, page `/admin` et export CSV newsletter vérifiés. Audit : `docs/audit-site.md`.
- **Roadmap** : `immonova/ROADMAP.md`
- **Reste à faire** : page de confidentialité, popup e-mail avant les calculateurs (à trancher), outil de newsletter, fusion des calculateurs, lien Instagram avec suivi, événements contact et inscription, audits restants (pages, API, RGPD complet).
- **Prochaine action** (état au 2026-11-02) : actualités hebdomadaires en brouillons (`immonova2.0/docs/actualites-hebdo.md`). Fait : migration `sourceUrl`, module de sources (Banque de France active, Notaires désactivée), route `/api/cron/actualites` protégée. Cron non activé. À faire par le propriétaire : clé d'API (`CLAUDE_API_KEY`) et `CRON_SECRET` dans Vercel. Ensuite : essai manuel, ligne `crons` dans `vercel.json`. Puis page de confidentialité et choix de l'outil de newsletter.
- **À clarifier** : clé PostHog absente de la liste des variables Vercel (à vérifier) ; doublon `next.config.js` / `.mjs` ; `app/head.tsx` inutilisé ; dépôt GitHub public, `dev.db` reste dans l'historique.

### SeanceClub
- **Nature** : plateforme sociale francophone pour cinéphiles (score cinéphile, avis, calendrier des sorties, séances avec chat en direct).
- **État** : cadrage terminé (concept, maquettes ordinateur, business plan, spécification du score, schéma PostgreSQL de 27 tables, module de score TypeScript avec 11 tests, projet de démarrage intégré au dépôt). **L'application web est commencée dans `apps/web` (dernier commit 2026-11-02) : accès base avec `pg`, création de compte (pseudo, âge, consentement), règles d'âge (13 ans, accord parental avant 15 ans), activation par accord parental, Kinde à la place d'Auth.js, formulaire d'inscription et écran de l'e-mail du parent.**
- **Reste à faire** (source : `CONTEXTE.md`) : licence commerciale TMDB, marque et domaine, liste de référence, documents juridiques et accord parental, règles du chat, back-office minimal, maquettes manquantes, hébergement, vraie liste d'attente. Puis 7 phases, environ 22 semaines à 10 h par semaine.
- **Roadmap** : `SeanceClub/ROADMAP.md` (source : `CONTEXTE.md`). Base technique intégrée : `db/`, `packages/score/`, `docker-compose.yml`, `apps/` vide.
- **Prochaine action** : phase 0 (validation) : écrire à TMDB, vérifier la marque, mettre en place une vraie liste d'attente (tâches de la roadmap toujours ouvertes). Le code de l'inscription avance en parallèle.
- **Dépendances externes** : licence TMDB et droits de la liste de référence, à vérifier à la source.

### Memories
- **Nature** : BD humoristique et fantasy tirée de 15 ans de souvenirs de WoW entre amis.
- **État** : format retenu (strips et planches), une maquette de planche de 6 cases faite, 5 fiches de personnage avec les faits connus, intention notée (Warcraft, visuel sombre), questionnaire des amis. Aucune vraie anecdote écrite (à confirmer), aucun illustrateur trouvé.
- **Reste à faire** : collecter les histoires, fiches de personnage, accord du groupe, choix de l'univers (WoW ou monde parodique), description de style commune, choix du dessin, premier script, choix de diffusion.
- **Roadmap** : `Memories/ROADMAP.md`. Base : dossiers `personnages/`, `anecdotes/`, `style/`, `planches/` avec modèles.
- **Taverne des Souvenirs** (`Memories/taverne/`, commit `0dd7bde`) : page de collecte écrite et poussée, direction artistique « pub » (dernier commit 2026-11-02). Mise en ligne à vérifier : la roadmap la donne encore à faire, un commit « déclenche le déploiement Vercel » existe. Mot de passe d'entrée, fiche d'aventurier (race, classe, « comment tu te vois dans la BD », récits), lien privé pour ajouter des récits, base Postgres/Neon (`Aventurier`, `Recit`). Listes de races et classes dans `src/warcraft.ts` : noms français à confirmer, liste à vérifier à la source. Build OK, rendu à l'écran, base et envoi non testés. Limites : pas de modification d'une fiche après envoi, lien privé affiché une seule fois.
- **Prochaine action** : mise en ligne de la Taverne (étapes dans `Memories/taverne/README.md` : projet Vercel avec Root Directory `Memories/taverne`, base Neon pour `POSTGRES_URL`, variable `ACCES_TAVERNE`, `npx prisma migrate deploy`), puis tester avec quelques amis et collecter les anecdotes.
- **À clarifier** : `memories-synthese.md.py` est en réalité du Markdown (ne pas l'exécuter).

### space-atlas
- **Nature** : globe pédagogique des orbites + observatoire de l'écosystème spatial européen, liés par les NORAD IDs.
- **État** : documentation uniquement, aucun code : synthèse de cadrage, journal des décisions (`docs/decisions.md`), prompts, plan de recherche de 2 semaines, roadmap avec suivi cochable, brouillon du schéma des fiches (`data-contract/company.schema.json`, contrôlé sur des exemples fictifs), 8 fichiers de recherche à remplir.
- **Reste à faire** : choisir le nom définitif, remplir `docs/research/` (menée par toi), trancher Cesium ou Three.js, valider le schéma, puis le globe de départ (M1-3).
- **Roadmap** : `space-atlas/docs/roadmap.md` (section « Suivi »). Pas de squelette de code avant le choix Cesium ou Three.js.
- **Prochaine action** : suivre le plan de recherche (`docs/research/README.md`), en commençant par `cesium-vs-threejs.md` et `celestrak-usage-policy.md`.
- **À clarifier** : emplacement des fiches (`data/companies/` ou ailleurs, voir `docs/decisions.md` D20).

## Idées en attente

Idées du 2026-10-31, par ordre de priorité proposé. Ajouter ici les idées pas encore devenues des projets.

1. **Audit d'immonova.org et cadrage de la 2.0** (objectif : audience récurrente). Fait : `immonova/immonova2.0/docs/audit-site.md`. Suite : phase 2 bis de `immonova/ROADMAP.md`.
2. **Socle commun à tous les sites** : même stack que immonova (Next.js sur Vercel, Kinde pour l'authentification, PostHog pour la mesure, Prisma). Livrable : un gabarit de démarrage (à rattacher à un dossier ou dépôt, à décider) et une fiche « stack standard ». Les versions et réglages viennent d'`immonova2.0`, déjà durci (Next.js 16, 0 vulnérabilité).
3. **Reporting multi-sites** : un tableau de bord qui suit l'affluence de chaque site/API (visites, événements clés, demandes de contact), alimenté par PostHog (un projet par site) et par les formulaires Google. À cadrer : source de vérité des chiffres, accès à donner site par site (lecture seule uniquement, jamais de clé dans le dépôt).
4. **Application d'un ami « Zenhook »** (stats de différentes données) : à étudier comme brique de reporting. Inconnu à ce stade : fonctionnement, accès API ou export, conditions d'usage fixées avec l'ami. À renseigner, rien n'est vérifié.
5. **Instagram (3 comptes)** : (a) ancien métier de courtier en prêt immobilier, public immobilier ; (b) `immonova`, renommé mais non développé ; (c) deux comptes de tutos web, avec un début d'audience. Idée : chaque compte alimente un site (lien, `utm_*`), et les tutos servent de vitrine aux projets. Nom exact des comptes et chiffres d'audience à renseigner.
6. **Objectif global** : générer du passage sur les sites/API, puis des revenus ou du flux réorientable. Les modèles économiques sont à choisir par projet (voir phase 3 d'immonova).

Dépendances : 2 et 3 avant de lancer de nouveaux sites ; 5 dépend du cadrage de 1.
