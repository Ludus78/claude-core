# Roadmap immonova (immonova2.0)

Tâches tirées de l'état réel du dépôt (octobre 2026). La commande `/next immonova` prend la première tâche non cochée **sans** la mention « validation requise ».

## Phase 0 : clarifier l'existant

- [x] Documenter les routes API dans `immonova2.0/docs/api.md` : `auth`, `chat`, `contact`, `leads`, `market-rates`, `news`, `seed-news`, `simulations`, `web-search` (lecture du code, aucune modification de l'application) (2026-10-29)
- [x] Décider de l'authentification : Kinde retenu, `next-auth` à retirer plus tard (2026-10-30)
- [x] Supprimer `next-sitemap.config.js` et `app/globals.css.save` (inutilisés) (2026-10-30)
- [ ] Fusionner `next.config.js` et `next.config.mjs` (le `.mjs` porte la config Sentry, probablement ignorée) (validation requise)
- [ ] Migrer `src/app/api/real-estate/route.ts` de `next-auth` vers Kinde, puis retirer `next-auth` (validation requise : dépendance)
- [x] Hook Husky : on garde le build complet à chaque commit (2026-10-30)
- [x] Ajouter un script de test et les premiers tests (Vitest, calcul de prêt extrait dans `app/utils/pret.ts`, 12 tests ; `@types/node` passé en 22 car Vitest 5 l'exige) (2026-10-31)

## Phase 1 : assainir le site (aucune nouvelle fonction)

Audits en lecture seule d'abord : chacun produit un rapport dans `immonova2.0/docs/`, sans modifier l'application. Les corrections qui en découlent deviennent des tâches à valider.

- [ ] Audit des pages : lister les pages de `app/` et leur rôle dans `docs/pages.md`, repérer les doublons probables (`calculette/`, `calculateurs/`, `calculette-locative/`, `calculette-viager/`) (à confirmer)
- [ ] Audit des deux dossiers `app/` et `src/app/` : `src/app/` ne contient que `api/real-estate` et `PropertyCard.tsx`. Next.js l'utilise-t-il vraiment à côté de `app/` ? (à vérifier à la source, dans la documentation de Next.js). Rapport dans `docs/audit-structure.md`
- [ ] Audit de sécurité des routes API : authentification, validation des entrées, limites de débit, accès public ou non (surtout `seed-news`, `leads`, `chat`, `web-search`). Rapport dans `docs/audit-api.md`
- [ ] Audit SEO, performance et accessibilité des pages principales (balises, sitemap, images, contrastes). Rapport dans `docs/audit-seo.md`
- [ ] Audit RGPD : ce que PostHog, les formulaires (`contact`, `leads`) et les simulations enregistrent, et où figure le consentement. Rapport dans `docs/audit-rgpd.md`
- [x] Mettre à jour Next.js 15.2.3 vers 15.5.28 : Vercel bloquait le déploiement (« Vulnerable version of Next.js detected ») (2026-10-31)
- [x] Audit des dépendances : 29 vulnérabilités ramenées à 11 sans changement majeur, rapport dans `docs/audit-dependances.md` (2026-10-31)
- [x] Supprimer le code mort de `src/` (`src/app`, `src/lib`, `src/types`) et retirer `next-auth`, `@auth/prisma-adapter`, `bcrypt`, `nodemailer` (2026-10-31)
- [x] Migrer vers Next.js 16.4.3 : `npm audit` à 0 vulnérabilité. `middleware.ts` est déprécié (renommage en `proxy` à prévoir), à tester à la main : `/dashboard` sans session doit rediriger, `/api/simulations` sans session doit être refusé (2026-10-31)
- [ ] Remettre un lint : `next lint` n'existe plus dans Next 16 et le script a été retiré ; ESLint serait une nouvelle dépendance (validation requise)
- [x] Mettre `jspdf` en 4.2.1 : export PDF des calculateurs à tester à la main (2026-10-31)
- [x] Rétablir un build reproductible : `lib/` et `src/lib/` récupérés depuis l'ancien dépôt `Ludus78/immonova` et versionnés, `.gitignore` corrigé (`/lib/`). Le build passe avec les variables Kinde (`KINDE_*`) définies ; sans elles, il échoue à la collecte des pages (2026-10-31)
- [x] Audit du site en ligne (immonova.org) : contenu figé depuis début 2025, sitemap incohérent, images de partage absentes, pas de consentement PostHog, rapport dans `docs/audit-site.md` (2026-10-31)
- [ ] Corrections rapides issues de `docs/audit-site.md` : images de partage manquantes, sitemap dynamique sans pages privées, consentement avant PostHog (validation requise)
- [ ] Appliquer les corrections issues des audits, une par tâche (validation requise)

## Phase 2 : produit (chaque choix est à valider)

- [ ] Choisir les 3 usages prioritaires du site (acheter, estimer, investir en locatif, gérer un bien…) et les écrire dans `docs/produit.md` (validation requise)
- [ ] Unifier l'expérience des calculateurs : un même format de résultat, de partage et d'export PDF (`jspdf` est déjà présent) (validation requise)
- [ ] Sauvegarde des simulations liée au compte Kinde, avec historique dans `dashboard` (validation requise)
- [ ] Estimation : vérifier la fiabilité et la licence des sources de `market-rates` (à vérifier à la source) et afficher leur origine (validation requise)
- [ ] Actualités : définir qui alimente `seed-news` et à quel rythme, puis automatiser (validation requise)
- [ ] Assistant IA (`chat`) : cadrer le coût, les limites d'usage et l'avertissement « pas un conseil » (validation requise)
- [ ] Mesure : lister les événements PostHog utiles (usage des calculateurs, demandes de contact) (validation requise)

## Phase 2 bis : cadrage de la 2.0 (objectif : audience récurrente)

Idées du 2026-10-31, à trier avec `docs/audit-site.md`. Chaque choix est à valider.

- [ ] Trancher le positionnement (national ou Paris, boîte à outils ou média) et réécrire titre, description, accueil (validation requise)
- [ ] Mécanisme de retour : newsletter ou alertes (taux, prix) liées au compte Kinde, avec consentement (validation requise)
- [ ] Fusionner les calculateurs en un seul parcours avec résultat sauvegardable (validation requise)
- [ ] Pont Instagram : compte `immonova` à relancer, liens avec paramètres `utm_*` suivis dans PostHog, pages d'atterrissage par contenu (validation requise)
- [ ] Brancher le site sur le reporting commun (voir `_hub/PROJETS.md`, idées en attente) (validation requise)

## Phase 3 : croissance (à décider après la phase 2)

- [ ] Contenu SEO : guides et pages par ville ou par thème (validation requise)
- [ ] Qualification des demandes (`leads`) et suivi (validation requise)
- [ ] Modèle économique : partenaires, annonces, ou autre (validation requise)

## Légende

`- [ ]` à faire · `- [x]` fait (date et pull request notées en fin de ligne par `/next`).
