# La Taverne des Souvenirs

Page privée où chaque ami décrit son héros (nom, race, sexe, classe, allure, équipement, caractère, histoire) et raconte une ou plusieurs histoires vécues ensemble. Elle alimente la BD Memories (voir `../CLAUDE.md`).

Stack : Next.js 16, React 19, Prisma, PostgreSQL (Neon), Zod. Aucun compte : une porte à mot de passe partagé, puis un lien privé par aventurier.

## Fonctionnement

- `/` : la porte. Le mot de passe est la variable `ACCES_TAVERNE`. Le cookie ne garde qu'une empreinte.
- `/aventurier/nouveau` : la fiche (réservée à qui a passé la porte).
- `/aventurier/<token>` : le lien privé de l'ami. Il y voit sa fiche, ses récits, et peut en ajouter. Le jeton est la clé : à ne pas partager.
- Données : tables `Aventurier` et `Recit` (`prisma/schema.prisma`). Les listes de races et de classes sont dans `src/warcraft.ts` (à vérifier à la source, noms français à confirmer).

## Mise en route

1. Créer une base PostgreSQL (Neon, via Vercel Storage ou neon.tech) et copier son URL.
2. Copier `.env.example` en `.env` et remplir `POSTGRES_URL` et `ACCES_TAVERNE` (une phrase longue). `.env` n'est jamais commité.
3. `npm install`, puis `npx prisma migrate deploy` pour créer les tables.
4. `npm run dev` pour essayer en local.

## Déploiement Vercel

1. Nouveau projet Vercel depuis ce dépôt GitHub, **Root Directory : `Memories/taverne`**.
2. Variables d'environnement du projet : `POSTGRES_URL` et `ACCES_TAVERNE`.
3. Déployer. L'adresse en `.vercel.app` suffit, aucun nom de domaine à acheter.

## Données et vie privée

Les réponses sont des données de personnes réelles : elles ne vivent que dans la base, jamais dans le dépôt (public). La page n'est pas indexée (`robots: noindex`). Consulter les réponses : console de la base (Neon) ou `npx prisma studio` en local.

## Limites connues

- Pas de modification d'une fiche après envoi (seulement l'ajout de récits). À ajouter si besoin.
- Pas de limitation de débit sur la porte : choisir un mot de passe long. Le cookie d'accès n'est qu'une empreinte du mot de passe, révoquée seulement en changeant le mot de passe.
- Le jeton du lien privé n'est affiché qu'une fois, à la création : sans lui, un ami ne retrouve pas sa fiche (il faut alors la retrouver dans la base). Un double clic sur l'envoi crée deux fiches.
- Aucune limite sur le nombre de récits par lien : acceptable pour un petit groupe d'amis.
- Pas de suppression en libre-service : pour retirer une fiche, la supprimer dans la base (les récits suivent).
