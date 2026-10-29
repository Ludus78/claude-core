# Contrat de données (brouillon)

Schéma partagé entre le [globe](../globe/README.md) et l'[observatoire](../observatory/README.md). Il permet de les développer séparément puis de les fusionner.

**Statut : brouillon, aucun schéma écrit.** Le format (JSON ou YAML) et le schéma de validation (par exemple JSON Schema) restent à choisir.

## Champs d'une fiche d'acteur

| Champ | Description |
|---|---|
| `name` | Nom de l'acteur |
| `segment` | Lanceur, satellite / constellation, transport orbital, industriel, agence, service aval |
| `location` | Ville et pays |
| `product` | Produit ou activité principale |
| `founded` | Date de création |
| `objects` | Satellites ou lanceurs associés, avec NORAD ID quand il existe |
| `careers_url` | Lien carrières |
| `sources` | Sources citées (idéalement 3 par fiche) |
| `last_updated` | Date de dernière mise à jour |

## Le lien avec le globe

Le **NORAD ID** (identifiant de catalogue) fait la jonction :

- fiche → globe : les `objects` d'une entreprise sont mis en évidence sur le globe ;
- globe → fiche : le NORAD ID d'un satellite sélectionné renvoie vers la fiche de son opérateur.

## À décider

- Format des fichiers (JSON ou YAML) et outil de validation.
- Un fichier par acteur ou un fichier par segment.
- Que faire d'un objet sans NORAD ID (lanceur, satellite pas encore lancé).
- Où vit le schéma une fois les deux projets fusionnés.

Tout fait technique cité ici (format d'identifiants, catalogues) est à vérifier à la source.
