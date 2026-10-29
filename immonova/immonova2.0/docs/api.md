# Routes API d'immonova2.0

Document établi par lecture du code de `app/api/` (octobre 2026). Aucune route n'a été exécutée. Les points marqués « à vérifier » n'ont pas été constatés dans le code lu.

## Vue d'ensemble

| Route | Méthodes | Accès | Écrit en base | Service externe |
|---|---|---|---|---|
| `/api/auth/[kindeAuth]` | GET | public (géré par Kinde) | non | Kinde |
| `/api/auth/reset-password` | POST | public | oui (`User`) | non |
| `/api/chat` | POST | public | non | Anthropic (payant) |
| `/api/contact` | POST | public | oui (`Contact`) | non |
| `/api/leads` | POST | public | non | non |
| `/api/market-rates` | GET | public | non | non |
| `/api/news` | GET, POST | GET public, POST admin | POST : oui (`NewsArticle`) | Kinde (POST) |
| `/api/news/[id]` | GET, PUT, DELETE | GET public, PUT et DELETE admin | PUT, DELETE : oui | Kinde (PUT, DELETE) |
| `/api/seed-news` | GET | public | oui (`NewsArticle`) | non |
| `/api/simulations` | GET, POST | session Kinde | oui (`Simulation`) | Kinde |
| `/api/simulations/save` | POST | session Kinde | oui (`User`, `Simulation`) | Kinde |
| `/api/web-search` | POST | public | non | Google Custom Search |

L'authentification en usage dans les routes est **Kinde**. Aucune route ne lit `next-auth`.

## `/api/auth/[kindeAuth]`

GET, délégué à `handleAuth()` de Kinde. Les sous-chemins (connexion, retour, déconnexion) et les réponses sont gérés par la bibliothèque : à vérifier.

## `/api/auth/reset-password`

- **POST** `{ email }`.
- Erreurs : 400 `Email requis` ou le message de `validateEmail` ; 500 en cas d'erreur.
- Succès : 200 `{ success: true }`, que l'e-mail existe ou non.
- Effet : si l'utilisateur existe, écrit un `resetToken` (32 octets hexadécimaux) et `resetTokenExp` à +1 h dans `User`.
- Points à noter : aucun e-mail n'est envoyé, le jeton est seulement écrit dans la console et stocké en clair. Pas de limitation de débit visible. La route de confirmation n'est pas dans ce dossier : à vérifier. Temps de réponse non uniformisé : à vérifier.

## `/api/chat`

- **POST** `{ message: string, history?: string[] }`.
- Message absent ou non textuel : HTTP 200 `{ success: false, error }`. Toutes les réponses sont en 200, avec `success` à `true` ou `false`.
- Les questions hors sujet sont détectées par mots-clés. Sans `CLAUDE_API_KEY`, la route renvoie une réponse de secours. Sinon elle appelle l'API Anthropic avec un modèle codé en dur et `max_tokens` à 1500.
- Si l'appel à Anthropic échoue (erreur de l'API, réponse invalide), la route renvoie quand même 200 `success: true` avec une réponse de secours par mots-clés : le client ne peut pas la distinguer d'une vraie réponse.
- `history` n'est jamais envoyé au modèle : seul `message` l'est. `history` ne sert qu'à détecter les questions hors sujet répétées.
- Points à noter : `history` n'est pas validé (une chaîne provoque une erreur interne, renvoyée en 200 `success: false`, à vérifier). Pas de limite de taille. Le message et l'historique sont écrits dans les logs. Le modèle codé en dur peut être retiré : à vérifier à la source.

## `/api/contact`

- **POST** `{ name, email, phone, subject, projectType, budget, message }`, sans aucune validation.
- Succès : 201 avec l'enregistrement créé. Erreur : 500 `{ error }`.
- Effet : écrit un `Contact`. N'envoie pas d'e-mail.
- Points à noter : écriture publique non contrôlée (risque de spam). L'enregistrement complet, avec e-mail et téléphone, est écrit dans les logs et renvoyé en réponse.

## `/api/leads`

- **POST** `{ email, calculatorType, acceptNewsletter }`. L'e-mail est validé par `validateEmail`.
- Succès : 200 `{ success: true }`. Erreurs : 400 `{ success: false, error }`, 500.
- Point à noter : malgré son nom, la route n'écrit rien en base (le stockage est un commentaire dans le code). L'e-mail est écrit dans les logs, et la réponse est retardée de 500 ms.

## `/api/market-rates`

- **GET**, paramètres `type` (`acheter`, `locatif` ou `viager`) et `duration` (entier).
- Avec les deux paramètres valides : `{ type, duration, rate, lastUpdated }`, taux par interpolation linéaire. Sinon : toute la grille.
- Points à noter : un `type` invalide ne renvoie pas d'erreur 400. Les taux sont codés en dur, `lastUpdated` vaut `2024-06-15` : donnée ancienne. Une durée non numérique donne `rate: null` et `duration: null`. Une durée hors grille est ramenée aux bornes de la grille. Erreur : 500.

## `/api/news`

- **GET** (public) : `limit` (défaut 10, sans borne ; une valeur non numérique donne probablement un 500, à vérifier) et `category` (filtre exact). Ne renvoie que les articles publiés, avec `formattedDate` au format JJ/MM/AAAA. Erreur : 500.
- **POST** (admin) : session Kinde, accès réservé à une adresse e-mail administrateur codée en dur. Corps `{ title, excerpt, content, category, imageUrl }`. Erreurs : 401 `Unauthorized`, 400 si `title`, `excerpt` ou `category` manque, 500. Succès : 201 avec l'article. `authorName` vient de la session (« Admin ImmoNova » si le prénom est absent).
- Valeur de `isPublished` à la création : à vérifier dans le schéma.

## `/api/news/[id]`

- **GET** (public) : 200 avec l'article, 404 `Article not found`. Aucun filtre sur `isPublished` : un article non publié reste lisible par son identifiant.
- **PUT** (admin) : mêmes contrôles d'accès que `POST /api/news`. 404 si l'article n'existe pas, 400 si `title`, `excerpt` ou `category` manque. `isPublished` est conservé s'il est absent. Succès : 200 avec l'article.
- **DELETE** (admin) : 404 si l'article n'existe pas, sinon suppression définitive et 200 `{ message }`.
- Point à noter : `id` n'est pas validé, et les paramètres sont typés `any`.

## `/api/seed-news`

- **GET**, sans authentification.
- S'il existe déjà un article : 200 `{ message, count }` (`count` vaut toujours 1 : la requête ne lit qu'un article). Sinon crée l'article « Bienvenue » publié (image Unsplash externe) et renvoie 200 `{ message, article }`. Erreur : 500.
- Point à noter : une route GET qui écrit en base, accessible à tous. À retirer en production ou à protéger.

## `/api/simulations`

- **POST** `{ type, url, date }`, session Kinde. Corps non validé, date fournie par le client. Succès : 200 avec la simulation. Sans session : 401 en texte brut `Unauthorized`. Erreur : 500 en texte.
- **GET** : liste les simulations de l'utilisateur connecté, tri par date décroissante. Sans session : 401 texte.

## `/api/simulations/save`

- **POST** `{ type, url }`, session Kinde. Crée l'utilisateur en base s'il n'existe pas (id, e-mail, nom issus de la session), puis la simulation avec la date du serveur.
- Erreurs : 401 texte sans session ; 400 texte si le JSON est invalide ; 400 JSON si des champs manquent ; 500 JSON avec `details`. Le 401 est envoyé avec un en-tête `Content-Type: application/json` alors que son corps est du texte : incohérent.
- Ordre des opérations : l'utilisateur est créé en base **avant** la lecture et la validation du corps. Une requête qui répond 400 a donc déjà pu écrire dans `User`.
- Points à noter : les messages d'erreur internes sont renvoyés au client. Les logs sont très verbeux : tous les en-têtes (donc `authorization` et `cookie`, c'est-à-dire le jeton de session), le corps, l'utilisateur et son e-mail. Fait double emploi avec `POST /api/simulations`.

## `/api/web-search`

- **POST** `{ query }`. 400 `{ error }` si `query` manque. Sinon toujours 200 `{ results: [...] }`, y compris en cas d'erreur.
- Utilise `GOOGLE_API_KEY` et `GOOGLE_CSE_ID`. Si elles sont absentes, vides ou égales aux valeurs d'exemple, ou si Google renvoie une erreur, la route renvoie des résultats factices (`example.com`), ou un tableau vide si aucun mot-clé ne correspond.
- Points à noter : la clé est placée dans l'URL de l'appel, et le message d'erreur de Google est écrit dans les logs. Pas de limite de taille de la requête. Quota Google : à vérifier à la source.

## Points transverses à traiter

- Pas de validation de schéma centralisée, pas de limitation de débit visible.
- Routes publiques qui écrivent : `contact`, `reset-password`, `seed-news`.
- Routes publiques qui consomment un service payant : `chat` (Anthropic) et `web-search` (Google).
- L'administrateur est identifié par une adresse e-mail codée en dur, dans `news/route.ts` et `news/[id]/route.ts`.
- Des données personnelles et des jetons sont écrits dans les logs : `chat`, `contact`, `leads`, `reset-password`, `simulations/save`.
- Un utilisateur connecté mais non administrateur reçoit 401 (et non 403) sur les routes d'écriture de `news`.
- Non lus lors de cette revue : `utils/validateEmail`, `lib/prisma`, le schéma Prisma, la configuration de Kinde.
