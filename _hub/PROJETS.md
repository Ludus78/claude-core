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

_Aucune pour l'instant. Ajouter ici les idées pas encore devenues des projets._
