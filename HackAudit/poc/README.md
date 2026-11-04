# POC AudirIA : contrôle facture ↔ FEC ↔ contrat ↔ stock

Démo rejouable, **données fictives**, Python 3.10+ sans dépendance externe.

```bash
python generate_data.py   # génère data/ (graine fixe : résultat identique à chaque fois)
python audiria.py         # contrôle les factures, écrit out/
```

Sorties dans `out/` : `fiche_cac.html` (fiche à contrôler par le CAC, imprimable en PDF), `journal.json` (trace complète), `resultats.csv`.

## Ce que fait le moteur

Pour chaque facture : rapprochement au FEC (R02-R04), doublons (R05), prix et validité du contrat (R06-R07), commande (R08), réceptions de stock et cut-off (R09-R11), arithmétique (R12), confiance d'extraction (R13). R01 contrôle l'intégrité du FEC avant tout calcul : en cas d'échec, le lot est suspendu (code de sortie 2).

La fiche CAC liste les alertes avec valeurs comparées et sources, un tirage de 10 % des non-alertes à tester, la trace d'exécution (versions, paramètres, empreintes SHA-256) et un bloc de revue signé.

## Limites à connaître

- La lecture des factures (OCR + agent) est **simulée** : `data/factures_extraites.json` contient les champs déjà extraits, avec page et confiance. Aucun LLM n'est appelé.
- Les anomalies sont injectées par l'équipe et les règles ont été écrites en même temps : le 42/42 mesure la non-régression du moteur, **pas** sa performance sur des dossiers réels.
- `data/verite_terrain.json` n'est lu que pour la recette, jamais pour décider.
