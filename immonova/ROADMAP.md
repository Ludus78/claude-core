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
- [x] Corrections rapides issues de `docs/audit-site.md` : images de partage, sitemap sans pages privées, consentement avant PostHog (2026-11-01)
- [ ] Appliquer les corrections issues des audits, une par tâche (validation requise)

## Phase 2 : produit (chaque choix est à valider)

- [ ] Choisir les 3 usages prioritaires du site (acheter, estimer, investir en locatif, gérer un bien…) et les écrire dans `docs/produit.md` (validation requise)
- [ ] Unifier l'expérience des calculateurs : un même format de résultat, de partage et d'export PDF (`jspdf` est déjà présent) (validation requise)
- [ ] Sauvegarde des simulations liée au compte Kinde, avec historique dans `dashboard` (validation requise)
- [ ] Estimation : vérifier la fiabilité et la licence des sources de `market-rates` (à vérifier à la source) et afficher leur origine (validation requise)
- [ ] Actualités : définir qui alimente `seed-news` et à quel rythme, puis automatiser (validation requise)
- [ ] Assistant IA (`chat`) : cadrer le coût, les limites d'usage et l'avertissement « pas un conseil » (validation requise)
- [x] Mesure des calculateurs : `calculator_viewed`, `calculator_used` (première saisie), `calculator_pdf_exported`, `calculator_shared` (canal), `calculator_saved`, chacun avec la propriété `calculator` (achat, pret, locatif, viager) et jamais de montant. Branchés dans `CalculatorActions.tsx` ; envoi vérifié en local après accord, noms exacts des événements à contrôler dans PostHog (Activity) après déploiement (2026-11-01)
- [x] Base en ligne et reports : Prisma passé en Postgres (`POSTGRES_URL`), modèle `Lead` (e-mails du popup, consentement newsletter), suivi des connexions Kinde (`lastLoginAt`, `loginCount`), page `/admin` et export CSV des inscrits newsletter, réservés aux e-mails de `ADMIN_EMAILS`. Anciennes migrations SQLite archivées dans `prisma/migrations-sqlite-archive/`. Tables créées dans la base Neon existante et en ligne, `/admin` vérifié avec un vrai e-mail et une vraie connexion (2026-11-01)
- [x] `prisma/dev.db` et `dev.db-journal` retirés du suivi git (fichiers gardés sur le disque, `*.db` ignoré). Ils restent dans l'historique d'un commit ; le dépôt GitHub semble public, donc tout contenu éventuel est à considérer comme exposé (non lus) (2026-11-01)
- [x] Page `/confidentialite` rédigée (liens depuis le bandeau, le popup et le pied de page) ; case newsletter du popup décochée par défaut (elle était pré-cochée, non conforme). **Brouillon à relire et valider avant publication** : base légale, durées de conservation, statut de l'éditeur (2026-11-01)
- [ ] Brancher l'outil de newsletter sur l'export CSV des inscrits (outil à choisir, validation requise)
- [ ] Mesure : événements PostHog pour les demandes de contact (`contact`, `leads`) et l'inscription (validation requise)

## Phase 2 bis : cadrage de la 2.0 (objectif : audience récurrente)

Idées du 2026-10-31, à trier avec `docs/audit-site.md`. Chaque choix est à valider.

- [x] Trancher le positionnement : boîte à outils nationale, public primo-accédants et investisseurs locatifs, moins de 3 h par semaine, pas de revenu pour l'instant, décisions dans `docs/produit.md` (2026-10-31)
- [x] Réécrire titre, description et partage pour un public national (`app/metadata.ts`, canonical par page, image de partage = `hero-real-estate.jpg`) (2026-11-01)
- [x] Accueil réécrit pour primo-accédants et investisseurs (titre, accroche, cartes achat et locatif) ; promesse « Simulation PTZ » retirée du popup car aucun calculateur ne la calcule (2026-11-01)
- [ ] Accueil : décider du popup e-mail avant les calculateurs (`app/page.tsx` demande l'e-mail aux visiteurs non connectés avant d'ouvrir une calculette, ce qui freine l'usage ; piste : laisser l'accès libre et proposer l'e-mail après le résultat) (validation requise)
- [x] Consentement PostHog : bandeau Accepter/Refuser, rien (ni requête, ni cookie) avant l'accord, lien « Gérer les cookies » en pied de page, vérifié en local sur le build (2026-11-01). Reste : page de politique de confidentialité à écrire (à valider, texte juridique)
- [x] Sitemap sans `/dashboard`, `/inscription`, `/reset-password` (2026-11-01)
- [ ] Mécanisme de retour : newsletter ou alertes (taux, prix) liées au compte Kinde, avec consentement (validation requise)
- [ ] Fusionner les calculateurs en un seul parcours avec résultat sauvegardable (validation requise)
- [ ] Pont Instagram : compte `immonova` à relancer, liens avec paramètres `utm_*` suivis dans PostHog, pages d'atterrissage par contenu (validation requise)
- [ ] Brancher le site sur le reporting commun (voir `_hub/PROJETS.md`, idées en attente) (validation requise)

- [x] Guide primo-accédant, ossature : sommaire `/achat` et une page par étape `/achat/[etape]` (contenu dans `app/achat/etapes.ts`, plan dans `docs/guide-primo-accedant.md`) ; étapes 1 (budget) et 2 (financement) rédigées, **à relire et valider** avant publication (2026-11-01)
- [x] Guide primo-accédant : étapes 3 (recherche et visite) et 4 (offre) rédigées, **à relire et valider** avant publication (2026-11-01)
- [x] Guide primo-accédant : étapes 5 (compromis) et 6 (prêt) rédigées, **à relire et valider** avant publication (2026-11-01)
- [x] Guide primo-accédant : étapes 7 (acte chez le notaire) et 8 (après l'achat) rédigées, **à relire et valider** avant publication ; les 8 étapes existent (2026-11-01)
- [ ] Guide primo-accédant : glossaire de l'immobilier et listes à imprimer, liens entre étapes et calculettes (validation requise)
- [x] Refonte du design, direction B « chaleureuse » choisie (crème, vert, jaune doux, police Nunito, pilules et grands arrondis) : base (Tailwind, `globals.css`, bloc `@theme` invalide retiré, mode sombre retiré), en-tête, pied de page, accueil, sommaire et pages du guide, vérifiés sur téléphone et ordinateur ; **à relire avant publication** (2026-11-01)
- [ ] Refonte du design, suite : calculettes (achat, locatif, viager, prêt), estimation, actualités, contact, tableau de bord, popups (promo calculette, e-mail, cookies : trois fenêtres qui s'empilent, à simplifier), `app/head.tsx` inutilisé (validation requise)
- [ ] Assistant en ligne : le rendre bien plus fiable (modèle récent, appui sur le contenu du guide, limites de débit et de coût, avertissement « pas un conseil ») (validation requise)

## Phase 3 : croissance (à décider après la phase 2)

- [ ] Contenu SEO : guides et pages par ville ou par thème (validation requise)
- [ ] Qualification des demandes (`leads`) et suivi (validation requise)
- [ ] Modèle économique : partenaires, annonces, ou autre (validation requise)

## Légende

`- [ ]` à faire · `- [x]` fait (date et pull request notées en fin de ligne par `/next`).
