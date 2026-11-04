# HackAudit

Projet **AudirIA** pour le Hackaudit 2026 (7e édition, CNCC) : agent IA d'audit. Pas de code pour l'instant, uniquement des documents de cadrage.

## Contenu

- `docs/` : récap phase 2, présentation étudiants HackAudit 2026, note stratégique exécutive, présentations AudirIA (PPTX).
- `images/` : diagramme architectural (agent central relié à factures, contrats fournisseurs, stock logs, FEC, HackAudit/CNCC) et logo AudirIA.

- `poc/` : démo Python sans dépendance (`generate_data.py` puis `audiria.py`), voir `poc/README.md`. Données 100 % fictives.
- `guide/AudirIA_Guide_Phase2.docx` : guide de la phase 2 (30 pages max selon le règlement, échéance 31/12/2026).

## Règles

- Le POC simule l'extraction des factures : ne jamais présenter ses résultats (42/42) comme une performance réelle.
- Aucun gain de temps chiffré tant qu'il n'est pas mesuré.

- Le dépôt est public : ne pas committer `docs/` sans accord explicite (documents de concours, potentiellement confidentiels).
