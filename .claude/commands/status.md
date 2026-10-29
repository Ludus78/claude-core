---
description: Résume l'état de tous les projets et propose les actions prioritaires
---

Fais le point sur tous mes projets. Réponds en français, de façon courte.

1. Lis `_hub/PROJETS.md`.
2. Pour chaque projet listé, vérifie l'état réel, en lecture seule : date du dernier commit qui touche son dossier (`git log -1 --format=%cs -- <dossier>`), commits des 14 derniers jours, `git status`, et le `CLAUDE.md` ou les README du projet pour ce qui reste à faire.
3. Si `_hub/PROJETS.md` n'est plus à jour, corrige uniquement les champs qui ont changé et la date en tête de fichier. Ne commite pas, ne pousse pas : dis-moi simplement que le fichier a changé. N'invente rien : un champ inconnu reste « à renseigner ».
4. Réponds avec :
   - une ligne par projet (statut + dernier mouvement) ;
   - les projets sans activité depuis plus de 10 jours, avec une micro-tâche de 30 minutes pour chacun ;
   - les 3 actions les plus rentables à faire maintenant ;
   - les branches locales ou distantes restantes autres que `main`, si tu peux les voir.

Marque « à vérifier » tout ce qui est déduit et non constaté.
