# Audit de la structure : `app/` et `src/app/`

Lecture du code et de la documentation de Next.js, aucune modification de l'application. État au 2026-11-04.

## Question

`src/app/` ne contenait que `api/real-estate` et `PropertyCard.tsx`. Next.js l'utilisait-il à côté de `app/` ?

## Réponse : non, `src/app/` était ignoré

La documentation de Next.js livrée avec la version installée (16.4.x), `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/src-folder.md`, dit : « `src/app` or `src/pages` will be ignored if `app` or `pages` are present in the root directory. » (à relire à la source si la version de Next.js change).

Conséquences, constatées avant la suppression :

- La route `api/real-estate` de `src/app/` n'a jamais été servie : l'application n'exposait pas `/api/real-estate`.
- `PropertyCard.tsx`, `src/lib/` et `src/types/` n'étaient utilisés par aucune page de `app/`.

Ce dossier a été supprimé le 2026-10-31 (commit `bf46043`, avec `next-auth`, `bcrypt` et `nodemailer`). **Il n'existe plus de dossier `src/` : le problème est résolu.**

## Structure actuelle (racine de `immonova2.0/`)

| Dossier | Contenu |
|---|---|
| `app/` | Pages, routes API (`app/api/`), composants propres aux pages (`app/components/`), utilitaires (`app/utils/`) |
| `components/ui/` | Composants d'interface partagés |
| `lib/` | `prisma.ts`, `admin.ts`, `utils.ts`, `actualites/` |
| `types/` | `bcryptjs.d.ts` |
| `prisma/`, `public/`, `scripts/`, `docs/` | Base, ressources, scripts, documentation |

L'alias `@/*` de `tsconfig.json` pointe vers la racine (`./*`), ce qui est cohérent avec cette structure sans `src/`.

## Points restants (aucun n'est bloquant)

1. **`types/bcryptjs.d.ts`** : déclaration de types d'un paquet (`bcryptjs`) dont les dépendances ont été retirées. Confirmé inutilisé (aucun usage dans le code, `package.json` ni le lockfile) ; suppression à valider.
2. **Deux dossiers de composants** : `components/ui/` à la racine et `app/components/`. Pas une erreur, mais deux endroits où chercher. À décider si on garde les deux.
3. **`app/head.tsx`** (reste inutilisé, déjà signalé dans la roadmap) et `app/components/Navigation.tsx` (voir `docs/pages.md`).
4. **`middleware.ts`** : déprécié dans Next.js 16 au profit de `proxy`, déjà noté dans la roadmap. S'il y a un jour un dossier `src/`, la documentation demande d'y placer ce fichier.
