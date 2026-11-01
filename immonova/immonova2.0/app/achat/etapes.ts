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
    publiee: false,
    blocs: [],
    sources: [],
  },
  {
    slug: 'offre',
    numero: 4,
    titre: 'Faire une offre',
    resume: 'Négocier le prix et formuler une offre d\'achat écrite.',
    duree: 'Quelques jours',
    publiee: false,
    blocs: [],
    sources: [],
  },
  {
    slug: 'compromis',
    numero: 5,
    titre: 'Signer le compromis de vente',
    resume: 'Clauses suspensives, délai de rétractation, dépôt de garantie.',
    duree: '1 jour, puis un délai de réflexion',
    publiee: false,
    blocs: [],
    sources: [],
  },
  {
    slug: 'pret',
    numero: 6,
    titre: 'Obtenir son prêt',
    resume: 'Du dossier bancaire à l\'offre de prêt acceptée.',
    duree: '1 à 2 mois',
    publiee: false,
    blocs: [],
    sources: [],
  },
  {
    slug: 'acte',
    numero: 7,
    titre: 'Signer l\'acte chez le notaire',
    resume: 'La dernière ligne droite avant d\'avoir les clés.',
    duree: '2 à 3 mois après le compromis',
    publiee: false,
    blocs: [],
    sources: [],
  },
  {
    slug: 'apres',
    numero: 8,
    titre: 'Après l\'achat',
    resume: 'Assurances, impôts, charges et premiers travaux.',
    duree: 'Les premiers mois',
    publiee: false,
    blocs: [],
    sources: [],
  },
];

export function trouverEtape(slug: string): Etape | undefined {
  return ETAPES.find((e) => e.slug === slug);
}
