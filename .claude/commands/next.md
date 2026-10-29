---
description: Agent développeur : prend la prochaine tâche de la roadmap d'un projet, l'implémente sur une branche et prépare une pull request
argument-hint: <projet> (ex. Confio)
---

Projet demandé : $ARGUMENTS

Si aucun projet n'est indiqué, demande-le moi et arrête-toi. Réponds en français, de façon courte. Tu ne traites **qu'une seule tâche** par exécution.

## Préparation

1. Lis le `CLAUDE.md` racine (y compris la section « Branche de référence » si elle existe ; sinon la branche de référence est `develop`), puis le `CLAUDE.md` du projet, puis `<projet>/ROADMAP.md`. Pour immonova, le dossier du projet est `immonova/` (le code est dans `immonova2.0/`).
2. Fais `git fetch` et vérifie que `git status` est propre. Si ce n'est pas le cas, arrête-toi et dis-moi pourquoi.
3. Choisis la **première** tâche `- [ ]` qui ne porte pas la mention « validation requise ». S'il n'y en a aucune, dis-le, liste les tâches qui attendent ma validation, et arrête-toi.
4. Crée la branche `feat/<projet>-<court-résumé>` depuis la branche de référence à jour.

## Réalisation

- Fais uniquement ce que décrit la tâche : pas de refactor, de renommage ni de changement hors périmètre.
- Aucune nouvelle dépendance, aucun secret, aucune lecture de `.env`, aucun script qui touche à de vraies données (par exemple `test:inbox` dans Confio).
- Pour écrire des tests, délègue au sous-agent `tester`. Lance d'abord le test concerné, puis la suite du projet une seule fois à la fin.
- Maximum **2 tentatives** par problème. Au 3e échec, arrête-toi et résume en 4 lignes : erreur, hypothèse, ce qui a été essayé, décision à prendre.
- Ne contourne jamais une vérification : pas de `skip`, de `any`, de `@ts-ignore`, ni de test affaibli.

## Contrôle et livraison

1. Fais relire le diff par le sous-agent `reviewer` et corrige les problèmes réels qu'il signale.
2. Coche la tâche dans `<projet>/ROADMAP.md` (`- [x]`) et ajoute la date en fin de ligne.
3. Montre-moi le résumé du diff et **demande-moi confirmation avant de pousser**.
4. Après accord : commit (message court en français), push de la branche, puis ouvre une pull request vers `develop` si `gh` est disponible, sinon donne-moi le lien GitHub pour la créer.

## Interdits

Ne fusionne jamais. Ne touche jamais à `main` ni à `develop` directement. Ne modifie aucun autre projet.

## Réponse finale

8 lignes maximum : la tâche traitée, fichiers modifiés, résultat des vérifications, lien de la pull request, points à contrôler.
