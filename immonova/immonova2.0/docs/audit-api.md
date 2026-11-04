# Audit de sécurité des routes API

Lecture du code de `app/api/`, `middleware.ts`, `lib/admin.ts` et `prisma/schema.prisma`, aucune modification de l'application, aucune route exécutée. État au 2026-11-04. Complète `docs/api.md` (qui date d'octobre : certaines routes ont changé depuis, et sa liste des routes qui écrivent des données personnelles dans les logs cite à tort `leads`, qui ne journalise que l'erreur). Les faits sur des services externes (Vercel, Kinde, Anthropic, Google) sont **à vérifier à la source**.

Les corrections ne sont pas faites : chacune est une tâche à valider.

## Synthèse par route

| Route | Accès réel | Validation | Limite de débit | Constat principal |
|---|---|---|---|---|
| `/api/chat` | public | minimale | non | **Appel payant ouvert à tous** (voir A1) |
| `/api/web-search` | public | minimale | non | Quota Google ouvert, route inutilisée par le site (A4) |
| `/api/contact` | public | aucune | non | Écriture libre, **échoue à la 2e demande d'un même nom ou e-mail** (A3) |
| `/api/leads` | public | e-mail validé, reste borné | non | Correct, sans limite de débit |
| `/api/auth/reset-password` | public | e-mail validé | non | Jeton écrit dans les logs (A2), route sans effet utile |
| `/api/seed-news` | public | sans objet | non | GET qui écrit en base (A5), inutilisée par le site |
| `/api/news` (GET) | public | `limit` non borné | non | `limit` sans plafond (M1) |
| `/api/news` (POST), `/api/news/[id]` (PUT, DELETE) | session Kinde + e-mail codé en dur | partielle | non | **Contrôle d'accès différent de `/admin`** (A6) |
| `/api/news/[id]` (GET) | public, brouillons réservés aux admins | `id` non validé | non | Correct |
| `/api/admin/newsletter` | admin (`ADMIN_EMAILS`), 404 sinon | sans objet | non | Correct : liste d'accès vide = personne |
| `/api/cron/actualites` | secret `CRON_SECRET` (comparaison à temps constant) | sortie du modèle filtrée | sans objet | Correct. Pas encore planifiée : `vercel.json` ne contient aucun cron |
| `/api/auth/track-login` | session Kinde | sans objet | non | Correct |
| `/api/simulations` (GET, POST) | session Kinde | **aucune** (M2) | non | Données du client écrites telles quelles |
| `/api/simulations/save` | session Kinde | partielle | non | Logs très sensibles (A2) |
| `/api/market-rates` | public | partielle | non | Données codées en dur, pas de risque |
| `/api/auth/[kindeAuth]` | public (Kinde) | géré par Kinde | non | Hors périmètre |

Aucune route n'a de limitation de débit. Vercel propose un pare-feu avec des règles de débit : disponibilité et limites du plan **à vérifier à la source**.

## Constats importants

**A1. `/api/chat` : un modèle payant accessible à tout le monde.** La route appelle Anthropic (jusqu'à 1 500 jetons de sortie par requête) sans session ni limite. Le filtre « sujet immobilier » se contourne en ajoutant un mot-clé immobilier à n'importe quelle question. Le message n'a pas de taille maximale. Risque : consommation de la clé API par un tiers (coût), et usage détourné du modèle. Le modèle codé en dur (`claude-3-5-sonnet-20240620`) peut être retiré : à vérifier à la source. Quand l'appel échoue, la route renvoie quand même 200 avec une réponse de secours : l'échec est invisible pour le client.

**A2. Données personnelles et jetons écrits dans les logs.**
- `simulations/save` écrit tous les en-têtes de la requête (donc le cookie de session et l'en-tête `authorization`), le corps, l'utilisateur et son e-mail.
- `reset-password` écrit l'e-mail et le jeton de réinitialisation en clair.
- `chat` écrit le message et l'historique ; `contact` écrit l'enregistrement complet (nom, e-mail, téléphone).
Les logs de Vercel sont lisibles par les personnes qui ont accès au projet : durée de conservation et accès **à vérifier à la source**. À traiter en priorité, car simple à corriger.

**A3. `/api/contact` : champs uniques et aucune validation.** Dans `prisma/schema.prisma`, `Contact.name` et `Contact.email` sont `@unique`. Deux demandes avec le même nom, ou le même e-mail, font échouer la seconde en 500 : un visiteur qui écrit deux fois, ou deux personnes homonymes, perdent leur message. De plus, aucun champ n'est validé (type, taille, e-mail) et la route ne limite pas le débit (spam). Toute correction du schéma est une migration (à valider).

**A4. `/api/web-search` : route inutilisée et ouverte.** Le front n'appelle que `/api/chat` (`ChatWidget.tsx`). La route consomme le quota Google si les clés sont définies, place la clé dans l'URL de l'appel et renvoie des résultats factices (`example.com`) en cas d'échec ou sans clé. À retirer, ou à protéger par session.

**A5. `/api/seed-news` : écriture publique par GET.** Elle ne crée qu'un article, et seulement si la table est vide, donc le risque est faible, mais c'est une route d'amorçage laissée en production, inutilisée par le site. À retirer. À noter : quand des articles existent déjà, le champ `count` renvoyé vaut toujours 1 (la requête ne lit qu'un article).

**A6. Deux contrôles d'accès administrateur différents.** `/admin`, `/api/admin/newsletter` et le brouillon visible dans `/api/news/[id]` utilisent `ADMIN_EMAILS` (variable d'environnement, vide = aucun accès). Les écritures `POST /api/news`, `PUT` et `DELETE /api/news/[id]` comparent l'e-mail à **une adresse écrite dans le code**. Conséquences :
- un administrateur listé dans `ADMIN_EMAILS` ne peut pas utiliser ces trois routes ;
- la sécurité de ces routes repose sur le fait que personne d'autre ne peut ouvrir un compte Kinde avec cette adresse : vérification de l'e-mail à l'inscription **à vérifier à la source** (configuration Kinde) ;
- un utilisateur connecté mais non administrateur reçoit 401 au lieu de 403.
Correction naturelle : utiliser `getAdminUser()` partout.

## Constats moyens

- **M1. `/api/news` GET** : `limit` n'a pas de plafond (`?limit=100000` lit toute la table) et une valeur non numérique donne `NaN` pour Prisma (500 probable, à vérifier). Le paramètre `category` est passé tel quel au filtre (pas d'injection : Prisma paramètre ses requêtes).
- **M2. `/api/simulations`** : `type`, `url` et `date` viennent du client sans contrôle. Un membre connecté peut y écrire n'importe quelle chaîne, y compris une URL arbitraire qui sera ensuite affichée dans son tableau de bord (risque : lien trompeur ; à voir côté affichage). Doublon avec `/api/simulations/save`, qui valide mieux.
- **M3. `/api/simulations/save`** : crée l'utilisateur avant de lire et de valider le corps ; renvoie `details` (message d'erreur interne) au client ; le 401 est envoyé avec un en-tête JSON et un corps texte.
- **M4. `reset-password`** : la route n'envoie aucun e-mail (le jeton n'est que stocké et écrit dans les logs), et l'authentification passe désormais par Kinde. Elle ne sert plus à rien et laisse un jeton valide en base pendant une heure. À retirer avec la page `/reset-password` (voir `docs/pages.md`). Les pages `/inscription` et `/reset-password` appellent d'ailleurs `/api/auth/register`, `/api/auth/validate-token` et `/api/auth/update-password`, qui n'existent pas : ces deux pages ne peuvent pas aboutir.
- **M5. `middleware.ts`** : ne protège que `/dashboard`, `/admin` et `/api/simulations`. C'est suffisant, car chaque route sensible vérifie aussi la session elle-même. Il écrit dans les logs, à chaque requête, l'état d'authentification (un booléen, pas le jeton). Il est déprécié dans Next.js 16 au profit de `proxy` (à vérifier à la source ; renommage déjà prévu dans la roadmap).
- **M6. Pas d'en-têtes de sécurité** (`Content-Security-Policy`, `X-Frame-Options`, etc.) dans `next.config.js` ni `vercel.json`. Les seuls en-têtes définis concernent les types de contenu du sitemap et de `robots.txt`.

## Ce qui est correct

- Aucune injection SQL : toutes les lectures et écritures passent par Prisma.
- `/api/admin/newsletter` renvoie 404 aux non-administrateurs et `Cache-Control: no-store`.
- `/api/cron/actualites` : secret comparé à temps constant, refus si `CRON_SECRET` est absent, plafonds de taille, nombres du brouillon vérifiés contre la source, journal sans contenu.
- `/api/news/[id]` GET : un brouillon n'est lisible que par un administrateur.
- `/api/leads` : e-mail normalisé, champs bornés, consentement newsletter conservé.
- Aucune clé ni valeur d'environnement dans le code lu.

## Corrections proposées (par ordre de priorité, chacune à valider)

1. Retirer les données sensibles des logs (A2).
2. `/api/chat` : exiger une session ou ajouter une limite de débit, borner la taille du message, vérifier le modèle (A1).
3. `/api/contact` : lever l'unicité de `name` et `email` (migration) et valider les champs (A3).
4. Remplacer l'adresse codée en dur par `getAdminUser()` dans les routes `news` (A6).
5. Retirer `web-search`, `seed-news` et `reset-password` (A4, A5, M4).
6. Plafonner `limit` dans `/api/news` ; valider `/api/simulations` ou la fusionner avec `save` (M1, M2, M3).
7. Ajouter des en-têtes de sécurité et une limite de débit au niveau de la plateforme (M6, à vérifier à la source).
