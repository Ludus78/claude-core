# Audit SEO, performance et accessibilité

Lecture du code seule, aucune modification de l'application. État au 2026-11-09. Pas de Lighthouse ni de mesure réelle : tout ce qui touche aux temps de chargement et aux contrastes est **à vérifier avec Lighthouse / PageSpeed** sur la version déployée.

## Ce qui est en place

- `app/metadata.ts` : titre avec gabarit `%s | Immonova`, description, Open Graph, Twitter, `robots` indexables, `metadataBase` = `https://immonova.org`.
- `lang="fr"` sur `<html>`, polices via `next/font` (`display: swap`).
- `public/robots.txt` : exclut `/api`, `/dashboard`, `/admin`, `/auth`, `/reset-password`.
- Sitemap généré après le build (`next-sitemap`, 25 URL, dont les 8 étapes du guide).
- Métadonnées propres sur `/achat`, `/achat/[etape]`, `/vente`, `/qui-suis-je`, `/confidentialite`.

## Problèmes constatés (par priorité)

### Élevée

1. **Pages sans titre ni description propres.** 13 pages sont des composants client (`'use client'`) et ne peuvent pas exporter `metadata` : accueil, `/actualites` (+ `[id]`), `/calculette`, `/calculateurs`, `/calculateurs/pret`, `/calculette-locative`, `/calculette-viager`, `/contact`, `/documents`, `/dashboard`, `/inscription`, `/reset-password`. Elles héritent du titre par défaut. Les pages `estimation`, `frais-annexes`, `diagnostics`, `mise-en-valeur` n'exportent pas de `metadata` non plus (à confirmer page par page). Conséquence : plusieurs pages d'outils avec le même titre, notamment les **trois pages concurrentes du simulateur de prêt** (voir `pages.md`).
2. **Canonical relatif** : `alternates.canonical: './'` dans le layout. Résolu avec `metadataBase`, il donne l'URL de la page courante, ce qui convient, mais ne règle pas les doublons du simulateur (pas de canonical vers une page unique). À décider avec la fusion des doublons.
3. **Image Open Graph de 1200×630 déclarée mais non vérifiée** : `/images/maisons/maison-05.jpg` existe (≈ 100 Ko), sa taille réelle en pixels n'a pas été contrôlée. `app/head.tsx` (ignoré par Next.js) pointe vers `/images/hero-real-estate.jpg` : reste inutile.
4. **Lien mort dans la navigation** : `Navigation.tsx` (l. 42 et 59) pointe vers `/diagnostic`, la page est `/diagnostics`. Mauvais pour les utilisateurs et pour l'exploration.
5. **Mention « Paris »** dans les métadonnées de `/vente` (« Expert Immobilier Paris ») alors que le site se présente comme national : incohérence de positionnement.

### Moyenne

6. **Sitemap** : `lastmod` forcé à la date du jour pour toutes les URL (`next-sitemap.config.cjs` + `scripts/fix-sitemap-dates.js`), `changefreq: daily` et `priority: 0.7` partout. Google ignore ces valeurs quand elles sont fausses ; un `lastmod` mensonger peut réduire la confiance accordée au sitemap. Les articles `/actualites/[id]` n'y figurent pas. `/inscription` est exclu du sitemap mais pas de `robots.txt`. Les fichiers `public/sitemap*.xml` sont versionnés alors qu'ils sont régénérés au build.
7. **`robots.txt` généré et versionné** : `public/robots.txt` est la sortie de `next-sitemap` (`generateRobotsTxt: true`), régénérée à chaque build, comme les sitemaps : à ne plus versionner. La ligne `Host:` n'est pas lue par Google.
8. **Données structurées absentes** (aucun JSON-LD). Utiles : `Organization`, `BreadcrumbList` (guide d'achat), `Article` (actualités), `FAQPage` si une FAQ est ajoutée.
9. **Titre `<h1>`** : présent sur l'accueil et sur `/vente` (dans `VenteClient`). Seules `inscription` et `reset-password` n'en ont pas, sans enjeu SEO car privées.

### Performance

10. **Images lourdes** : `public/hero-image.jpg` (≈ 2,4 Mo) et `public/images/hero-real-estate.jpg` (≈ 2,5 Mo). Si l'accueil les charge, c'est le principal frein au LCP. À convertir en WebP/AVIF et à servir via `next/image` avec `priority` pour l'image au-dessus de la ligne de flottaison. Le dossier `maisons/` (≈ 100 Ko par image) est correct.
11. **Balises `<img>` brutes** dans `actualites/page.tsx` et `actualites/[id]/page.tsx` (3 occurrences) au lieu de `next/image` : pas de redimensionnement ni de chargement différé automatique.
12. **Fichiers inutiles dans `public/`** : `file.svg`, `globe.svg`, `next.svg`, `vercel.svg`, `window.svg`, `news-prices.jpg` (0 octet), `profile.jpg` (14 octets, probablement cassé).
13. **Pages client** : tout le contenu des outils est rendu côté client ; le HTML initial est mince. Pour le SEO, le texte explicatif des calculettes devrait être rendu côté serveur (composant serveur autour du composant interactif).

### Accessibilité

14. Les `alt` des `<img>` d'actualités sont renseignés (titre de l'article). Les composants `Image` du tableau de bord et de la navigation n'ont pas été tous vérifiés (« à contrôler à la main »).
15. **Contrastes** : non mesurables sans rendu. Points à contrôler : texte gris clair sur fond blanc (`text-gray-400`, 15 occurrences) et texte blanc sur la photo d'accueil.
16. Navigation mobile, focus visible et libellés des champs de formulaire (`contact`, simulateurs) : non vérifiés, à tester au clavier et avec un lecteur d'écran.

## Corrections proposées (chacune devient une tâche à valider)

1. Ajouter des `metadata` à toutes les pages d'outils : passer en composant serveur + composant client, ou `layout.tsx` par dossier avec les métadonnées.
2. Trancher les doublons du simulateur de prêt (une page, redirections 301 des autres, canonical).
3. Corriger le lien `/diagnostic` → `/diagnostics`.
4. Retirer « Paris » des métadonnées de `/vente` si le positionnement est national (décision produit).
5. Sitemap : vrai `lastmod`, retirer `changefreq`/`priority`, ajouter les articles, ne plus versionner `public/sitemap*.xml`.
6. Compresser les images d'accueil, passer les `<img>` en `next/image`, supprimer les fichiers vides ou inutiles de `public/`.
7. Ajouter du JSON-LD (`Organization`, `BreadcrumbList`, `Article`).
8. Mesurer avec Lighthouse sur le site déployé, avant et après.
