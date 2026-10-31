# PROJETS

Registre des projets de `claude-core`. Mis à jour par la commande `/status` (voir `_hub/CLAUDE.md`).

**Dernière mise à jour : 2026-10-29** (synthèse space-atlas intégrée).
Statuts : `idée` · `étude` · `en cours` · `pause`.

## Vue d'ensemble

| Projet | Chemin | Stack | Statut |
|---|---|---|---|
| Confio | `Confio/` | TypeScript, Vite, Vitest | en cours |
| immonova | `immonova/immonova2.0/` | Next.js 15, React 19, Prisma, Tailwind | en cours (à confirmer) |
| SeanceClub | `SeanceClub/` | Cible : Next.js, PostgreSQL, Socket.IO | étude (cadrage avancé) |
| Memories | `Memories/` | Aucune (BD) | étude |
| space-atlas | `space-atlas/` | Cible : Next.js, TypeScript, Cesium ou Three.js | étude (recherche) |

## Détail

### Confio
- **Nature** : extension Chrome qui signale les mails Gmail suspects pour des utilisateurs non techniques.
- **État** : code et tests en place (signaux de détection : lien, expéditeur, urgence, authentification ; scoring de risque ; client Gmail ; popup).
- **Roadmap** : `Confio/ROADMAP.md`
- **Reste à faire** : tests des modules `auth`, `sender`, `urgency`, `gmail/headers`, `gmail/client`, script de lint (voir la roadmap). Roadmap produit à définir.
- **Prochaine action** : tests de `detection/signals/auth.ts` (première tâche de `/next Confio`).
- **À clarifier** : `claudetest.md` contient du TypeScript ; `sersestechestestoile` est un fichier au nom inexpliqué.

### immonova
- **Nature** : site d'aide à l'achat et à la gestion immobilière (calculateurs, estimation, actualités, espace utilisateur). `immonova2.0` est la version active, `OldVersion` est figée.
- **État** : application Next.js avec plusieurs sections (calculateurs, estimation, diagnostics, documents, dashboard, inscription), base Prisma, déploiement Vercel.
- **Roadmap** : `immonova/ROADMAP.md`
- **Reste à faire** : documenter les routes API, trancher l'authentification, supprimer les doublons de configuration, tests (voir la roadmap). Roadmap produit à définir.
- **Prochaine action** : documenter les routes API dans `immonova2.0/docs/api.md`.
- **À clarifier** : deux systèmes d'authentification dans les dépendances (`next-auth` et Kinde) ; fichiers de configuration en double (`next.config.js` et `.mjs`, `next-sitemap.config.js` et `.cjs`).

### SeanceClub
- **Nature** : plateforme sociale francophone pour cinéphiles (score cinéphile, avis, calendrier des sorties, séances avec chat en direct).
- **État** : cadrage terminé (concept, maquettes ordinateur, business plan, spécification du score, schéma PostgreSQL de 27 tables, module de score TypeScript avec 11 tests, projet de démarrage intégré au dépôt). **Aucune ligne de l'application web n'est écrite.**
- **Reste à faire** (source : `CONTEXTE.md`) : licence commerciale TMDB, marque et domaine, liste de référence, documents juridiques et accord parental, règles du chat, back-office minimal, maquettes manquantes, hébergement, vraie liste d'attente. Puis 7 phases, environ 22 semaines à 10 h par semaine.
- **Roadmap** : `SeanceClub/ROADMAP.md` (source : `CONTEXTE.md`). Base technique intégrée : `db/`, `packages/score/`, `docker-compose.yml`, `apps/` vide.
- **Prochaine action** : phase 0 (validation) : écrire à TMDB, vérifier la marque, mettre en place une vraie liste d'attente.
- **Dépendances externes** : licence TMDB et droits de la liste de référence, à vérifier à la source.

### Memories
- **Nature** : BD humoristique et fantasy tirée de 15 ans de souvenirs de WoW entre amis.
- **État** : format retenu (strips et planches), une maquette de planche de 6 cases faite, 5 personnages définis. Aucune vraie anecdote écrite, aucun illustrateur trouvé.
- **Reste à faire** : collecter les histoires, fiches de personnage, accord du groupe, choix de l'univers (WoW ou monde parodique), description de style commune, choix du dessin, premier script, choix de diffusion.
- **Roadmap** : `Memories/ROADMAP.md`. Base : dossiers `personnages/`, `anecdotes/`, `style/`, `planches/` avec modèles.
- **Prochaine action** : collecter les premières anecdotes auprès du groupe.
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
