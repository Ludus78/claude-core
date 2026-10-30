# Roadmap SéanceClub

Source de vérité : `CONTEXTE.md`, sections 3 et 4. Ce fichier en est le suivi cochable, à garder aligné.

Rythme : environ 10 heures par semaine, 22 semaines.

| Phase | Semaines | Contenu |
|---|---|---|
| 0. Validation | 1 à 3 | Points bloquants, vraie liste d'attente |
| 1. Fondations | 4 à 6 | Application web, base, connexion, inscription avec règles d'âge |
| 2. Films et score | 7 à 10 | Données de films avec cache, fiche film, vus, notes, score, profil |
| 3. Avis et sorties | 11 à 12 | Avis, vote « OK ou pas », calendrier, signalement, back-office |
| 4. Séances | 13 à 16 | Serveur temps réel, salons, compte à rebours, chat, modération |
| 5. Bêta fermée | 17 à 19 | 30 à 50 testeurs, corrections, sécurité, documents RGPD |
| 6. Premium et lancement | 20 à 22 | Stripe, fonctions premium, licence API confirmée, ouverture publique |

## Phase 0 : validation (en cours)

Toutes ces tâches sont à ta main ou demandent ta validation.

- [ ] Écrire à TMDB pour la licence commerciale et tester la récupération de la classification d'âge française (validation requise)
- [ ] Vérifier la marque à l'INPI, acheter le domaine, réserver les pseudos (validation requise)
- [ ] Recopier la liste de référence (250 titres) dans un tableur, remplir `genre_families` et `country_regions` (validation requise)
- [ ] Rédiger conditions d'utilisation, politique de confidentialité, mentions légales ; faire valider l'accord parental (validation requise)
- [ ] Définir les règles du chat : déroulé d'une séance, synchronisation, modération, conservation (validation requise)
- [ ] Prévoir un back-office minimal : corriger une classification, traiter les signalements, bannir (validation requise)
- [ ] Compléter les maquettes : inscription, profil et score, recherche, listes, premium, mobile (validation requise)
- [ ] Choisir l'hébergement du serveur de chat et le service d'e-mails (validation requise)
- [ ] Remplacer la démo du quiz par une vraie liste d'attente avec consentement RGPD (validation requise)

## Phase 1 : fondations (semaines 4 à 6, à démarrer après la phase 0)

La base technique est déjà dans ce dossier (`db/`, `packages/score/`, `docker-compose.yml`, `apps/` vide). Voir le `README.md`.

- [x] Créer l'application : `apps/web` (Next.js, TypeScript, Tailwind) (validation requise : nouvelles dépendances) — 2026-10-29
- [x] Brancher la base (`DATABASE_URL`) et choisir l'accès aux données (validation requise) — 2026-10-29
- [x] Auth.js : Google, Discord (validation requise) — 2026-10-29
- [ ] Auth.js : connexion par e-mail (après le choix du service d'e-mails, validation requise)
- [ ] Inscription : pseudo unique, date de naissance, consentement ; refus sous 13 ans ; compte `pending_parental` pour moins de 15 ans (fait côté serveur : `server/signup.ts`, `server/users.ts`, `server/parental.ts` ; reste le formulaire, l'écran de saisie de l'e-mail du parent et l'envoi du lien, qui attend le choix du service d'e-mails)
- [x] Reprendre les couleurs des maquettes : fond `#0E0E10`, texte `#F5F2EC`, accent `#D7263D` — 2026-10-29
- [ ] Premiers écrans : accueil, inscription, profil

## Phases 2 à 6

Voir le tableau ci-dessus et `CONTEXTE.md`. Elles seront détaillées quand la phase 1 sera lancée.
