# claude-core

Monorepo de projets personnels. **Un dossier = un projet indépendant** (son propre `package.json`, npm). Pas de configuration partagée, pas de CI. Chaque projet a son `CLAUDE.md` : le lire avant de travailler dedans.

| Dossier | Nature |
|---|---|
| `Confio/` | Extension Chrome anti-phishing pour Gmail (Vite, TypeScript) |
| `immonova/` | Site immobilier : `immonova2.0` active (Next.js, Prisma), `OldVersion` figée |
| `SeanceClub/` | Cadrage d'une plateforme pour cinéphiles (documents, schéma SQL) |
| `Memories/` | Projet de BD sur des souvenirs de WoW (pas de code) |
| `space-atlas/` | Globe des orbites + observatoire spatial européen (recherche) |

## Règles générales

- Ne travailler que dans le projet demandé. Ne rien modifier ailleurs.
- Git : on travaille sur des branches `feat/...` créées depuis `develop`, avec une pull request. `develop` est fusionnée dans `main` par pull request. **Jamais de push direct sur `main`.**
- Demander confirmation avant : suppression de fichiers, migration, nouvelle dépendance, push.
- Jamais de secret (`.env`, clés, tokens) dans un fichier, un commit ou une réponse. Ne pas lire `.env`.
- Réponses courtes : ce qui a été fait, le résultat des vérifications, les points à contrôler.
- Tout fait technique non vérifié (quota, licence, API) est signalé « à vérifier à la source ».

## Économie de tokens

- Modèle par défaut : Sonnet (`.claude/settings.json`). Opus seulement pour l'architecture ou un bug tordu (`/model`). Les tâches mécaniques passent par les sous-agents Haiku.
- **Une session = une tâche.** `/clear` entre deux sujets, `/compact` à un point logique d'une longue tâche, `/context` pour voir ce qui consomme, `/cost` ou `/stats` pour le suivi.
- Ouvrir Claude Code **dans le dossier du projet** plutôt qu'à la racine : moins de contexte.
- Lire des fichiers ciblés, pas tout le dépôt. Garder les `CLAUDE.md` courts.
- Désactiver les connecteurs MCP inutilisés.

## Sous-agents (`.claude/agents/`)

- `reviewer` (Sonnet) : relit un diff avant commit, sans rien modifier.
- `tester` (Haiku) : écrit et lance les tests, rapporte les échecs.
- `explorer` (Haiku) : fouille le code et résume, sans polluer la session principale.
