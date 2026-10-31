# Audit de immonova.org (2026-10-31)

Audit en lecture seule : page d'accueil et `/actualites` lues en ligne, code lu dans `immonova2.0/`. Aucun outil externe (Search Console, PageSpeed) : les mesures de trafic et de performance sont **à relever à la source**.

## Constats

### Contenu et audience récurrente
- **Actualités figées** : les 7 articles datent de janvier-février 2025 (plus de 8 mois sans nouveauté). Une page qui ne bouge pas ne fait pas revenir. C'est le premier frein à une audience récurrente.
- **Aucune raison de revenir** : pas de newsletter, pas d'alerte (taux, prix), pas de contenu daté ou saisonnier.
- **Outils sans suite** : les calculateurs donnent un résultat, mais rien ne propose de le sauvegarder ou d'être relancé (la sauvegarde liée au compte Kinde est déjà en phase 2 de la roadmap).
- **Pas d'article de fond** : pas de guides par thème ou par ville (phase 3 de la roadmap).

### Positionnement
- Le titre et la description disent « Votre Expert Immobilier **à Paris** » alors que le contenu est national (calculateurs, PTZ). Promesse floue : service local, média ou boîte à outils ?
- Quatre pages de calculateurs probablement redondantes : `calculette/`, `calculateurs/`, `calculateurs/pret/`, `calculette-locative/`, `calculette-viager/`.

### SEO
- `public/sitemap-0.xml` : toutes les dates à `2025-04-09`, `changefreq` « daily » partout (faux).
- Le sitemap liste `/dashboard/`, `/reset-password/` et `/inscription/`, alors que `robots.txt` interdit `/dashboard/*` : contradiction. Les pages privées n'ont rien à faire dans un sitemap.
- `robots.txt` : la directive `Host:` n'est pas reconnue par Google (inoffensive).
- `app/metadata.ts` référence `/og-image.jpg` et `/twitter-image.jpg` : **ces fichiers n'existent pas dans `public/`**. Les partages sur les réseaux n'ont donc pas d'image.
- Le sitemap est statique (`public/`), il ne suit pas les nouvelles pages.

### Mesure
- PostHog est installé (`PostHogProvider.tsx`, hébergement UE, passage par `/ingest`), les pages vues sont envoyées. Les événements utiles (usage des calculateurs, envoi de contact) ne sont pas définis (phase 2).
- Aucun bandeau de consentement trouvé dans `app/` (recherche « cookie / consent / opt_in » sans résultat). PostHog est initialisé sans condition. **Risque RGPD/CNIL** à confirmer dans l'audit RGPD déjà prévu.
- Aucune Google Search Console ni Google Analytics visible dans le code (à confirmer côté compte).

### Réseaux sociaux
- Aucun lien vers Instagram ni autre réseau sur la page d'accueil.

## Pistes pour la 2.0 (à décider)

1. Choisir un positionnement (national, boîte à outils + média), puis réécrire titre, description, accueil.
2. Un contenu qui se renouvelle sans effort : actualités alimentées automatiquement (`seed-news` + source fiable, licence à vérifier) et un rendez-vous récurrent (point mensuel taux et prix).
3. Un moyen de relancer : newsletter ou alerte e-mail liée au compte Kinde, après consentement.
4. Fusionner les calculateurs en un seul parcours, avec résultat sauvegardable et partageable.
5. Capter l'audience Instagram vers le site (lien en bio, pages d'atterrissage par post, suivi `utm_*` dans PostHog).
6. Corriger les bases SEO : sitemap généré (`app/sitemap.ts`), images de partage, retrait des pages privées.

## Corrections rapides (à valider, une tâche chacune)

- Ajouter les deux images de partage manquantes.
- Générer le sitemap dynamiquement et retirer les pages privées.
- Ajouter le consentement avant l'initialisation de PostHog.
