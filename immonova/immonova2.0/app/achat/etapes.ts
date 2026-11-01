// Guide de l'achat pour les primo-accédants : une entrée par étape.
// `publiee: false` : l'étape est listée « bientôt » et sa page répond 404.
// Tout chiffre ou règle est daté (`misAJour`) et signalé « à vérifier à la source ».

export type Bloc =
  | { type: 'titre'; texte: string }
  | { type: 'texte'; texte: string }
  | { type: 'liste'; items: string[] }
  | { type: 'encadre'; variante: 'piege' | 'astuce' | 'verifier'; titre: string; texte: string }
  | { type: 'calculette'; label: string; href: string };

export type Etape = {
  slug: string;
  numero: number;
  titre: string;
  resume: string;
  duree: string;
  publiee: boolean;
  misAJour?: string;
  blocs: Bloc[];
  sources: { label: string; url: string }[];
};

export const ETAPES: Etape[] = [
  {
    slug: 'budget',
    numero: 1,
    titre: 'Définir son projet et son budget',
    resume: 'Combien pouvez-vous emprunter, et surtout combien pouvez-vous dépenser sans vous mettre en difficulté ?',
    duree: '1 à 2 semaines',
    publiee: true,
    misAJour: '2026-11-01',
    blocs: [
      { type: 'titre', texte: 'Commencez par le projet, pas par le prix' },
      {
        type: 'texte',
        texte:
          'Avant de regarder des annonces, posez les bases. Un projet clair évite de visiter pour rien et de se laisser séduire par un bien qui ne correspond pas à vos besoins.',
      },
      {
        type: 'liste',
        items: [
          'Résidence principale ou investissement : les règles de financement et les aides ne sont pas les mêmes.',
          'Où : la ville, le quartier, le temps de trajet acceptable, les transports.',
          'Quoi : surface minimale, nombre de pièces, extérieur, étage, neuf ou ancien.',
          'Travaux : jusqu\'où êtes-vous prêt à aller, et avec quel budget ?',
          'Quand : dans combien de temps voulez-vous emménager ?',
        ],
      },
      { type: 'titre', texte: 'La règle des 35 % : ce que les banques acceptent' },
      {
        type: 'texte',
        texte:
          'Les banques suivent des recommandations du Haut Conseil de stabilité financière (HCSF). Les deux repères à retenir : l\'ensemble de vos mensualités de crédit, assurance de l\'emprunt comprise, ne doit pas dépasser environ 35 % de vos revenus nets, et la durée du prêt est limitée à 25 ans, avec une durée plus longue possible dans certains cas (par exemple un achat sur plan ou des travaux importants).',
      },
      {
        type: 'texte',
        texte:
          'Exemple : avec 3 500 € de revenus nets par mois pour le foyer, 35 % représentent 1 225 € de mensualités au maximum. Si vous remboursez déjà un crédit auto de 200 €, il reste environ 1 025 € pour le prêt immobilier, assurance comprise.',
      },
      {
        type: 'encadre',
        variante: 'verifier',
        titre: 'À vérifier à la source',
        texte:
          'Ces règles sont des recommandations qui s\'appliquent depuis 2022 et qui peuvent changer. Les banques disposent aussi d\'une petite marge pour faire des exceptions. Contrôlez l\'état actuel auprès du HCSF ou de votre banque avant de vous appuyer sur ces chiffres.',
      },
      { type: 'titre', texte: 'Au-delà de l\'endettement : le reste à vivre' },
      {
        type: 'texte',
        texte:
          'Un dossier peut être accepté par la banque et pourtant être trop juste pour vous. Regardez ce qu\'il vous reste chaque mois après la mensualité : alimentation, transports, assurances, loisirs, imprévus. Si vous partez d\'un loyer bas, le saut peut être important.',
      },
      { type: 'titre', texte: 'L\'apport : à quoi il sert' },
      {
        type: 'texte',
        texte:
          'L\'apport est l\'argent que vous mettez de vous-même. Beaucoup de banques demandent qu\'il couvre au moins les frais de notaire et de garantie, mais les exigences varient d\'une banque à l\'autre. Gardez toujours une épargne de précaution : ne mettez pas tout dans l\'apport.',
      },
      { type: 'titre', texte: 'Le budget total : le prix affiché n\'est pas le prix payé' },
      {
        type: 'liste',
        items: [
          'Frais de notaire : environ 7 à 8,5 % du prix dans l\'ancien, environ 2 à 3 % dans le neuf. Le taux dépend du département.',
          'Frais de garantie du prêt (caution ou hypothèque) et frais de dossier de la banque.',
          'Honoraires de l\'agence si ils sont à votre charge : regardez si le prix de l\'annonce les inclut.',
          'Travaux, déménagement, mobilier et équipement.',
          'Après l\'achat : taxe foncière, charges de copropriété, assurance habitation.',
        ],
      },
      {
        type: 'encadre',
        variante: 'piege',
        titre: 'Piège classique',
        texte:
          'Calculer son budget sur le prix de l\'annonce seulement. Ajoutez toujours les frais de notaire et de garantie, puis les travaux éventuels, avant de décider de votre prix maximum.',
      },
      {
        type: 'encadre',
        variante: 'astuce',
        titre: 'Astuce',
        texte:
          'Faites varier la durée, l\'apport et le taux dans la calculette pour voir leur effet sur votre mensualité. Les taux changent : testez plusieurs hypothèses, pas une seule.',
      },
      { type: 'calculette', label: 'Ouvrir la calculette d\'achat', href: '/calculette' },
    ],
    sources: [
      { label: 'Haut Conseil de stabilité financière (HCSF)', url: 'https://www.hcsf.fr/' },
      { label: 'ANIL : conseils sur le logement', url: 'https://www.anil.org/' },
      { label: 'Service-public.fr', url: 'https://www.service-public.fr/' },
    ],
  },
  {
    slug: 'financement',
    numero: 2,
    titre: 'Comprendre le financement',
    resume: 'Types de prêts, coût réel du crédit, assurance, garantie, PTZ : ce qu\'il faut comprendre avant de voir une banque.',
    duree: '2 à 4 semaines',
    publiee: true,
    misAJour: '2026-11-01',
    blocs: [
      { type: 'titre', texte: 'Les grandes familles de prêts' },
      {
        type: 'liste',
        items: [
          'Le prêt amortissable à taux fixe : le plus courant. Le taux et la mensualité ne bougent pas pendant toute la durée, ce qui permet de prévoir son budget.',
          'Le prêt à taux variable : la mensualité ou la durée peut changer avec les taux. Il comporte un risque, lisez bien les plafonds de variation du contrat.',
          'Les prêts aidés : le prêt à taux zéro (PTZ), le prêt d\'Action Logement pour certains salariés, le prêt d\'accession sociale. Chacun a ses conditions de ressources et de logement.',
        ],
      },
      { type: 'titre', texte: 'Le PTZ en bref' },
      {
        type: 'texte',
        texte:
          'Le prêt à taux zéro est un prêt sans intérêts destiné à des primo-accédants, c\'est-à-dire des personnes qui n\'ont pas été propriétaires de leur résidence principale ces dernières années (avec quelques exceptions). Il est soumis à des conditions de ressources, vise la résidence principale et complète un prêt principal : il ne finance jamais tout le projet, ni les frais de notaire.',
      },
      {
        type: 'texte',
        texte:
          'Selon les sources consultées en novembre 2026, il serait reconduit jusqu\'à fin 2027, ouvert pour le logement neuf sur tout le territoire, et pour l\'ancien seulement avec des travaux importants dans certaines zones.',
      },
      {
        type: 'encadre',
        variante: 'verifier',
        titre: 'À vérifier à la source',
        texte:
          'Le PTZ change souvent : plafonds de ressources, zones, logements concernés, durée de reconduction. Plusieurs des sources que nous avons consultées sont des sites de courtiers ou de comparateurs. Vérifiez les conditions du moment sur service-public.fr ou auprès de votre banque avant de compter dessus.',
      },
      { type: 'titre', texte: 'Le coût réel du crédit : ne regardez pas que le taux' },
      {
        type: 'texte',
        texte:
          'Le taux affiché n\'est pas tout. Le TAEG (taux annuel effectif global) ajoute l\'assurance, les frais de dossier et de garantie : c\'est lui qu\'il faut comparer entre deux offres.',
      },
      {
        type: 'texte',
        texte:
          'La durée change beaucoup le coût. Exemple fictif, avec un taux de 3,5 % uniquement pour illustrer, sans l\'assurance : pour emprunter 200 000 €, la mensualité est d\'environ 1 160 € sur 20 ans, avec environ 78 400 € d\'intérêts au total. Sur 25 ans, elle tombe à environ 1 001 €, mais les intérêts montent à environ 100 400 €. Vous gagnez environ 159 € par mois et payez environ 22 000 € de plus au total.',
      },
      { type: 'titre', texte: 'L\'assurance emprunteur' },
      {
        type: 'texte',
        texte:
          'La banque exige en pratique une assurance qui rembourse le prêt en cas de décès ou d\'invalidité. Vous n\'êtes pas obligé de prendre celle de la banque : vous pouvez choisir un autre contrat présentant des garanties équivalentes (délégation d\'assurance), et la loi permet de la changer à tout moment. Pour certains prêts de montant modéré, le questionnaire de santé peut être supprimé : les conditions sont à vérifier.',
      },
      { type: 'titre', texte: 'La garantie du prêt' },
      {
        type: 'texte',
        texte:
          'La banque demande une garantie au cas où vous ne pourriez plus rembourser : une caution fournie par un organisme, ou une hypothèque. Elles ont un coût qui s\'ajoute à votre budget, et pour certaines cautions une partie peut être restituée en fin de prêt.',
      },
      { type: 'titre', texte: 'Banque ou courtier ?' },
      {
        type: 'texte',
        texte:
          'Un courtier compare plusieurs banques à votre place et peut négocier le taux et l\'assurance. Il est rémunéré par une commission, parfois payée par vous, parfois par la banque : demandez comment il gagne sa vie et à quel montant, avant de signer un mandat.',
      },
      { type: 'titre', texte: 'Préparer son dossier' },
      {
        type: 'liste',
        items: [
          'Pièce d\'identité et justificatif de domicile.',
          'Contrat de travail et trois derniers bulletins de salaire.',
          'Deux derniers avis d\'imposition.',
          'Trois derniers relevés de comptes, avec l\'historique de votre épargne.',
          'Tableaux d\'amortissement de vos crédits en cours, le cas échéant.',
          'Justificatifs de l\'origine de l\'apport.',
        ],
      },
      {
        type: 'encadre',
        variante: 'piege',
        titre: 'Piège classique',
        texte:
          'Ne comparer que le taux, ou accepter la première offre reçue. Demandez plusieurs propositions et comparez le TAEG, le coût de l\'assurance, les frais de dossier et les possibilités de modifier le prêt plus tard.',
      },
      { type: 'calculette', label: 'Simuler votre prêt', href: '/calculateurs/pret' },
    ],
    sources: [
      { label: 'Service-public.fr : prêt à taux zéro', url: 'https://www.service-public.fr/' },
      { label: 'ANIL : financer son logement', url: 'https://www.anil.org/' },
      { label: 'Banque de France : crédit immobilier', url: 'https://www.banque-france.fr/' },
    ],
  },
  {
    slug: 'recherche',
    numero: 3,
    titre: 'Chercher et visiter un bien',
    resume: 'Critères, DPE, visite, copropriété : comment repérer un bon bien et éviter les mauvaises surprises.',
    duree: 'Quelques semaines à quelques mois',
    publiee: true,
    misAJour: '2026-11-01',
    blocs: [
      { type: 'titre', texte: 'Triez vos critères : indispensable ou souhaitable' },
      {
        type: 'texte',
        texte:
          'Séparez ce que vous ne négocierez jamais (le quartier, le nombre de chambres, le budget maximum) de ce qui serait un plus (un balcon, un étage élevé, une cave). Un bien qui coche tous les indispensables est déjà rare : inutile de viser la perfection.',
      },
      { type: 'titre', texte: 'Où chercher' },
      {
        type: 'liste',
        items: [
          'Les sites d\'annonces et les alertes par e-mail, pour être prévenu dès la mise en ligne.',
          'Les agences de votre secteur : dites-leur précisément ce que vous cherchez, certains biens ne passent jamais en annonce.',
          'Les notaires, qui vendent aussi des biens.',
          'Votre entourage et les panneaux dans la rue du quartier visé.',
        ],
      },
      {
        type: 'encadre',
        variante: 'piege',
        titre: 'Prix affiché : avec ou sans honoraires ?',
        texte:
          'Un prix peut inclure les honoraires de l\'agence (charge vendeur) ou non (charge acquéreur). Regardez toujours la mention dans l\'annonce : la différence se chiffre en milliers d\'euros.',
      },
      { type: 'titre', texte: 'Savoir si le prix est cohérent' },
      {
        type: 'texte',
        texte:
          'Comparez avec les ventes réellement conclues dans le quartier, pas seulement avec les annonces. Les « demandes de valeurs foncières » (DVF) sont une base publique qui liste les ventes passées avec leur prix et leur surface. Gardez en tête qu\'un bien peut valoir plus ou moins cher selon son état, son étage ou sa luminosité.',
      },
      { type: 'titre', texte: 'Le DPE et les diagnostics' },
      {
        type: 'texte',
        texte:
          'Le diagnostic de performance énergétique (DPE) classe le logement de A (très économe) à G (très énergivore). Il se traduit directement en factures de chauffage et en travaux possibles. Le vendeur doit aussi fournir un dossier de diagnostics (amiante, plomb, électricité, gaz, risques, selon l\'âge du bien et sa situation).',
      },
      {
        type: 'encadre',
        variante: 'verifier',
        titre: 'À vérifier à la source',
        texte:
          'Des règles limitent progressivement la location des logements les plus énergivores, et le calendrier ainsi que la méthode du DPE ont déjà évolué. Si vous pensez louer le bien un jour, contrôlez l\'état actuel de la réglementation avant d\'acheter.',
      },
      { type: 'titre', texte: 'La visite : ce qu\'il faut regarder' },
      {
        type: 'liste',
        items: [
          'Humidité : taches, odeurs de moisi, peinture qui cloque, surtout autour des fenêtres et dans les angles.',
          'Fenêtres et isolation : double vitrage, courants d\'air, état des volets.',
          'Électricité : tableau récent ou ancien, prises suffisantes, disjoncteurs.',
          'Plomberie : ouvrez les robinets, testez la pression, regardez sous les éviers.',
          'Chauffage : type, âge de la chaudière ou des radiateurs, factures du vendeur.',
          'Lumière et bruit : visitez à plusieurs moments de la journée, fenêtres ouvertes.',
          'Parties communes, entrée, ascenseur, local à vélos, état général de l\'immeuble.',
        ],
      },
      { type: 'titre', texte: 'Les questions à poser' },
      {
        type: 'liste',
        items: [
          'Depuis quand le bien est-il en vente, et pourquoi le vendeur vend-il ?',
          'Quel est le montant des charges et de la taxe foncière ?',
          'Des travaux ont-ils été réalisés ou votés dans l\'immeuble ? Qui les a payés ?',
          'Y a-t-il eu des sinistres, des litiges avec des voisins ou la copropriété ?',
        ],
      },
      { type: 'titre', texte: 'En copropriété : demandez ces documents' },
      {
        type: 'liste',
        items: [
          'Les procès-verbaux des dernières assemblées générales, pour repérer des travaux votés, des impayés ou des conflits.',
          'Le montant des charges des derniers exercices et le budget prévisionnel.',
          'Le règlement de copropriété, qui dit ce que vous avez le droit de faire.',
          'Le carnet d\'entretien de l\'immeuble.',
          'Les documents liés aux travaux à venir et au fonds de travaux, selon l\'âge et la taille de l\'immeuble (à vérifier).',
        ],
      },
      {
        type: 'encadre',
        variante: 'astuce',
        titre: 'Astuce',
        texte:
          'Faites une deuxième visite avant de décider, de préférence avec une personne de confiance ou un artisan pour estimer les travaux. Prenez des photos et des mesures pour prévoir l\'aménagement.',
      },
      { type: 'calculette', label: 'Estimer le budget et les frais', href: '/frais-annexes' },
    ],
    sources: [
      { label: 'Demandes de valeurs foncières (DVF)', url: 'https://app.dvf.etalab.gouv.fr/' },
      { label: 'ANIL : conseils sur le logement', url: 'https://www.anil.org/' },
      { label: 'Service-public.fr : diagnostics immobiliers', url: 'https://www.service-public.fr/' },
    ],
  },
  {
    slug: 'offre',
    numero: 4,
    titre: 'Faire une offre',
    resume: 'Négocier le prix et formuler une offre d\'achat écrite.',
    duree: 'Quelques jours',
    publiee: true,
    misAJour: '2026-11-01',
    blocs: [
      { type: 'titre', texte: 'Avant d\'offrir : vérifiez vos fondations' },
      {
        type: 'liste',
        items: [
          'Vous avez visité le bien au moins deux fois et regardé les diagnostics.',
          'Vous connaissez votre budget total, frais compris (étape 1).',
          'Vous avez un accord de principe de votre banque ou de votre courtier. Ce n\'est pas un engagement de prêt, mais cela montre que votre projet tient la route.',
        ],
      },
      { type: 'titre', texte: 'Négocier le prix' },
      {
        type: 'texte',
        texte:
          'Une négociation se prépare avec des arguments, pas avec un pourcentage arbitraire. Les marges varient énormément selon le marché local et la durée de mise en vente.',
      },
      {
        type: 'liste',
        items: [
          'Les ventes récentes du quartier : un prix demandé supérieur aux ventes conclues est un argument.',
          'Les travaux à prévoir et un DPE faible : chiffrez-les, idéalement avec un devis.',
          'La durée de mise en vente : un bien en vente depuis longtemps laisse en général plus de marge.',
          'Les défauts constatés à la visite et dans les documents de copropriété.',
        ],
      },
      {
        type: 'encadre',
        variante: 'piege',
        titre: 'Piège classique',
        texte:
          'Annoncer son budget maximum. Gardez-le pour vous : votre offre doit se justifier par le bien, pas par ce que vous pouvez payer.',
      },
      { type: 'titre', texte: 'L\'offre d\'achat écrite' },
      {
        type: 'texte',
        texte:
          'Une offre se fait par écrit, auprès de l\'agence ou directement du vendeur. Elle précise au minimum :',
      },
      {
        type: 'liste',
        items: [
          'le bien concerné, avec son adresse et sa description ;',
          'le prix proposé, et qui paie les honoraires de l\'agence ;',
          'les conditions, en particulier l\'obtention d\'un prêt (condition suspensive) ;',
          'la durée pendant laquelle l\'offre reste valable, par exemple quelques jours ;',
          'la date et votre signature.',
        ],
      },
      {
        type: 'encadre',
        variante: 'piege',
        titre: 'Une offre acceptée peut vous engager',
        texte:
          'Si le vendeur accepte votre offre par écrit dans le délai, vous pouvez être tenu de poursuivre. Ne signez rien à la légère sous la pression (« un autre acheteur attend »), et ajoutez toujours la condition de financement.',
      },
      { type: 'titre', texte: 'Et ensuite ?' },
      {
        type: 'texte',
        texte:
          'Si l\'offre est acceptée, le bien est en général retiré de la vente et l\'on prépare le compromis de vente. Vous avez le droit de choisir votre notaire, sans que cela augmente vos frais : le vendeur a le sien, et les deux se partagent la rémunération.',
      },
      {
        type: 'encadre',
        variante: 'verifier',
        titre: 'À vérifier à la source',
        texte:
          'La valeur juridique d\'une offre d\'achat dépend de sa rédaction et de ce qui a été accepté. En cas de doute, faites relire le texte par un notaire ou par un conseiller de l\'ADIL avant de signer.',
      },
      { type: 'calculette', label: 'Simuler votre prêt avec ce prix', href: '/calculette' },
    ],
    sources: [
      { label: 'Service-public.fr : acheter un logement', url: 'https://www.service-public.fr/' },
      { label: 'ANIL / ADIL : conseil juridique gratuit sur le logement', url: 'https://www.anil.org/' },
      { label: 'Notaires de France', url: 'https://www.notaires.fr/' },
    ],
  },
  {
    slug: 'compromis',
    numero: 5,
    titre: 'Signer le compromis de vente',
    resume: 'Clauses suspensives, délai de rétractation, dépôt de garantie.',
    duree: '1 jour, puis un délai de réflexion',
    publiee: true,
    misAJour: '2026-11-01',
    blocs: [
      { type: 'titre', texte: 'Ce qu\'est le compromis' },
      {
        type: 'texte',
        texte:
          'Le compromis de vente (ou promesse de vente) est le contrat signé entre vous et le vendeur une fois l\'offre acceptée. Il fixe le prix, les conditions et la date limite pour signer l\'acte définitif chez le notaire. Il est rédigé par l\'agence ou par un notaire, et il vous engage : lisez-le avec attention.',
      },
      { type: 'titre', texte: 'Ce qu\'on y trouve' },
      {
        type: 'liste',
        items: [
          'L\'identité du vendeur et de l\'acheteur, la description précise du bien.',
          'Le prix, la répartition des honoraires de l\'agence, le mode de paiement.',
          'Les conditions suspensives, c\'est-à-dire les événements dont dépend la vente.',
          'Le dépôt de garantie versé à la signature.',
          'La date limite de signature de l\'acte authentique.',
          'Les diagnostics et documents de copropriété remis par le vendeur.',
        ],
      },
      { type: 'titre', texte: 'Le délai de rétractation de 10 jours' },
      {
        type: 'texte',
        texte:
          'Après la signature, un acheteur particulier dispose de 10 jours pour changer d\'avis, sans avoir à se justifier ni à payer de pénalité. Le délai court à partir du lendemain de la remise du compromis, en main propre ou par courrier recommandé, selon le cas. Si vous vous rétractez dans ce délai, le dépôt de garantie vous est rendu.',
      },
      {
        type: 'encadre',
        variante: 'verifier',
        titre: 'À vérifier à la source',
        texte:
          'Le point de départ exact du délai et le délai de restitution du dépôt dépendent de la façon dont le compromis vous est notifié. Regardez la mention dans votre contrat et vérifiez sur service-public.fr.',
      },
      { type: 'titre', texte: 'Le dépôt de garantie' },
      {
        type: 'texte',
        texte:
          'Son montant est libre, souvent entre 5 et 10 % du prix. Il est bloqué chez le notaire ou l\'agence, puis déduit du prix à la signature de l\'acte. Si vous renoncez après le délai de rétractation sans motif prévu par le contrat, le vendeur peut le conserver.',
      },
      { type: 'titre', texte: 'Les conditions suspensives qui vous protègent' },
      {
        type: 'liste',
        items: [
          'L\'obtention du prêt : si la banque refuse dans les conditions prévues (montant, durée, taux maximum, délai), la vente tombe et vous récupérez le dépôt. Le délai est souvent d\'environ 45 à 60 jours.',
          'Le droit de préemption de la commune : elle peut acheter à votre place dans certaines zones, dans un délai de deux mois.',
          'La vente de votre bien actuel, si vous devez vendre pour acheter.',
          'L\'absence de servitude ou de problème d\'urbanisme non annoncé.',
        ],
      },
      {
        type: 'encadre',
        variante: 'piege',
        titre: 'Piège classique',
        texte:
          'Déposer une demande de prêt qui ne correspond pas aux conditions du compromis, ou trop tard. Si votre refus de prêt ne respecte pas les conditions du contrat, le vendeur peut garder le dépôt. Gardez les refus de la banque par écrit.',
      },
      {
        type: 'encadre',
        variante: 'astuce',
        titre: 'Astuce',
        texte:
          'Demandez le projet de compromis quelques jours avant la signature, et faites-le relire par une personne de confiance ou un notaire. Vérifiez que le prêt mentionné correspond à votre vrai projet de financement.',
      },
      { type: 'calculette', label: 'Vérifier vos conditions de prêt', href: '/calculateurs/pret' },
    ],
    sources: [
      { label: 'Service-public.fr : délai de rétractation', url: 'https://www.service-public.fr/' },
      { label: 'ANIL / ADIL : conseil juridique gratuit', url: 'https://www.anil.org/' },
      { label: 'Notaires de France : l\'avant-contrat', url: 'https://www.notaires.fr/' },
    ],
  },
  {
    slug: 'pret',
    numero: 6,
    titre: 'Obtenir son prêt',
    resume: 'Du dossier bancaire à l\'offre de prêt acceptée.',
    duree: '1 à 2 mois',
    publiee: true,
    misAJour: '2026-11-01',
    blocs: [
      { type: 'titre', texte: 'Déposez votre dossier sans attendre' },
      {
        type: 'texte',
        texte:
          'Le délai de la condition suspensive court dès la signature du compromis. Déposez votre dossier dans les jours qui suivent, auprès de votre banque ou de plusieurs banques, ou confiez-le à un courtier. Utilisez l\'accord de principe obtenu plus tôt comme point de départ.',
      },
      { type: 'titre', texte: 'Les grandes étapes' },
      {
        type: 'liste',
        items: [
          'Étude du dossier par la banque, qui peut demander des pièces complémentaires.',
          'Accord de la banque, puis émission de l\'offre de prêt officielle.',
          'Votre acceptation de l\'offre, après un délai de réflexion obligatoire.',
          'Mise en place de l\'assurance et de la garantie.',
          'Déblocage des fonds chez le notaire le jour de la signature de l\'acte.',
        ],
      },
      { type: 'titre', texte: 'L\'offre de prêt : le délai de réflexion' },
      {
        type: 'texte',
        texte:
          'Une fois l\'offre reçue, la loi vous impose un délai de réflexion de 10 jours avant de pouvoir l\'accepter : vous ne pouvez pas la signer le jour même. L\'offre reste valable au moins 30 jours. Profitez de ce temps pour la relire à tête reposée et la comparer.',
      },
      { type: 'titre', texte: 'Ce qu\'il faut vérifier dans l\'offre' },
      {
        type: 'liste',
        items: [
          'Le montant emprunté, la durée, le taux et le TAEG.',
          'Le coût de l\'assurance et la possibilité de la changer.',
          'La garantie retenue (caution ou hypothèque) et son coût.',
          'Les conditions de remboursement anticipé : les indemnités sont plafonnées par la loi (à vérifier), mais les modalités varient.',
          'La possibilité de moduler les mensualités ou de reporter une échéance.',
          'La date limite d\'acceptation, à respecter avant l\'échéance de votre condition suspensive.',
        ],
      },
      {
        type: 'encadre',
        variante: 'piege',
        titre: 'Piège classique',
        texte:
          'Changer de situation entre l\'accord et la signature : un nouveau crédit, un changement d\'emploi ou un gros achat peut pousser la banque à retirer son accord. Gardez votre situation stable jusqu\'au déblocage des fonds.',
      },
      {
        type: 'encadre',
        variante: 'astuce',
        titre: 'Astuce',
        texte:
          'Mettez en concurrence l\'assurance de la banque avec une assurance externe : à garanties équivalentes, l\'écart peut représenter plusieurs milliers d\'euros sur la durée du prêt. Demandez le détail du coût total de chaque contrat.',
      },
      {
        type: 'encadre',
        variante: 'verifier',
        titre: 'À vérifier à la source',
        texte:
          'Les règles sur le délai de réflexion, la durée de validité de l\'offre et les indemnités de remboursement anticipé sont fixées par la loi et peuvent évoluer. Vérifiez-les sur service-public.fr ou auprès de votre banque.',
      },
      { type: 'calculette', label: 'Comparer des scénarios de prêt', href: '/calculateurs/pret' },
    ],
    sources: [
      { label: 'Service-public.fr : offre de prêt immobilier', url: 'https://www.service-public.fr/' },
      { label: 'Banque de France : crédit immobilier', url: 'https://www.banque-france.fr/' },
      { label: 'ANIL : financer son logement', url: 'https://www.anil.org/' },
    ],
  },
  {
    slug: 'acte',
    numero: 7,
    titre: 'Signer l\'acte chez le notaire',
    resume: 'La dernière ligne droite avant d\'avoir les clés.',
    duree: '2 à 3 mois après le compromis',
    publiee: true,
    misAJour: '2026-11-01',
    blocs: [
      { type: 'titre', texte: 'Ce que fait le notaire entre les deux signatures' },
      {
        type: 'texte',
        texte:
          'Pendant que vous obtenez votre prêt, le notaire prépare l\'acte définitif. Il vérifie que le vendeur est bien propriétaire, que le bien n\'a pas de dette ou de charge cachée, que le droit de préemption de la commune a été purgé, puis calcule les frais et rédige l\'acte. Le délai habituel entre le compromis et l\'acte est de deux à trois mois, avec une date limite inscrite dans le compromis.',
      },
      { type: 'titre', texte: 'D\'où viennent les « frais de notaire »' },
      {
        type: 'texte',
        texte:
          'Ce nom est trompeur. La grande majorité de la somme correspond à des taxes reversées à l\'État et aux collectivités (les droits de mutation). Une petite partie seulement rémunère le notaire, selon un barème réglementé, et le reste couvre des frais engagés pour votre dossier. Le détail figure dans le décompte que le notaire vous envoie avant la signature.',
      },
      { type: 'titre', texte: 'Avant la signature : ce que vous devez préparer' },
      {
        type: 'liste',
        items: [
          'Vos pièces d\'identité et d\'état civil, ainsi que le justificatif de domicile.',
          'L\'offre de prêt acceptée et les informations de la banque.',
          'Une attestation d\'assurance habitation, souvent demandée pour la remise des clés.',
          'Le virement de l\'apport et des frais sur le compte du notaire, quelques jours avant. Utilisez un virement, jamais un règlement en espèces.',
        ],
      },
      { type: 'titre', texte: 'La visite avant la signature' },
      {
        type: 'texte',
        texte:
          'Quelques jours avant l\'acte, refaites une visite du bien. Contrôlez qu\'il est dans l\'état où vous l\'avez acheté, que les équipements prévus sont présents, que le vendeur a libéré les lieux et qu\'aucun dégât n\'est apparu. Signalez tout problème au notaire ou à l\'agence avant de signer.',
      },
      {
        type: 'encadre',
        variante: 'piege',
        titre: 'Piège classique',
        texte:
          'Bâcler cette dernière visite. Après la signature, il est bien plus difficile de faire corriger un défaut ou un manque. Prenez des photos et vérifiez point par point.',
      },
      { type: 'titre', texte: 'Le jour de la signature' },
      {
        type: 'texte',
        texte:
          'Le notaire lit l\'acte avec vous, répond à vos questions, puis tout le monde signe. La signature peut se faire sur place, avec une procuration ou par voie électronique selon les cas. La banque débloque les fonds, le notaire règle le vendeur, et vous recevez les clés, souvent le jour même ou peu après.',
      },
      { type: 'titre', texte: 'Après la signature' },
      {
        type: 'texte',
        texte:
          'Le notaire enregistre la vente et fait publier votre acquisition. Vous recevez d\'abord une attestation de propriété, puis une copie de l\'acte quelques mois plus tard. Conservez ces documents toute votre vie.',
      },
      {
        type: 'encadre',
        variante: 'verifier',
        titre: 'À vérifier à la source',
        texte:
          'Les modalités de signature (procuration, signature électronique), les délais de publication et la répartition des frais évoluent. Demandez le détail à votre notaire et consultez notaires.fr.',
      },
      { type: 'calculette', label: 'Revoir vos frais annexes', href: '/frais-annexes' },
    ],
    sources: [
      { label: 'Notaires de France : la vente immobilière', url: 'https://www.notaires.fr/' },
      { label: 'Service-public.fr : acheter un logement', url: 'https://www.service-public.fr/' },
      { label: 'ANIL : conseils sur le logement', url: 'https://www.anil.org/' },
    ],
  },
  {
    slug: 'apres',
    numero: 8,
    titre: 'Après l\'achat',
    resume: 'Assurances, impôts, charges et premiers travaux.',
    duree: 'Les premiers mois',
    publiee: true,
    misAJour: '2026-11-01',
    blocs: [
      { type: 'titre', texte: 'Le jour des clés' },
      {
        type: 'liste',
        items: [
          'Relevez les compteurs d\'eau, d\'électricité et de gaz, avec une photo datée.',
          'Ouvrez ou transférez vos contrats d\'énergie, d\'eau et d\'internet.',
          'Vérifiez que vous avez toutes les clés, les badges, les télécommandes et les codes.',
          'Faites une première inspection de l\'état du logement et notez ce qui doit être traité.',
        ],
      },
      { type: 'titre', texte: 'Les assurances' },
      {
        type: 'texte',
        texte:
          'L\'assurance habitation est indispensable. Pour un propriétaire occupant en copropriété, elle est de plus obligatoire pour la responsabilité civile, et la banque l\'exige souvent. Elle doit être active dès la remise des clés. Pensez aussi à comparer votre assurance de prêt : la loi permet de la changer en cours de prêt, à garanties équivalentes.',
      },
      { type: 'titre', texte: 'Les impôts et les charges' },
      {
        type: 'liste',
        items: [
          'Taxe foncière : elle est due chaque année par le propriétaire. Son montant varie fortement d\'une commune à l\'autre, regardez celui de l\'année précédente.',
          'La taxe d\'habitation ne concerne plus les résidences principales, mais elle existe encore pour les résidences secondaires.',
          'Charges de copropriété : appelées chaque trimestre, elles comprennent souvent une cotisation au fonds de travaux.',
        ],
      },
      {
        type: 'encadre',
        variante: 'verifier',
        titre: 'À vérifier à la source',
        texte:
          'Les exonérations temporaires de taxe foncière pour un logement neuf, les déclarations à faire auprès des impôts après un achat et les aides locales dépendent de votre situation et de votre commune. Renseignez-vous sur impots.gouv.fr et auprès de votre mairie.',
      },
      { type: 'titre', texte: 'Dans le neuf : les garanties' },
      {
        type: 'texte',
        texte:
          'Un logement neuf est couvert par des garanties légales : la garantie de parfait achèvement pendant un an, la garantie des équipements pendant deux ans et la garantie décennale pour les gros ouvrages pendant dix ans. Signalez rapidement tout défaut, par écrit, pour ne pas perdre vos droits.',
      },
      { type: 'titre', texte: 'Budgétez l\'entretien' },
      {
        type: 'texte',
        texte:
          'Un logement coûte de l\'argent après l\'achat : réparations, entretien, remplacement d\'équipements. Un repère souvent cité est de mettre de côté chaque année environ 1 % de la valeur du bien, mais ce n\'est pas une règle : un logement récent en demandera moins qu\'un logement ancien.',
      },
      {
        type: 'encadre',
        variante: 'astuce',
        titre: 'Astuce',
        texte:
          'Créez un dossier, papier ou numérique, avec l\'acte, les diagnostics, les factures de travaux, les garanties et les contrats d\'assurance. Vous en aurez besoin pour une revente, un sinistre ou une aide à la rénovation.',
      },
      { type: 'calculette', label: 'Faire le point sur votre budget', href: '/calculette' },
    ],
    sources: [
      { label: 'Service-public.fr : propriétaire, impôts locaux', url: 'https://www.service-public.fr/' },
      { label: 'Impots.gouv.fr', url: 'https://www.impots.gouv.fr/' },
      { label: 'ANIL : conseils sur le logement', url: 'https://www.anil.org/' },
    ],
  },
];

export function trouverEtape(slug: string): Etape | undefined {
  return ETAPES.find((e) => e.slug === slug);
}
