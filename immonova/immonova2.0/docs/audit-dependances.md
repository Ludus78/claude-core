# Audit des dépendances (2026-10-31)

Commande : `npm audit` dans `immonova2.0/`. Les faits sur les correctifs viennent de la sortie de `npm audit` : à vérifier à la source pour chaque avis avant une mise à jour majeure.

## Résultat

| | Avant | Après |
|---|---|---|
| Critiques | 7 | 5 |
| Élevées | 13 | 3 |
| Modérées | 7 | 2 |
| Faibles | 2 | 1 |
| **Total** | **29** | **11** |

Corrigé sans changer de version majeure : mise à jour du `package-lock.json` (`npm update` ciblé, `package.json` inchangé), puis Next.js 15.2.3 vers 15.5.28 (commit précédent). Vérifié : 12 tests, build, 33 pages générées.

## Ce qui reste (11) et pourquoi

| Paquet | Gravité | Origine | Piste |
|---|---|---|---|
| `next-auth`, `@auth/core`, `@auth/prisma-adapter`, `cookie`, `uuid` (indirect) | critique | `src/lib/auth.ts`, `src/app/api/real-estate/route.ts`, `src/types/next-auth.d.ts` | Retirer `next-auth` (Kinde retenu, voir la roadmap) |
| `bcrypt` puis `@mapbox/node-pre-gyp` puis `tar` | critique et élevée | `bcrypt` n'est importé que par `src/lib/auth.ts` | Retirer `bcrypt` avec `next-auth` |
| `nodemailer` | élevée | Aucun import trouvé dans le code (recherche `from 'nodemailer'`) | Retirer s'il est confirmé inutilisé |
| `jspdf` 3.0.1 | critique | `app/components/CalculatorActions.tsx` (export PDF des calculateurs) | Passer en 4.x (version majeure) et tester l'export à la main |
| `next` et `postcss` (intégré à Next) | modérée et élevée | Next 15.5.28 | Migration vers Next 16 : projet à part. Vercel accepte 15.5.28 |

## Constat sur `src/`

`src/app/api/real-estate` n'apparaît pas dans les routes construites par Vercel : Next.js ne construit pas `src/app/` quand `app/` existe à la racine (à vérifier à la source dans la documentation de Next.js). `src/app/`, `src/lib/` et `src/types/` seraient donc du code mort, et c'est lui qui retient `next-auth`, `@auth/*` et `bcrypt`.

## Décisions à prendre

1. Supprimer le code mort de `src/` et retirer `next-auth`, `@auth/prisma-adapter`, `bcrypt` et `nodemailer` : supprime 8 des 11 vulnérabilités.
2. Mettre `jspdf` en 4.x : demande un test manuel de l'export PDF.
3. Next 16 : à planifier plus tard.
