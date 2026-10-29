# Spécification du score cinéphile — v1

*Formule version 1. Les constantes sont à valider avec des testeurs réels avant le lancement.*

## 1. Principe

Le score cinéphile mesure l'**exposition au cinéma** d'un membre : combien de films il a vus, à quel point ils sont variés, et quelle part du socle du cinéma il connaît. Il ne mesure ni le goût ni le droit de juger un film : les notes, avis et favoris n'entrent pas dans le calcul.

```latex
Score = 100 \times (0{,}50 \times Volume + 0{,}30 \times Diversité + 0{,}20 \times Références)
```

Chaque composante vaut entre 0 et 1. Quatre principes guident les choix :

- **Simple à expliquer** : une page « Comment est calculé mon score ? » affiche cette formule.
- **Difficile à gonfler** : les premiers films comptent beaucoup, les suivants de moins en moins, et la variété est exigée.
- **Équitable** : la liste de référence mélange pays, époques et genres, pour éviter le réflexe « tu n'as pas vu tel film, tu ne comptes pas ».
- **Reproductible** : le calcul est une fonction pure, versionnée, utilisée par l'application, le quiz et les tests.

## 2. Données prises en compte

| Donnée | Source | Usage |
| --- | --- | --- |
| Films vus | `user_films` avec `status = seen` | Volume, Diversité, Références |
| Durée | `films.runtime_min` | Un film compte à partir de 40 minutes (exclut courts métrages et épisodes) ; durée inconnue = il compte |
| Genres | `film_genres`, regroupés en familles | Diversité |
| Époque | `films.year` | Diversité |
| Région | `films.country` (premier pays de production, code ISO) | Diversité |
| Langue | `films.language` (langue originale) | Diversité |
| Liste de référence | `reference_list_films` | Références |

Règles : un film compte une seule fois, même revu. Un film sans genre, pays ou langue compte dans le Volume mais est ignoré pour la diversité correspondante. Retirer un film de sa liste « vus » baisse le score.

## 3. Volume (50 %)

Interpolation linéaire entre des points d'ancrage, pour que les premiers films comptent beaucoup et que le rythme ralentisse ensuite.

| Films vus | Volume |
| --- | --- |
| 0 | 0,00 |
| 50 | 0,15 |
| 200 | 0,40 |
| 500 | 0,70 |
| 1 000 | 0,90 |
| 2 000 et plus | 1,00 |

Exemple : 300 films donnent 0,40 + (100 ÷ 300) × 0,30 = 0,50.

## 4. Diversité (30 %)

Moyenne de quatre sous-scores, chacun entre 0 et 1.

| Sous-score | Définition | Maximum quand |
| --- | --- | --- |
| Genres | Familles de genres avec au moins 3 films vus ÷ 10 | Les 10 familles sont couvertes |
| Époques | Époques avec au moins 3 films vus ÷ 7 | Les 7 époques sont couvertes |
| Régions | Régions avec au moins 2 films vus ÷ 5 | Les 5 régions sont couvertes |
| Langues | Part de films en langue originale non anglophone ÷ 25 %, plafonnée à 1 | 25 % des films vus ou plus sont non anglophones |

**10 familles de genres** : action et aventure, animation, comédie, crime et thriller, documentaire, drame, fantasy et science-fiction, horreur, romance, histoire et guerre. Chaque genre de l'API est rattaché à une famille (table `genre_families`) ; un film peut compter dans plusieurs familles.

**7 époques** : avant 1960, 1960-1979, années 1980, années 1990, années 2000, années 2010, depuis 2020.

**5 régions** : Hollywood et monde anglophone (États-Unis, Royaume-Uni, Canada, Australie), France, Europe hors France, Asie, reste du monde. Le rattachement passe par la table `country_regions`.

Le quiz de la landing page utilise un seuil d'un seul film par catégorie, car il ne propose que 41 films.

## 5. Références (20 %)

```latex
R\acute{e}f\acute{e}rences = \min\left(1, \frac{\text{films de la liste vus}}{0{,}60 \times \text{taille de la liste}}\right)
```

Voir 60 % de la liste suffit pour la note maximale : personne n'est obligé d'avoir tout vu.

**Liste de départ (v1)** : faute de temps pour composer une liste sur mesure, la v1 s'appuie sur le Top 250 d'IMDb comme réservoir de films. La taille de la liste vaut donc 250. Ce choix a deux limites à connaître :

- **Un classement très centré sur Hollywood**, avec peu de films non anglophones et peu de réalisatrices. Les quotas ci-dessous ne sont pas respectés en v1 : ils deviennent l'objectif de la liste v2. La diversité reste mesurée à part (30 % du score), ce qui limite l'effet.
- **Une question de droits à vérifier avant l'ouverture du premium.** D'après ses conditions d'utilisation, IMDb limite l'usage de ses données à un cadre non commercial, et son classement peut être protégé comme compilation. Ne l'affiche pas comme « Top 250 IMDb » : présente-le comme la liste de référence de SéanceClub, constitue-la une seule fois à la main, et prévois de la remplacer ou de la croiser avec d'autres sources. Fais valider ce point par un juriste avant le lancement payant.

**Composition cible de la liste (200 films, v2)**, pour qu'elle reste variée :

| Règle | Cible |
| --- | --- |
| Hollywood et monde anglophone | 45 % maximum |
| France | 15 % minimum |
| Europe hors France | 10 % minimum |
| Asie | 15 % minimum |
| Reste du monde | 8 % minimum |
| Une même décennie | 20 % maximum de la liste |
| Films d'avant 1960 | 10 % minimum |
| Chaque famille de genres | 8 films minimum (12 pour l'animation) |
| Films réalisés par des femmes | 15 % visés |
| Films grand public à succès | Environ un tiers, pour ne pas faire une liste élitiste |

**Sources** : compile la liste toi-même à partir de plusieurs classements indépendants (sondages de critiques, box-office, récompenses, classements de spectateurs) et ne garde qu'un titre cité par au moins 2 sources. Ne recopie pas un classement entier : vérifie les conditions d'utilisation de chaque source.

**Mineurs** : la liste est limitée aux films accessibles à l'âge du membre, et le dénominateur suit. S'il reste moins de 50 films accessibles, la composante Références est retirée et les poids passent à 0,625 pour le Volume et 0,375 pour la Diversité.

## 6. Niveaux et profils

| Niveau | Score |
| --- | --- |
| Curieux | 0 à 24 |
| Amateur | 25 à 44 |
| Passionné | 45 à 64 |
| Cinéphile | 65 à 81 |
| Encyclopédie | 82 à 100 |

**Profils** : une étiquette « Spécialiste de… » s'affiche quand un membre a vu au moins 20 films d'une catégorie (famille de genres, région ou époque) et que cette catégorie représente au moins 20 % de ses films. Trois étiquettes au maximum. Exemples : cinéma asiatique, frissons (horreur), classiques (avant 1960). Les badges de défis (listes à compléter) sont à part et n'influencent pas le score.

**Affichage** : le score apparaît à partir de 10 films. Avant, le profil indique « encore X films pour débloquer ton score ». Le résultat du quiz s'affiche comme une estimation jusqu'à 30 films enregistrés.

## 7. Cas de référence (jeux de tests)

Entrées de chaque cas (liste de référence de 250 films) :

- **A, spectateur occasionnel** : 80 films, 5 genres, 4 époques, 2 régions, 10 % de non-anglophone, 20 films de la liste.
- **D, fan de blockbusters** : 300 films, 4 genres, 3 époques, 1 région, 2 % de non-anglophone, 10 films de la liste.
- **B, cinéphile éclectique** : 500 films, 9 genres, 6 époques, 4 régions, 25 % de non-anglophone, 90 films de la liste.
- **C, grand cinéphile** : 1 200 films, couverture complète, 30 % de non-anglophone, 150 films de la liste ou plus.

| Cas | Volume | Diversité | Références | Score | Niveau |
| --- | --- | --- | --- | --- | --- |
| A | 0,20 | 0,47 | 0,13 | 27 | Amateur |
| D | 0,50 | 0,28 | 0,07 | 35 | Amateur |
| B | 0,70 | 0,89 | 0,60 | 74 | Cinéphile |
| C | 0,92 | 1,00 | 1,00 | 96 | Encyclopédie |

Le cas D est voulu : 300 films d'un seul style rapportent moins que 500 films variés. Ces quatre cas servent de tests automatiques : si la formule change, ils doivent être mis à jour volontairement.

## 8. Implémentation

- **Une fonction pure** `computeScore(input, config)` dans un module partagé par l'application, le quiz et les tests.
- **Une configuration versionnée** (poids, points du Volume, seuils, listes) : toute modification incrémente `score_version`.
- **Recalcul** : après un changement dans `user_films`, une tâche en file d'attente se déclenche avec un délai de 30 secondes pour regrouper les ajouts. Un recalcul complet tourne la nuit. Un changement de version de la formule ou de la liste recalcule tous les membres.

```ts
function computeScore(i: Input, c: Config): Result {
  const volume = interpolate(i.filmsSeen, c.volumePoints);
  const diversity = (
    i.genresCovered / 10 +
    i.erasCovered / 7 +
    i.regionsCovered / 5 +
    Math.min(1, i.nonEnglishShare / 0.25)
  ) / 4;
  const hasRef = i.accessibleRefCount >= 50;
  const reference = hasRef
    ? Math.min(1, i.refSeen / (0.6 * i.accessibleRefCount))
    : 0;
  const w = hasRef ? c.weights : c.weightsWithoutRef; // 0.625 / 0.375
  const raw = w.volume * volume + w.diversity * diversity + w.reference * reference;
  return { score: Math.round(100 * raw), volume, diversity, reference };
}
```

**Ajouts au schéma SQL** :

```sql
ALTER TABLE user_stats
  ADD COLUMN volume_score smallint NOT NULL DEFAULT 0 CHECK (volume_score BETWEEN 0 AND 100),
  ADD COLUMN score_version int NOT NULL DEFAULT 1;
ALTER TABLE reference_lists ADD COLUMN version int NOT NULL DEFAULT 1;

CREATE TABLE genre_families (
  genre_id int PRIMARY KEY REFERENCES genres(id),
  family   text NOT NULL
);
CREATE TABLE country_regions (
  country_code char(2) PRIMARY KEY,
  region text NOT NULL CHECK (region IN ('hollywood','france','europe','asie','monde'))
);
```

`films.country` doit contenir le code ISO du pays pour que le rattachement fonctionne.

## 9. Validation et limites

- **Avant le lancement** : tests automatiques sur les 4 cas, puis essai avec 20 à 30 personnes réelles. On compare leur niveau calculé à leur propre estimation et on ajuste les constantes (points du Volume, seuil de 25 % de non-anglophone, seuil de 60 % des références).
- **Pas de vérification en v1** : un membre peut cocher des films qu'il n'a pas vus. Le score est un jeu, pas un diplôme. En cas d'abus massif, plafonner les ajouts quotidiens. L'import d'un historique depuis un autre service compterait normalement.
- **Changement de formule** : jamais en silence. On incrémente la version et on prévient les membres dont le niveau change.

## 10. Points à trancher

1. La liste v2, qui remplacera la liste de départ : composition finale (200 films) et qui la valide.
2. Les seuils : 10 films pour afficher le score, 60 % de la liste, 25 % de non-anglophone, bornes des niveaux.
3. Une idée pour plus tard, qui répond à ta question de départ (« en avoir vu assez pour juger ») : afficher à côté de chaque avis le nombre de films du même genre vus par son auteur, par exemple « a vu 42 films d'horreur ».
