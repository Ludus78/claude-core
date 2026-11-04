# Audit des pages (`app/`)

Lecture du code seule, aucune modification de l'application. État au 2026-11-04.

## Pages (23)

| Route | Rôle | Remarques |
|---|---|---|
| `/` | Accueil : bandeau photo, cartes vers les outils | Ouvre `/calculateurs` pour « Achat » |
| `/achat` | Sommaire du guide primo-accédant | Contenu dans `app/achat/etapes.ts` |
| `/achat/[etape]` | Une page par étape du guide (8 étapes) | |
| `/actualites` | Liste des actualités (base, secours statique) | Client |
| `/actualites/[id]` | Détail d'un article | Client |
| `/calculette` | Simulateur de prêt « version classique » (achat) | Voir doublons |
| `/calculateurs` | Page de choix entre deux versions du simulateur de prêt | Voir doublons |
| `/calculateurs/pret` | Simulateur de prêt « version moderne » (onglets, 368 lignes) | Voir doublons |
| `/calculette-locative` | Calculette d'investissement locatif | |
| `/calculette-viager` | Calculette d'investissement en viager | |
| `/estimation` | Estimation détaillée d'un bien | |
| `/frais-annexes` | Estimation des frais annexes | |
| `/diagnostics` | Diagnostics techniques obligatoires | Contenu informatif |
| `/documents` | Documents essentiels | |
| `/mise-en-valeur` | Mise en valeur d'un bien | |
| `/vente` | Vendre un bien (`VenteClient`) | Métadonnées mentionnent « Paris » |
| `/contact` | Formulaire de contact | |
| `/qui-suis-je` | Présentation | |
| `/confidentialite` | Politique de confidentialité (brouillon à valider) | |
| `/dashboard` | Tableau de bord connecté | Privé |
| `/admin` | Administration (e-mails de `ADMIN_EMAILS`) | Privé, `noindex` |
| `/inscription` | Ancien formulaire d'inscription | À rattacher à Kinde |
| `/reset-password` | Ancien formulaire de réinitialisation | Lié à l'ancienne authentification |

## Doublons probables

- **Simulateur de prêt : trois pages avec le même titre « Simulateur de prêt immobilier »** : `/calculette`, `/calculateurs` (page de choix) et `/calculateurs/pret`. `/calculette` renvoie vers `/calculateurs/pret`, `/calculateurs` propose les deux, et l'accueil pointe vers `/calculateurs` alors que les autres liens (popup, tableau de bord) pointent ailleurs. Il n'y a pas de métadonnées propres à chaque page : trois pages concurrentes sur la même requête.
- `/calculette-locative` et `/calculette-viager` ne font pas doublon avec les précédentes (calculs distincts) ; le nom `calculette` / `calculateurs` mélange les deux conventions.
- `/diagnostics` (page) et `/diagnostic` (lien de `Navigation.tsx`) : voir liens cassés.

## Liens internes sans page

- `/connexion` et `/profil` : liés depuis `SharedLayout.tsx` (`MobileMenu`), `inscription` et `reset-password`. `MobileMenu` n'est utilisé nulle part ; la connexion passe par Kinde (`/api/auth/...`).
- `/diagnostic`, `/amelioration`, `/professionnels`, `/espaces-verts`, `/ecoles` : liés depuis `app/components/Navigation.tsx`, qui n'est importé nulle part (composant inutilisé). Aucune de ces routes n'existe.

## Composants inutilisés repérés au passage

- `app/components/Navigation.tsx` (ancien menu aux liens morts).
- `MobileMenu` dans `app/components/SharedLayout.tsx` (défini, jamais rendu).
- `app/head.tsx` et `components/UserPersonas.tsx` : déjà signalés dans la roadmap.

## À décider (tâches à valider)

1. Garder une seule page de simulateur de prêt (probablement `/calculateurs/pret`) et rediriger `/calculette` et `/calculateurs`, ou assumer deux versions avec des titres distincts.
2. Supprimer `Navigation.tsx` et `MobileMenu`, ou créer les pages annoncées (aucune n'est prévue dans `docs/produit.md`).
3. Rattacher `/inscription` et `/reset-password` à Kinde, ou les retirer.
4. Retirer « Paris » des métadonnées de `/vente` (positionnement national).
