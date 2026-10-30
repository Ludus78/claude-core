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
- [ ] Audit des dépendances : `npm audit` signale 30 vulnérabilités (8 critiques, 15 élevées) lors de l'installation sur Vercel. Rapport dans `docs/audit-dependances.md`, puis mises à jour une par une (validation requise)
- [x] Rétablir un build reproductible : `lib/` et `src/lib/` récupérés depuis l'ancien dépôt `Ludus78/immonova` et versionnés, `.gitignore` corrigé (`/lib/`). Le build passe avec les variables Kinde (`KINDE_*`) définies ; sans elles, il échoue à la collecte des pages (2026-10-31)
- [ ] Appliquer les corrections issues des audits, une par tâche (validation requise)

## Phase 2 : produit (chaque choix est à valider)

- [ ] Choisir les 3 usages prioritaires du site (acheter, estimer, investir en locatif, gérer un bien…) et les écrire dans `docs/produit.md` (validation requise)
- [ ] Unifier l'expérience des calculateurs : un même format de résultat, de partage et d'export PDF (`jspdf` est déjà présent) (validation requise)
- [ ] Sauvegarde des simulations liée au compte Kinde, avec historique dans `dashboard` (validation requise)
- [ ] Estimation : vérifier la fiabilité et la licence des sources de `market-rates` (à vérifier à la source) et afficher leur origine (validation requise)
- [ ] Actualités : définir qui alimente `seed-news` et à quel rythme, puis automatiser (validation requise)
- [ ] Assistant IA (`chat`) : cadrer le coût, les limites d'usage et l'avertissement « pas un conseil » (validation requise)
- [ ] Mesure : lister les événements PostHog utiles (usage des calculateurs, demandes de contact) (validation requise)

## Phase 3 : croissance (à décider après la phase 2)

- [ ] Contenu SEO : guides et pages par ville ou par thème (validation requise)
- [ ] Qualification des demandes (`leads`) et suivi (validation requise)
- [ ] Modèle économique : partenaires, annonces, ou autre (validation requise)

## Légende

`- [ ]` à faire · `- [x]` fait (date et pull request notées en fin de ligne par `/next`).
