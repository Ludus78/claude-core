# À faire demain (point du 2026-11-01)

Légende : **Toi** = action que seul toi peux faire (comptes, secrets). **Claude** = ce que je fais ensuite.

## Avant tout : débloquer le push
Le dépôt a **3 commits locaux non poussés** (2 d'immonova, 1 de SeanceClub). Les pousser avant que la base d'immonova ait ses tables casserait le popup e-mail en ligne.

## immonova (priorité 1)
1. **Toi** : créer le fichier `immonova/immonova2.0/.env` avec la ligne `POSTGRES_URL=...`, copiée depuis Vercel (projet `immonova-omnb`, Storage, base `immonova`, section `.env.local`). Ne jamais la coller dans le chat.
2. **Toi** : dans Vercel, Settings, Environment Variables, ajouter `ADMIN_EMAILS` (ton e-mail Kinde). Vérifier aussi si `NEXT_PUBLIC_POSTHOG_KEY` existe : je ne l'ai pas vue dans la liste.
3. **Claude** : créer les tables dans la base Neon existante (migration `20261101000000_init_postgres`), s'arrêter si des tables du même nom existent, tester l'enregistrement d'un e-mail, puis pousser les 3 commits.
4. **Toi** : après le déploiement, contrôler `/admin`, le popup e-mail et les événements `calculator_*` dans PostHog (Activity).
5. **À valider ensuite** : retirer `prisma/dev.db` du suivi git (peut contenir de vraies données, non lu) ; page de confidentialité ; choix de l'outil de newsletter ; fusion des calculateurs.
6. **Toi (Instagram)** : remplacer le lien de la bio par `https://immonova.org/?utm_source=instagram&utm_medium=bio&utm_campaign=profil`.

## SeanceClub (priorité 2)
1. **Toi** : créer l'application « SeanceClub » dans Kinde (type Back-end web), callback `http://localhost:3000/api/auth/kinde_callback`, déconnexion `http://localhost:3000`, activer Google, Discord et e-mail. Copier les 4 valeurs dans `SeanceClub/apps/web/.env` (modèle : `.env.example`).
2. **Claude** (après accord pour la migration) : colonne `kinde_id` dans `users`, session côté serveur, puis formulaire d'inscription et écran de l'e-mail du parent.
3. **À décider** : réserve RGPD, un mineur de moins de 13 ans a déjà donné son e-mail à Kinde avant d'être refusé (suppression automatique ou mention dans la politique de confidentialité).
4. Toujours en attente de ta part : licence TMDB, marque et domaine, choix du service d'e-mails.

## Socle commun à tous les sites
- **Claude** : écrire la fiche « stack standard » (Next.js 16, Vercel, Kinde 2.13.2, PostHog, Prisma/Neon, ce qui est vérifié sur immonova et SeanceClub) et en tirer un gabarit de démarrage. Lieu du gabarit à décider.

## Reporting multi-sites
- **Toi** : le nom exact de l'app « Zenhook » de ton ami, comment elle récupère les données (API, export) et ce qu'il autorise.
- **Claude** : cadrer un tableau de bord (PostHog un projet par site, e-mails et connexions en base). Accès aux outils en lecture seule uniquement.

## Instagram
- **Toi** : nom et audience des 2 comptes de tutos web et du compte courtier, pour décider quel compte alimente quel site. Je n'ai lu que `@ludvicdenis` (Immonova, 924 abonnés).

## Confio
- **Claude** : prochaine tâche de `Confio/ROADMAP.md` (`/next Confio`) : tests des modules restants (`auth`, `sender`, `urgency`, `gmail/headers`) et script de lint. 5 faites, 3 à faire.

## space-atlas
- **Toi** : remplir `docs/research/` en commençant par `cesium-vs-threejs.md` et `celestrak-usage-policy.md`. Rien ne démarre côté code avant le choix Cesium ou Three.js. 7 faites, 9 à faire.

## Memories
- **Toi** : collecter les premières anecdotes du groupe. Aucune tâche cochée, 9 à faire, tout dépend de ce contenu.

## Rappels
- Les chiffres de licence, les offres gratuites (Neon, Kinde) et les règles des API sont **à vérifier à la source**.
- Une session = une tâche : `/clear` entre deux sujets.
