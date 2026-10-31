# Cadrage produit de la 2.0 (décisions du 2026-10-31)

Source : questions-réponses avec le propriétaire, après `audit-site.md`.

## Décisions
- **Positionnement** : boîte à outils nationale (calculateurs et guides). Le titre « expert immobilier à Paris » est à remplacer.
- **Public à faire revenir** : primo-accédants et investisseurs locatifs. Les vendeurs et le viager passent au second plan.
- **Mécanismes de retour** : newsletter mensuelle (avec consentement), compte Kinde avec simulations sauvegardées, contenu Instagram qui renvoie au site (liens `utm_*` suivis dans PostHog).
- **Moyens** : moins de 3 h par semaine, pas de revenu visé pour l'instant. Donc tout ce qui est automatisable passe avant le reste, et l'audience passe avant la monétisation.

## Conséquences à proposer (à valider une par une)
1. Garder 2 calculateurs au cœur du site : achat/capacité d'emprunt (primo-accédants) et locatif (investisseurs). Fusionner les pages en doublon. Le viager reste, sans mise en avant.
2. Réécrire titre, description et accueil pour un public national.
3. Sauvegarde des simulations liée au compte Kinde (déjà en phase 2 de la roadmap).
4. Newsletter mensuelle : choisir l'outil d'envoi (nouvelle dépendance ou service externe, à valider), consentement avant inscription.
5. Contenu automatisé : actualités alimentées sans intervention (source et licence à vérifier à la source).
6. Événements PostHog : usage de chaque calculateur, inscription newsletter, création de compte.

## À renseigner
- Instagram (relevé le 2026-11-01) : compte `@ludvicdenis`, nom affiché « Immonova », catégorie Immobilier, 16 publications, 924 abonnés, 3 069 abonnements. La bio renvoie déjà vers immonova.org, sans paramètre `utm_*`. À revoir : le sujet des publications, le taux d'engagement (statistiques du compte, à relever à la source).
- Outil d'envoi de la newsletter (aucun choisi).
- Le projet PostHog 57808 ne suit-il que immonova.org ? (à confirmer)
