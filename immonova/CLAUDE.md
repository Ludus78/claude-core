# immonova

Site d'aide à l'achat et à la gestion immobilière (calculateurs, estimation, actualités, espace utilisateur).

## Deux versions

- **`immonova2.0/`** : version active. C'est ici qu'on travaille.
- **`OldVersion/`** : ancienne version, conservée pour référence. Ne pas la modifier.
- À la racine d'`immonova/` : images, captures et PDF sources. Ce sont des ressources, pas du code.

## Stack (immonova2.0)

Next.js 16 (App Router, routes en français dans `app/`), React 19, TypeScript, Prisma (modèles `Contact`, `NewsArticle`, `Simulation`, `User`, `RealEstate`), Tailwind 3, déploiement Vercel (`vercel.json`). npm.

## Commandes (depuis `immonova/immonova2.0/`)

- `npm run dev`
- `npm run build` : `prisma generate && next build`
- `npm test` : Vitest (calcul de prêt). Pas de lint pour l'instant : `next lint` n'existe plus dans Next 16.

## Règles

- Un hook Husky lance `npm run build` à chaque commit : les commits sont lents, ne jamais le contourner avec `--no-verify`.
- Toute modification du schéma Prisma est une migration : demander confirmation avant.
- Aucune clé d'API ni variable d'environnement dans le code ou les messages (`.env` est ignoré).
- Pas de nouvelle dépendance sans dire laquelle et pourquoi.

## À clarifier avant d'y toucher

- Doublons de configuration : `next.config.js` et `next.config.mjs`, `next-sitemap.config.js` et `.cjs`, `app/globals.css.save`.
- Deux systèmes d'authentification présents dans les dépendances (`next-auth` et Kinde) : lequel est réellement utilisé ?
