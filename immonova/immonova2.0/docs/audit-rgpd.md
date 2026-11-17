# Audit RGPD (2026-11-17)

Lecture du code, aucune modification de l'application. Ce n'est pas un avis juridique : les points de droit sont **à faire valider par un juriste ou la CNIL (à vérifier à la source)**.

## 1. Ce qui est collecté

| Donnée | Où | Stockage | Consentement / information |
|---|---|---|---|
| E-mail, calculette demandée, nombre de passages, case newsletter + date | popup `EmailPopup` → `/api/leads` → table `Lead` (Neon) | base, sans durée appliquée | lien vers `/confidentialite` ; case newsletter décochée par défaut |
| Nom, e-mail, téléphone, sujet, type de projet, budget, message | `/contact` → `/api/contact` → table `Contact` | base, sans durée appliquée | **aucun lien vers la politique de confidentialité sur la page** |
| E-mail, nom, dernière connexion, nombre de connexions | Kinde → `/api/auth/track-login` → table `User` | base | décrit dans la politique |
| Type de calculette + URL de la page | `/api/simulations/save` → table `Simulation` | base | décrit dans la politique ; l'URL ne contient pas de saisie (aucun paramètre de requête dans les calculettes) |
| Messages de l'assistant | `ChatWidget` → `/api/chat` → API Anthropic | non stockés en base | décrit dans la politique |
| Pages vues, événements calculettes (sans montant) | PostHog (UE), via le proxy `/ingest` | PostHog | bandeau Accepter/Refuser, rien avant l'accord (`consent.ts`, `PostHogProvider.tsx`) |

## 2. Ce qui est en règle

- PostHog : `opt_out_capturing_by_default`, `persistence: "memory"` avant l'accord, `advanced_disable_decide`, aucun cookie ni requête avant le « Accepter ». Les événements n'envoient jamais de montant (`track.ts`).
- Newsletter : case décochée, date du consentement conservée (`newsletterConsentAt`), un consentement donné n'est pas effacé par un passage sans case cochée.
- Hébergement des données : Neon à Francfort, PostHog sur `eu.posthog.com`, d'après la politique (non vérifié dans la console des services, à vérifier à la source).
- Page `/confidentialite` présente, liée depuis le pied de page, le bandeau et le popup ; droits, CNIL et contact indiqués.

## 3. Écarts et risques

### Élevés

1. **Journaux Vercel : données personnelles écrites en clair.**
   - `/api/simulations/save` journalise tous les en-têtes de la requête (cookie de session Kinde inclus), l'e-mail et l'identifiant de l'utilisateur, et l'objet utilisateur créé.
   - `/api/contact` journalise l'enregistrement complet (nom, e-mail, téléphone, message).
   - `/api/chat` journalise chaque message et l'historique reçus.
   - Ces journaux ne sont couverts ni par la politique ni par une durée de conservation, et le cookie de session y est un risque de sécurité en plus d'un risque RGPD.
2. **E-mail exigé pour ouvrir une calculette, base légale « intérêt légitime ».** Un accès conditionné à l'e-mail est difficile à présenter comme un intérêt légitime sans consentement ; c'est le point le plus sensible du site. Question à trancher (déjà ouverte dans la roadmap : popup avant ou après le résultat). À valider juridiquement.
3. **Durées de conservation annoncées mais non appliquées.** La politique promet 3 ans (e-mails, contacts) ; aucune purge n'existe dans le code (pas de cron, pas de script). Les données restent indéfiniment.

### Moyens

4. **Formulaire de contact sans information** : pas de lien vers `/confidentialite`, pas de mention de finalité à l'endroit de la collecte (obligation d'information au moment de la collecte).
5. **Politique inexacte sur l'assistant et Google.** Elle dit que l'assistant utilise une recherche Google avec les termes de la question. Dans le code, `/api/chat` n'appelle pas `/api/web-search` et aucune page ne l'appelle : à corriger dans le texte, ou à retirer si la route reste inutilisée.
6. **Aucun moyen de désinscription ou de suppression en libre-service.** Les droits passent par un e-mail ; pas d'export ni de suppression de compte. Acceptable pour un petit site si les demandes sont traitées sous un mois ; à décider.
7. **Anthropic (hors UE)** : la politique le dit, mais ne mentionne ni le cadre de transfert ni la conservation côté fournisseur (à vérifier à la source dans les conditions d'Anthropic).
8. **Pas de limitation de débit** sur `/api/leads` et `/api/contact` : n'importe qui peut y écrire des adresses d'autrui (voir `docs/audit-api.md`) ; pas de double opt-in pour la newsletter, donc l'inscription d'un tiers est possible.
9. **Durée PostHog « 25 mois »** annoncée dans la politique : non vérifiée dans la configuration PostHog (rétention des données et durée du cookie), à vérifier à la source.

### Faibles

10. Le modèle `User` garde `password`, `resetToken`, `resetTokenExp`, vestiges de l'ancienne authentification (Kinde est retenu). Minimisation : à retirer, mais c'est une migration (validation requise).
11. `Contact.name` et `Contact.email` sont `@unique` : un second message du même nom ou de la même adresse échoue (erreur 500) et le visiteur croit avoir été entendu. Défaut fonctionnel, à traiter avec les corrections.
12. Pas de registre des traitements ni de contrat avec les sous-traitants dans le dépôt (Vercel, Neon, Kinde, PostHog, Anthropic) : à tenir hors dépôt.
13. La politique cite l'adresse e-mail personnelle de l'éditeur : choix du propriétaire, à confirmer (le dépôt est public).

## 4. Corrections proposées (une tâche chacune, à valider)

Ordre de priorité :

1. Retirer les `console.log` qui contiennent des données personnelles ou des en-têtes (`simulations/save`, `contact`, `chat`) : changement mécanique, aucun risque fonctionnel.
2. Ajouter le lien et la mention d'information sur `/contact`.
3. Corriger le texte de `/confidentialite` (Google, transferts, durée PostHog une fois vérifiée).
4. Trancher le popup e-mail (accès libre puis e-mail après le résultat) et la base légale.
5. Purge automatique des `Lead` et `Contact` de plus de 3 ans (cron Vercel, à valider).
6. Retirer les champs d'authentification hérités de `User` (migration), lever l'unicité de `Contact` (migration).
7. Limitation de débit et double opt-in newsletter (voir `docs/audit-api.md`).
