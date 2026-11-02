# Roadmap Memories

Tirée de la synthèse du projet (`memories-synthese.md.py`). Projet sans code : la plupart des tâches demandent ta participation ou celle du groupe. `/next Memories` ne prend que les tâches de rédaction que Claude peut faire seul.

## Cadrage

- [x] Décider de l'univers : monde fantasy original (nains, elfes), aucun lien avec WoW, visuel plus sombre, humour à la Naheulbeuk (voir `CLAUDE.md`) — 2026-11-02. Reste à trancher : diffusion publique ou privée, après l'accord des amis
- [x] Rédiger le questionnaire des amis : `questionnaire-amis.md` (30 questions, prêt à copier dans un Google Form) — 2026-11-02
- [x] Page web de collecte `taverne/` (Next.js, Prisma, Neon) : fiche d'aventurier, récits, mot de passe de la porte, ambiance auberge ; build vérifié avec des variables factices, rendu à contrôler à l'écran — 2026-11-02
- [ ] Mettre la Taverne en ligne : créer la base Neon, projet Vercel (Root Directory `Memories/taverne`), variables `POSTGRES_URL` et `ACCES_TAVERNE`, `npx prisma migrate deploy` (validation requise : fait par toi, voir `taverne/README.md`)
- [ ] Envoyer le lien et le mot de passe aux amis (validation requise : fait par toi)
- [ ] Laisser chaque ami choisir sa représentation (qui peut différer de son personnage d'époque) et la noter dans sa fiche (validation requise : fait par toi et le groupe)
- [ ] Piste : histoires écrites par toi, ou histoire d'origine de chaque personnage, en plus des anecdotes du groupe (validation requise)
- [ ] Obtenir l'accord de chaque ami pour l'usage de son personnage et de ses traits réels (validation requise)

## Collecte

- [ ] Enregistrer des soirées Discord où chacun raconte ses souvenirs (validation requise : fait par toi)
- [ ] Créer le document partagé des anecdotes (validation requise)
- [ ] Remplir une fiche par joueur dans `personnages/` à partir du modèle `_modele.md` (classe, look, défaut, phrase culte, moment de gloire ou de honte) : les 5 fiches existent avec les seuls faits connus de la synthèse (2026-11-02) ; défaut, phrase culte, moments de gloire et de honte, liens et limites restent « à renseigner » par chaque joueur, ainsi que son accord (validation requise : fait par toi et le groupe)

## Production

- [ ] Rédiger la description de style commune dans `style/guide-de-style.md`
- [ ] Choisir comment dessiner : illustrateur, plateforme de commissions, ou outils d'images avec l'accord du groupe (validation requise)
- [ ] Écrire le script de la première vraie anecdote, case par case, dans `anecdotes/` à partir de `_modele.md`
- [ ] Choisir la diffusion : PDF partagé, page web ou carnet imprimé (validation requise)

## Légende

`- [ ]` à faire · `- [x]` fait.
