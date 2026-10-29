---
description: Agent développeur : prend la prochaine tâche de la roadmap d'un projet, l'implémente, la commite et la pousse sur main
argument-hint: <projet> (ex. Confio)
---

Projet demandé : $ARGUMENTS

Si aucun projet n'est indiqué, demande-le moi et arrête-toi. Réponds en français, de façon courte. Tu ne traites **qu'une seule tâche** par exécution.

## Préparation

1. Lis le `CLAUDE.md` racine, puis le `CLAUDE.md` du projet, puis `<projet>/ROADMAP.md`. La branche de référence est toujours `main`. Pour immonova, le dossier du projet est `immonova/` (le code est dans `immonova2.0/`).
2. Fais `git fetch`, place-toi sur `main` et fais `git pull --ff-only`. Vérifie que `git status` est propre. Si ce n'est pas le cas, arrête-toi et dis-moi pourquoi.
3. Choisis la **première** tâche `- [ ]` qui ne porte pas la mention « validation requise ». S'il n'y en a aucune, dis-le, liste les tâches qui attendent ma validation, et arrête-toi.

## Réalisation

- Fais uniquement ce que décrit la tâche : pas de refactor, de renommage ni de changement hors périmètre.
- Aucune nouvelle dépendance, aucun secret, aucune lecture de `.env`, aucun script qui touche à de vraies données (par exemple `test:inbox` dans Confio).
- Pour écrire des tests, délègue au sous-agent `tester`. Lance d'abord le test concerné, puis la suite du projet et le build une seule fois à la fin.
- Maximum **2 tentatives** par problème. Au 3e échec, arrête-toi et résume en 4 lignes : erreur, hypothèse, ce qui a été essayé, décision à prendre.
- Ne contourne jamais une vérification : pas de `skip`, de `any`, de `@ts-ignore`, ni de test affaibli.

## Contrôle et livraison

1. Fais relire le diff par le sous-agent `reviewer` et corrige les problèmes réels qu'il signale.
2. Coche la tâche dans `<projet>/ROADMAP.md` (`- [x]`) et ajoute la date en fin de ligne.
3. Si les tests et le build du projet passent : un seul commit (message court en français), puis push sur `main`, sans me demander confirmation. Sinon, ne commite pas, ne pousse pas, et explique-moi pourquoi.

## Interdits

Pas de force push, pas de réécriture d'historique, pas de branche ni de pull request. Ne modifie aucun autre projet.

## Réponse finale

8 lignes maximum : la tâche traitée, fichiers modifiés, résultat des tests et du build, points à contrôler.
