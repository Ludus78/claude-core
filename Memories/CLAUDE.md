# Memories

Projet de BD humoristique et fantasy tirée de 15 ans de souvenirs de WoW entre amis. Le seul code est `taverne/` (page web de collecte des fiches et des récits des amis, voir son `README.md`) ; le reste est de la rédaction.

## Contenu

- `ROADMAP.md` : tâches à suivre (la plupart demandent ta participation ou celle du groupe).
- `personnages/`, `anecdotes/` (modèles `_modele.md`), `style/guide-de-style.md` (à rédiger), `planches/` (pour les planches finies).
- `memories-synthese.md.py` : synthèse du projet (objectif, décisions, avancement, reste à faire). Malgré l'extension, c'est du texte Markdown : ne jamais l'exécuter. Proposer de le renommer en `.md`, après accord.

## Règles

- Les personnages s'inspirent d'amis réels : rien ne se publie ni ne se partage hors du groupe sans leur accord.
- Ne pas inventer d'anecdotes présentées comme réelles : elles viennent des joueurs.
- Rien ne se publie sans l'accord des amis concernés. Sans lien avec WoW, le partage public n'est plus bloqué par la marque ; il reste à décider (voir la roadmap).

## Intention du projet (dite par le propriétaire le 2026-11-02, ne pas la redemander)

- Le propriétaire joue depuis 15 à 20 ans avec une bande d'amis, sur World of Warcraft. Chacun a des anecdotes de son parcours : la BD s'en inspire, d'où le nom « Memories ».
- **Univers (précisé le même jour, remplace la première version de cette note) : monde fantasy original, avec des nains et des elfes génériques, aucun lien avec WoW** (ni noms, ni races, ni lieux propres à Warcraft). Les vraies histoires du groupe en sont seulement l'inspiration. Visuel **plus sombre** (dark) que le ton Naheulbeuk de départ, humour inspiré de Donjon de Naheulbeuk (ton seulement, rien de repris), modifications au goût du propriétaire.
- **Collecte (2026-11-02) : page web `taverne/` sur Vercel**, ambiance « raconte une histoire au coin du feu, dans une auberge d'aventuriers ». Chaque ami y décrit son héros (nom, race, sexe, classe, allure, équipement, caractère), son histoire s'il le veut, et une ou plusieurs histoires vécues sur Azeroth. Les listes complètes des races et des classes de WoW y figurent, car ce sont les personnages réellement joués ; la BD, elle, reste sans lien avec WoW. Une base PostgreSQL sert de mémoire du projet.
- Les réponses des amis sont des données de personnes réelles : jamais dans le dépôt (public), seulement dans la base. `questionnaire-amis.md` (premier jet, mal orienté) n'est plus qu'une réserve d'idées de questions.
- **Chaque ami choisit sa représentation** dans la BD. Elle peut différer de son personnage d'époque. Exemple : un ami jouait un mort-vivant, mais son caractère évoque plutôt un humain assez grand. La fiche garde donc deux choses : le personnage joué à l'époque et la représentation voulue dans la BD.
- Le propriétaire pourra aussi écrire ses propres histoires, ou l'histoire de chaque personnage (origines), en plus des anecdotes du groupe.
