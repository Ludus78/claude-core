import { Anthropic } from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY || '',
});

// Messages de secours en cas d'échec de l'API
const fallbackResponses = {
  default: "Je suis désolé, je rencontre actuellement des difficultés techniques. Veuillez réessayer dans quelques instants ou contacter notre équipe pour obtenir de l'aide.",
  
  // Réponses par mots-clés
  prix: "Les prix immobiliers varient selon la localisation, la taille et l'état du bien. En 2024, le prix moyen en France est d'environ 3400€/m² pour un appartement. Les prix peuvent varier significativement selon les régions, allant de 2000€/m² dans certaines zones rurales à plus de 10000€/m² à Paris.",
  
  achat: "Pour acheter un bien immobilier, voici les étapes principales : 1) Définir votre budget et obtenir un accord de prêt, 2) Rechercher des biens correspondant à vos critères, 3) Visiter et comparer les biens, 4) Faire une offre d'achat, 5) Signer le compromis de vente, 6) Obtenir votre prêt définitif, 7) Signer l'acte authentique chez le notaire.",
  
  vente: "Pour vendre votre bien : 1) Estimez le prix avec précision, 2) Rassemblez les diagnostics obligatoires (DPE, amiante, etc.), 3) Préparez le bien pour les visites, 4) Choisissez votre stratégie de commercialisation (agent immobilier ou vente directe), 5) Négociez les offres, 6) Signez le compromis puis l'acte de vente.",
  
  locatif: "L'investissement locatif offre plusieurs avantages : revenus réguliers (3-7% de rentabilité moyenne), avantages fiscaux (LMNP, Pinel, etc.), constitution d'un patrimoine. Points clés : choix de l'emplacement, calcul précis de la rentabilité, gestion locative, respect des obligations légales.",
  
  ptz: "Le Prêt à Taux Zéro (PTZ) en 2024 : 1) Réservé aux primo-accédants, 2) Montant jusqu'à 40% du prix dans le neuf, 3) Plafonds de ressources selon la zone, 4) Différé de remboursement possible, 5) Durée de 20 à 25 ans selon les revenus. Conditions et zones éligibles à vérifier.",

  notaire: "Les frais de notaire comprennent : 1) Droits de mutation : 5.09% à 5.89% selon les départements pour l'ancien, 2-3% pour le neuf, 2) Émoluments du notaire : environ 0.814% du prix, 3) Frais divers : 400-700€ pour les formalités administratives. Total : 7-8% pour l'ancien, 2-3% pour le neuf.",

  diagnostic: "Les diagnostics immobiliers obligatoires sont : 1) DPE (performance énergétique), 2) Amiante (avant 1997), 3) Plomb (avant 1949), 4) Électricité et gaz (+ de 15 ans), 5) Termites (zones à risque), 6) État des risques naturels, 7) Assainissement, 8) Superficie Carrez. Validité variable selon le diagnostic.",

  financement: "Le financement immobilier comprend : 1) Apport personnel recommandé (10-20%), 2) Prêt principal sur 20-25 ans, 3) Prêts complémentaires possibles (PTZ, Action Logement, etc.), 4) Assurance emprunteur obligatoire, 5) Taux d'endettement limité à 35%. Comparez plusieurs banques pour optimiser votre financement.",

  fiscalite: "La fiscalité immobilière inclut : 1) Taxe foncière, 2) Taxe d'habitation (résidences secondaires), 3) Plus-values immobilières, 4) Revenus locatifs (régimes micro-foncier ou réel), 5) Dispositifs de défiscalisation (Pinel, LMNP, Denormandie). Consultez un expert pour optimiser votre situation.",

  copropriete: "La copropriété implique : 1) Charges communes (entretien, gardiennage, etc.), 2) Règlement de copropriété à respecter, 3) Assemblées générales annuelles, 4) Syndic pour la gestion, 5) Fonds de travaux obligatoire, 6) Quote-part des parties communes. Vérifiez la santé financière de la copropriété avant d'acheter.",

  renovation: "Pour rénover un bien : 1) Définissez votre budget et vos objectifs, 2) Faites établir des devis détaillés, 3) Vérifiez les autorisations nécessaires (permis, déclaration), 4) Choisissez des artisans qualifiés (RGE pour les aides), 5) Profitez des aides disponibles (MaPrimeRénov, CEE, etc.).",

  // Nouvelles réponses
  fai: "Les Frais d'Agence Immobilière (FAI) sont généralement : 1) Pour une vente : 4% à 7% du prix du bien, 2) Pour une location : 1 mois de loyer hors charges pour le locataire (zones tendues), jusqu'à 1 mois pour le propriétaire, 3) Négociables selon le bien et la prestation, 4) Inclus dans le prix affiché 'FAI' ou 'honoraires inclus'. Les honoraires doivent être affichés clairement et sont encadrés par la loi.",

  documents: "Les documents essentiels pour une vente immobilière sont : 1) Titre de propriété, 2) Diagnostics techniques obligatoires (DPE, amiante, plomb, etc.), 3) Trois dernières assemblées générales et règlement si copropriété, 4) Plans et métrages, 5) Compromis/promesse de vente, 6) Attestation de surface habitable/Carrez, 7) État hypothécaire, 8) Justificatifs des travaux réalisés. Le notaire vérifiera tous ces documents avant la vente."
};

// Système de récupération pour les questions hors sujet
const recoveryResponses = [
  "Je suis spécialisé dans l'immobilier. Pourriez-vous me poser une question sur ce sujet ?",
  "Je peux vous aider avec toutes vos questions sur l'immobilier. Que souhaitez-vous savoir ?",
  "Je suis votre assistant immobilier. Comment puis-je vous aider avec votre projet immobilier ?"
];

// Mots-clés liés à l'immobilier
const realEstateKeywords = [
  // Termes généraux
  'immobilier', 'maison', 'appartement', 'bien', 'propriété', 'logement', 'habitation',
  
  // Transaction
  'achat', 'vente', 'location', 'prix', 'coût', 'tarif', 'estimation', 'offre', 'compromis',
  'négociation', 'commission', 'mandat', 'agence', 'agent', 'honoraires',
  
  // Finance
  'prêt', 'crédit', 'taux', 'mensualité', 'apport', 'hypothèque', 'assurance', 'emprunt',
  'banque', 'financement', 'ptz', 'endettement', 'revenus', 'épargne',
  
  // Technique
  'surface', 'mètre', 'carrez', 'diagnostic', 'dpe', 'travaux', 'rénovation', 'isolation',
  'chauffage', 'électricité', 'plomberie', 'amiante', 'plomb', 'termites',
  
  // Juridique
  'notaire', 'frais', 'acte', 'cadastre', 'bail', 'contrat', 'loi', 'règlement',
  'copropriété', 'syndic', 'charges', 'assemblée', 'quote-part',
  
  // Fiscalité
  'impôt', 'taxe', 'foncier', 'plus-value', 'défiscalisation', 'pinel', 'denormandie',
  'lmnp', 'revenus', 'charges', 'déduction',
  
  // Construction
  'neuf', 'ancien', 'construction', 'vefa', 'promoteur', 'constructeur', 'terrain',
  'permis', 'urbanisme', 'plan', 'architecte',
  
  // Caractéristiques
  'pièce', 'chambre', 'salon', 'cuisine', 'salle', 'garage', 'jardin', 'balcon',
  'terrasse', 'cave', 'parking', 'étage', 'ascenseur', 'exposition',
  
  // Localisation
  'quartier', 'ville', 'commune', 'secteur', 'zone', 'emplacement', 'environnement',
  'voisinage', 'proximité', 'transport', 'école', 'commerce',

  // Frais et honoraires
  'fai', 'frais', 'honoraires', 'commission', 'agence', 'agent', 'négociation',
  'pourcentage', 'rémunération', 'facture', 'paiement', 'règlement',

  // Documents
  'document', 'papier', 'dossier', 'titre', 'propriété', 'compromis', 'promesse',
  'attestation', 'diagnostic', 'plan', 'métrage', 'acte', 'contrat', 'bail',
];

// Fonction pour vérifier si une question est liée à l'immobilier
function isRealEstateRelated(message: string): boolean {
  const lowerMessage = message.toLowerCase();
  return realEstateKeywords.some(keyword => lowerMessage.includes(keyword));
}

// Fonction pour détecter les questions hors sujet répétées
function isRepeatedOffTopic(history: string[]): boolean {
  if (history.length < 2) return false;
  
  const lastTwoMessages = history.slice(-2);
  const isOffTopic = lastTwoMessages.every(msg => !isRealEstateRelated(msg));
  
  return isOffTopic;
}

export async function POST(request: Request) {
  try {
    const { message, history = [] } = await request.json();
    
    if (!message || typeof message !== 'string') {
      return Response.json({ 
        success: false,
        error: "Je n'ai pas compris votre question. Pourriez-vous la reformuler ?" 
      }, { status: 200 });
    }
    
    console.log("Message reçu:", message);
    console.log("Historique:", history);

    // Vérifier si la question est liée à l'immobilier
    if (!isRealEstateRelated(message)) {
      // Si c'est une question hors sujet répétée, donner une réponse plus ferme
      if (isRepeatedOffTopic(history)) {
        return Response.json({ 
          success: true,
          response: "Je suis un assistant spécialisé dans l'immobilier. Je ne peux répondre qu'aux questions liées à ce domaine. Pourriez-vous me poser une question sur l'immobilier ?"
        }, { status: 200 });
      }
      
      const randomResponse = recoveryResponses[Math.floor(Math.random() * recoveryResponses.length)];
      return Response.json({ 
        success: true,
        response: randomResponse
      }, { status: 200 });
    }

    if (!process.env.CLAUDE_API_KEY) {
      console.warn("Clé API Claude non configurée, utilisation d'une réponse de secours");
      return Response.json({ 
        success: true,
        response: getFallbackResponse(message)
      }, { status: 200 });
    }

    try {
      const response = await anthropic.messages.create({
        model: "claude-3-5-sonnet-20240620",
        max_tokens: 1500,
        system: "Tu es un assistant Français spécialisé en immobilier. Tu apportes des réponses précises, professionnelles et utiles sur tous les sujets liés à l'immobilier en France (achat, vente, location, investissement, financement, réglementation, etc.). Tu es poli et concis. Si tu ne peux pas répondre à une question, dis-le honnêtement. Reste toujours dans le domaine de l'immobilier. Ne réponds jamais aux questions hors sujet.",
        messages: [
          {"role": "user", "content": message}
        ]
      });

      if (!response || !response.content || !Array.isArray(response.content)) {
        throw new Error('Format de réponse invalide');
      }

      const textContent = response.content.find(content => content.type === 'text')?.text;
      if (!textContent) {
        throw new Error('Pas de contenu textuel dans la réponse');
      }

      return Response.json({ 
        success: true,
        response: textContent 
      }, { status: 200 });
    } catch (apiError) {
      console.error("Erreur API Claude:", apiError);
      return Response.json({ 
        success: true,
        response: getFallbackResponse(message)
      }, { status: 200 });
    }
  } catch (error) {
    console.error("Erreur générale dans l'API chat:", error);
    return Response.json({ 
      success: false,
      error: fallbackResponses.default 
    }, { status: 200 });
  }
}

// Fonction pour obtenir une réponse de secours basée sur les mots-clés
function getFallbackResponse(message: string): string {
  const lowerMessage = message.toLowerCase();
  
  // Vérification des mots-clés par catégorie
  if (lowerMessage.includes('notaire') || lowerMessage.includes('frais de notaire')) {
    return fallbackResponses.notaire;
  }
  
  if (lowerMessage.includes('fai') || 
      lowerMessage.includes('frais d\'agence') || 
      lowerMessage.includes('frais dagence') ||
      lowerMessage.includes('honoraires agence') ||
      (lowerMessage.includes('frais') && lowerMessage.includes('agent'))) {
    return fallbackResponses.fai;
  }

  if (lowerMessage.includes('document') || 
      lowerMessage.includes('papier') || 
      lowerMessage.includes('dossier') ||
      (lowerMessage.includes('doc') && (lowerMessage.includes('vente') || lowerMessage.includes('achat'))) ||
      lowerMessage.includes('titre de propriété') ||
      lowerMessage.includes('compromis')) {
    return fallbackResponses.documents;
  }
  
  if (lowerMessage.includes('diagnostic') || 
      lowerMessage.includes('dpe') || 
      lowerMessage.includes('amiante') || 
      lowerMessage.includes('plomb') || 
      lowerMessage.includes('termites')) {
    return fallbackResponses.diagnostic;
  }
  
  if (lowerMessage.includes('prix') || 
      lowerMessage.includes('coût') || 
      lowerMessage.includes('tarif') || 
      lowerMessage.includes('estimation')) {
    return fallbackResponses.prix;
  }
  
  if (lowerMessage.includes('achat') || 
      lowerMessage.includes('acheter') || 
      lowerMessage.includes('acquérir') || 
      lowerMessage.includes('compromis')) {
    return fallbackResponses.achat;
  }
  
  if (lowerMessage.includes('vente') || 
      lowerMessage.includes('vendre') || 
      lowerMessage.includes('mandat')) {
    return fallbackResponses.vente;
  }
  
  if (lowerMessage.includes('locatif') || 
      lowerMessage.includes('location') || 
      lowerMessage.includes('louer') || 
      lowerMessage.includes('bail') || 
      lowerMessage.includes('loyer')) {
    return fallbackResponses.locatif;
  }
  
  if (lowerMessage.includes('ptz') || 
      lowerMessage.includes('prêt à taux zéro')) {
    return fallbackResponses.ptz;
  }
  
  if (lowerMessage.includes('financement') || 
      lowerMessage.includes('prêt') || 
      lowerMessage.includes('crédit') || 
      lowerMessage.includes('banque') || 
      lowerMessage.includes('emprunt') || 
      lowerMessage.includes('taux')) {
    return fallbackResponses.financement;
  }
  
  if (lowerMessage.includes('fiscalité') || 
      lowerMessage.includes('impôt') || 
      lowerMessage.includes('taxe') || 
      lowerMessage.includes('plus-value') || 
      lowerMessage.includes('défiscalisation') || 
      lowerMessage.includes('pinel')) {
    return fallbackResponses.fiscalite;
  }
  
  if (lowerMessage.includes('copropriété') || 
      lowerMessage.includes('syndic') || 
      lowerMessage.includes('charges') || 
      lowerMessage.includes('assemblée') || 
      lowerMessage.includes('quote-part')) {
    return fallbackResponses.copropriete;
  }
  
  if (lowerMessage.includes('rénovation') || 
      lowerMessage.includes('travaux') || 
      lowerMessage.includes('isolation') || 
      lowerMessage.includes('chauffage') || 
      lowerMessage.includes('électricité')) {
    return fallbackResponses.renovation;
  }
  
  // Si aucun mot-clé spécifique n'est trouvé mais que la question est liée à l'immobilier
  if (isRealEstateRelated(message)) {
    return "Je comprends votre question sur l'immobilier. Pour vous donner une réponse plus précise, pourriez-vous me donner plus de détails ou reformuler votre question ?";
  }
  
  return "Je suis spécialisé dans l'immobilier. Pour mieux vous aider, pourriez-vous me poser une question plus spécifique sur l'achat, la vente, la location, le financement ou tout autre aspect de l'immobilier ?";
}