---
mode: agent
description: SéanceClub, intro « salle de cinéma » (faisceau de lumière, chut, pop-corn) à la connexion
---

Lis d'abord `.github/copilot-instructions.md` et `.github/instructions/workflow.instructions.md`. À lancer après la phase 1 (il faut le layout connecté et l'authentification).

## Objectif

Quand un membre se connecte, une courte intro lui donne l'impression d'être dans une salle de cinéma. Un faisceau de lumière ronde et blanche, comme une lampe torche d'ouvreur, cherche quelqu'un dans le noir. On entend « Chut ! », le faisceau descend vers la droite sur un seau de pop-corn, on entend mâcher du pop-corn, puis la lumière s'éteint d'un coup et le site apparaît.

## Scénario (durée totale environ 6,8 secondes)

| Temps | Image | Son |
|---|---|---|
| 0,0 s | Écran noir (fond de salle `#0E0E10`) | Silence |
| 0,3 s | Un disque de lumière blanche, bord doux, apparaît au centre (rayon environ 18 vmin) | |
| 0,3 à 2,6 s | Il balaie la salle comme une lampe tenue à la main : gauche, droite, haut, retour, avec de petites irrégularités et un mouvement lent | |
| 2,6 s | Il s'arrête et tremble légèrement | « Chut ! » (environ 0,5 s) |
| 3,2 s | Il descend vers le bas à droite (0,8 s, accélération douce) | |
| 4,0 s | Il se pose sur un seau de pop-corn dessiné en SVG ; quelques grains sautillent doucement | Mastication de pop-corn (environ 2 s) |
| 6,0 s | La lumière s'éteint d'un coup : écran noir pendant 0,25 s | Le son coupe net |
| 6,25 s | Le site apparaît en fondu (0,5 s) | |

Les valeurs vont dans un fichier unique de constantes, faciles à ajuster. En option : de très sombres rangées de sièges (le siège rouge du logo) visibles seulement dans le faisceau.

## Méthode

Une tâche à la fois, vérifications ciblées après chacune, un message de commit proposé par tâche.

## Tâche 1 : logique de déclenchement (pure et testée)

- Dossier `apps/web/src/components/cinema-intro/`.
- `timeline.ts` : les constantes du scénario ci-dessus.
- `shouldPlayIntro({ reducedMotion, disabledByUser, alreadyPlayedThisSession }): boolean` : faux si l'un des trois est vrai.
- Tests Vitest : les huit combinaisons.

## Tâche 2 : image

- Composant client `CinemaIntro.tsx`, chargé avec `next/dynamic` (jamais dans le chemin critique du premier affichage).
- Un calque plein écran noir (`position: fixed`, `inset: 0`, au-dessus de tout, `aria-hidden="true"`). Le faisceau est un dégradé radial blanc animé ; pas de librairie d'animation.
- Pour animer la position et le rayon, choisis la solution la plus simple : propriétés CSS `@property` avec keyframes, ou `requestAnimationFrame`. Utilise des unités relatives (`vw`, `vh`, `vmin`) pour que le trajet fonctionne sur mobile comme sur ordinateur.
- Le seau de pop-corn : un SVG dessiné à la main (aucune image externe), placé en bas à droite, visible seulement dans le faisceau.
- Respecte `prefers-reduced-motion` : dans ce cas, aucune intro.
- Pas de clignotement : jamais plus de 3 changements de luminosité forts par seconde. L'extinction finale est un changement unique.

## Tâche 3 : sons

- `sounds.ts` : `chut.mp3` et `popcorn-chew.mp3` dans `apps/web/public/sounds/`, chargés seulement quand l'intro va se jouer. Volume 0,6.
- Aucun fichier audio n'est fourni et tu n'en génères ni n'en télécharges aucun. Si un fichier est absent ou ne se charge pas, l'intro se joue en silence sans erreur.
- Les navigateurs bloquent souvent le son sans geste de l'utilisateur. Essaie de jouer le son ; si le navigateur refuse, continue l'intro en silence sans message d'erreur ni popup.
- Crée `public/sounds/README.md` : fichiers attendus, durée (chut environ 0,5 s, mastication environ 2 s, moins de 60 Ko chacun) et une ligne de licence à remplir. Sons enregistrés par le développeur, ou libres de droits (CC0) vérifiés un par un.

## Tâche 4 : intégration et réglages

- Monte `CinemaIntro` dans le layout connecté, une seule fois par session de navigateur (`sessionStorage`, clé `intro:played`), au premier affichage après connexion.
- Bouton « Passer » en haut à droite (visible dès 0,5 s, `aria-label="Passer l'intro"`). Échap et un clic sur le bouton arrêtent aussi l'intro : sons coupés, fondu rapide de 0,3 s.
- Le calque est retiré du DOM à la fin. Le site derrière est déjà affiché et interactif dès que l'intro se termine ou est passée.
- Deux réglages dans les paramètres du profil, stockés dans `localStorage` pour l'instant : « Intro cinéma » et « Son de l'intro ».

## Vérifications finales

1. Première connexion de la session : l'intro se joue en entier, puis le site apparaît.
2. Rechargement de la page : l'intro ne se rejoue pas.
3. Bouton « Passer » et touche Échap : arrêt immédiat, sons coupés.
4. Réglage « Intro cinéma » désactivé, ou `prefers-reduced-motion` actif : aucune intro.
5. Fichiers audio absents : l'intro se joue sans son, sans erreur dans la console.
6. Mobile (largeur 375 px) : le faisceau reste dans l'écran et finit bien sur le seau de pop-corn.
7. Le score Lighthouse de la page d'accueil ne baisse pas de plus de 2 points.

## Hors périmètre

Intro pour les visiteurs non connectés, variantes saisonnières, autres effets sonores.
