# CelesTrak : politique d'usage

**Statut : brouillon sourcé (2026-11-03), à relire sur les pages officielles.** Les faits ci-dessous viennent de résumés de recherche des pages CelesTrak, pas d'une lecture directe de ma part : à vérifier à la source avant de coder le cache.

## Pourquoi c'est important

Le globe a besoin de paramètres orbitaux publics. Un cache côté serveur (route API Next.js) est obligatoire : jamais d'appel direct depuis le navigateur.

## Réponses trouvées

- [x] **Fréquence maximale** : les données GP sont mises à jour toutes les 2 heures ; il est demandé de ne télécharger qu'**une fois par mise à jour** et seulement quand on en a besoin [1][2]. Depuis le 2026-03-26, CelesTrak annonce l'application stricte d'un téléchargement par mise à jour, en commençant par les groupes Active et Starlink [2]. Extension aux autres groupes : non trouvée, à vérifier.
- [x] **Limites et blocages** : une adresse IP qui fait trop de requêtes reçoit une erreur HTTP 403 avec explication. Seuil indiqué depuis août 2025 : 50 erreurs HTTP (301, 403 ou 404) en 2 heures, au-delà l'IP passe au pare-feu avec revue manuelle. Un blocage temporaire se lève, selon CelesTrak, dans les 2 heures après l'arrêt du processus fautif [2]. Pas de quota de volume trouvé : à vérifier.
- [x] **Formats** (point d'accès `gp.php`) : TLE/3LE, 2LE, XML, KVN, JSON, CSV. Le format par défaut est CSV (depuis le 2026-05-09). XML recommandé pour l'interopérabilité, CSV ou JSON acceptables ; le JSON pèse environ 3 fois le CSV [3].
- [x] **Mise à jour côté source** : toutes les 2 heures [1][2].
- [ ] **Jeux de données** pour « ISS + quelques constellations » : les groupes existent (exemple `GROUP=STATIONS` pour les stations spatiales dont l'ISS) [3]. Liste exacte des groupes Starlink, OneWeb, etc. : à relever sur la page « Current GP Element Sets » [4].
- [ ] **Réutilisation et attribution** : non trouvé. Lire la page de politique d'usage [2].
- [ ] **Service indisponible** : pas de règle trouvée. Pratique recommandée par CelesTrak : garder le dernier fichier en cache et ne retélécharger que s'il a plus de 2 heures [2]. Cache de secours : à décider.

## Point important pour le code (impact sur le prototype)

CelesTrak a épuisé les numéros de catalogue à 5 chiffres le 2026-07-11 : les nouveaux objets (6 chiffres) n'auront **pas** de données au format TLE [3]. Il faut donc partir sur **JSON ou CSV (OMM)**, pas sur les TLE. Le prototype jetable utilise `twoline2satrec` (TLE) : suffisant pour mesurer le coût, mais pas pour le globe réel. Vérifier à la source que satellite.js sait lire les enregistrements OMM (`json2satrec` ou équivalent dans la version retenue).

## Décisions proposées (à valider)

- Format : JSON OMM (ou CSV si le poids pose problème), pas TLE.
- Cache côté serveur Next.js : un fichier par groupe, retéléchargé au plus toutes les 2 heures, avec en-tête de date ; jamais d'appel depuis le navigateur.
- Surveiller les erreurs 403/404 pour ne pas dépasser le seuil de blocage.

## Sources

| # | Source | URL | Date de consultation |
|---|---|---|---|
| 1 | CelesTrak : Current GP Element Sets | https://celestrak.org/NORAD/elements/ | 2026-11-03 |
| 2 | CelesTrak : Usage Policy | https://celestrak.org/usage-policy.php | 2026-11-03 |
| 3 | CelesTrak : A New Way to Obtain GP Data | https://celestrak.org/NORAD/documentation/gp-data-formats.php | 2026-11-03 |
| 4 | CelesTrak : Current GP Element Sets (liste des groupes) | https://celestrak.org/NORAD/elements/ | 2026-11-03 |
