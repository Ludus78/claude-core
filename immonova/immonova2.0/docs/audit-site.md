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

### Audience réelle (PostHog UE, projet 57808, relevé le 2026-10-31)
Lecture du tableau « My App Dashboard » (modèle par défaut), sans modification. Le fait que ce projet ne suive que immonova.org est **à confirmer**. Les chiffres viennent du texte de la page, donc approximatifs.
- **Visiteurs actifs par jour** : entre 0 et 5 en octobre. **Par semaine** : l'échelle monte jusqu'à 14 (août à octobre).
- **Tunnel de pages vues** : 10 personnes voient une première page, 3 une deuxième (30 %), 1 une troisième (10 %). Les visiteurs repartent presque tous après une page.
- **Rétention** : cohortes de 2 à 4 personnes, trop petites pour conclure.
- **Sources (14 jours)** : accès direct et `www.google.com`. Aucune venue visible d'Instagram.
- **Biais** : les visites du propriétaire et des tests ne sont pas exclues.
- **Manque** : aucun événement sur l'usage des calculateurs ni sur les envois de contact.

Conclusion : l'audience est de quelques personnes par semaine, sans habitude de retour. La 2.0 doit d'abord créer du trafic (Instagram avec liens `utm_*`, contenu régulier), puis mesurer ce qui est utile.

### Réseaux sociaux
- Le pied de page contient déjà des liens vers LinkedIn, GitHub et Instagram (`@ludvicdenis`). Correction du 2026-11-01 : une première version de cet audit disait le contraire, à tort.

## Suivi des corrections (2026-11-01)
- Fait : positionnement national dans les métadonnées, canonical par page, image de partage, sitemap sans pages privées, consentement PostHog (aucune requête ni cookie avant accord).
- Reste : texte de l'accueil, page de confidentialité, événements PostHog sur les calculateurs.

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
