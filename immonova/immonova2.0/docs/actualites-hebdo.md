# Actualités : rafraîchissement hebdomadaire

Cadrage du 2026-11-01. Construction commencée le 2026-11-02 (voir « État de la construction » en bas).

## État de la construction (2026-11-02)

- Fait : migration `sourceUrl` (appliquée sur Neon), lien de la source dans l'article et dans `/admin`, module `lib/actualites/sources.ts`, route `/api/cron/actualites` (401 sans le secret, vérifié).
- **Sources** : seule la Banque de France est active (réutilisation autorisée avec citation de la source et de la date, lu sur banque-france.fr/fr/infos-legales le 2026-11-02, à revérifier). **Notaires de France désactivée** : leurs mentions légales exigent une autorisation écrite du webmestre pour toute reproduction hors usage privé et interdisent la réutilisation commerciale. À reprendre si l'autorisation est obtenue.
- Le cron n'est **pas** activé : pas de ligne `crons` dans `vercel.json` tant que l'essai manuel n'est pas fait.
- Reste : clé d'API et modèle (reportés par le propriétaire ; la route lit `CLAUDE_API_KEY` et `NEWS_MODEL`, modèle par défaut `claude-sonnet-5-5`), `CRON_SECRET` dans Vercel, essai manuel, puis la ligne `crons`.
- Limite connue : un brouillon supprimé dans `/admin` ne laisse pas de trace, la même publication serait retraitée la semaine suivante.

## Où on en est

- Étape 1 faite : `/actualites` et la page d'un article lisent les articles publiés en base (`NewsArticle`) ; les 7 articles de début 2025 ne servent que de secours. Un brouillon est un article avec `isPublished = false`. `/admin` permet de les publier ou de les supprimer.
- Reste l'étape 2 : produire chaque semaine quelques brouillons à relire.

## Principe

1. Une tâche planifiée appelle une route protégée, une fois par semaine.
2. La route récupère quelques sources publiques récentes.
3. Un modèle d'IA rédige 2 ou 3 brouillons courts, avec le lien de la source.
4. Les brouillons arrivent dans `/admin` (« Actualités à valider »). Rien ne se publie sans clic du propriétaire.

## Décisions à prendre

### 1. Sources (à décider)

Proposition de départ, **conditions de réutilisation à vérifier à la source pour chacune** :

| Thème | Source possible | Remarque |
|---|---|---|
| Prix et volumes | Notaires de France, INSEE | publications trimestrielles, peu de nouveautés chaque semaine |
| Crédit et taux | Banque de France, Observatoire Crédit Logement | mensuel |
| Taux directeurs | BCE | par réunion |
| Aides et lois | service-public.fr, ANIL | à la demande |

Règle : on résume avec ses propres mots et on cite la source avec un lien. On ne recopie jamais un article.

Conséquence à accepter : les sources officielles publient peu d'un jour à l'autre. **Certaines semaines, il n'y aura rien de nouveau à écrire**, et le bon comportement est alors de ne produire aucun brouillon.

### 2. Génération par IA (à décider)

- Le projet a déjà le SDK Anthropic (`@anthropic-ai/sdk`, route `chat`) : pas de nouvelle dépendance.
- Il faut une clé d'API dans les variables Vercel (jamais dans le dépôt). Savoir si celle de l'assistant peut servir, ou s'il en faut une séparée pour suivre le coût : à vérifier dans la configuration Vercel.
- Coût : 3 brouillons par semaine, c'est très peu de texte. Le prix exact dépend du modèle choisi, à vérifier à la source (tarifs Anthropic). Un plafond (nombre de brouillons et de mots par semaine) est prévu dans le code.
- Le modèle ne doit utiliser que le texte des sources fournies, pas sa mémoire. Un chiffre qui ne figure pas dans la source ne doit pas apparaître.

### 3. Déclenchement (à décider)

- Cron Vercel, par exemple le lundi à 7 h. **Les limites du plan Vercel sur les crons sont à vérifier à la source** (le plan gratuit limite la fréquence).
- La route est protégée par un secret (`CRON_SECRET`, variable Vercel) : sans lui, elle répond 401.

### 4. Lien vers la source (à décider)

- Option A : champ `sourceUrl` dans `NewsArticle`. Propre (lien cliquable en bas de l'article), mais **c'est une migration**, donc ton accord.
- Option B : la source est écrite dans le texte du brouillon. Aucune migration, moins soigné.
- Recommandation : A.

### 5. Catégories et images

- Catégories autorisées : `tendances`, `financement`, `conseils` (celles des onglets de `/actualites`).
- Image : pas de génération. Une image d'illustration par catégorie, choisie dans `public/images/news-*`. Les anciens visuels bleu, vert et rouge sont à refaire à la nouvelle DA (tâche séparée).

## Garde-fous

- Brouillon uniquement, publication manuelle.
- Doublons : ne pas recréer un sujet déjà publié ou en attente (comparaison du titre et de la source).
- Chaque brouillon porte la mention « chiffres et source à vérifier » dans `/admin`.
- Journal : la route renvoie le nombre de brouillons créés, sans jamais écrire de clé ni de contenu sensible dans les logs.
- Pas un conseil personnalisé : ton informatif, comme le guide.

## Plan de construction (une fois les décisions prises)

1. Migration `sourceUrl` si option A (confirmation requise).
2. Module qui récupère et nettoie les sources.
3. Route `/api/cron/actualites` protégée par `CRON_SECRET`, plafonnée, avec détection des doublons.
4. Ligne `crons` dans `vercel.json`.
5. Essai manuel de la route, brouillons relus dans `/admin`, puis activation du cron.

## Ce que je recommande

Commencer petit : 2 sources (Banque de France et Notaires de France), 2 brouillons maximum par semaine, option A pour la source, cron le lundi matin. Après un mois de brouillons relus, décider si on ajoute des sources.
