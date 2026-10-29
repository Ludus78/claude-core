# Contrat de données (brouillon)

Schéma partagé entre le [globe](../globe/README.md) et l'[observatoire](../observatory/README.md). Il permet de les développer séparément puis de les fusionner.

**Statut : brouillon du schéma écrit, à valider.** Le schéma est dans [`company.schema.json`](company.schema.json) (JSON Schema, brouillon 2020-12). Le format des fiches (JSON ou YAML) reste à confirmer ; le schéma s'applique à du JSON.

## Champs d'une fiche d'acteur

| Champ | Obligatoire | Description |
|---|---|---|
| `name` | oui | Nom de l'acteur |
| `segment` | oui | `launcher`, `satellite-constellation`, `orbital-transport`, `manufacturer`, `agency`, `downstream` (lanceur, satellites et constellations, transport orbital, industriel, agence, service aval) |
| `location` | oui | `city`, `country` (code à deux lettres), `latitude` et `longitude` facultatives pour la carte |
| `product` | oui | Produit ou activité principale |
| `founded` | oui | Année ou date de création (`AAAA`, `AAAA-MM`, `AAAA-MM-JJ`) |
| `objects` | non | Satellites ou lanceurs associés : `name`, `kind` (`satellite` ou `launcher`), `norad_id` quand il existe |
| `careers_url` | non | Lien carrières |
| `sources` | oui | **Au moins 3** sources : `title`, `url`, `accessed` (date de consultation) |
| `last_updated` | oui | Date de dernière mise à jour |

## Le lien avec le globe

Le **NORAD ID** (identifiant de catalogue) fait la jonction :

- fiche → globe : les `objects` d'une entreprise sont mis en évidence sur le globe ;
- globe → fiche : le NORAD ID d'un satellite sélectionné renvoie vers la fiche de son opérateur.

## Vérification du schéma

Le brouillon a été contrôlé sur des exemples fictifs : une fiche valide est acceptée ; une fiche avec 2 sources seulement, un code pays mal formé, un segment inconnu, une date de mise à jour absente ou un NORAD ID nul est refusée. Aucun outil de validation n'est encore installé dans le dépôt (voir « À décider »).

## À décider

- Format des fichiers (JSON ou YAML) et outil de validation dans le dépôt.
- Un fichier par acteur ou un fichier par segment.
- Emplacement des fiches : `data/companies/` (prévu par la synthèse) ou ailleurs (voir `docs/decisions.md`, D20).
- Valeurs de `segment` et champs facultatifs (coordonnées) : à valider.
- Que faire d'un objet sans NORAD ID (lanceur, satellite pas encore lancé) : il est déjà accepté sans `norad_id`.
- Où vit le schéma une fois les deux projets fusionnés.

Tout fait technique cité ici (format d'identifiants, catalogues) est à vérifier à la source.
