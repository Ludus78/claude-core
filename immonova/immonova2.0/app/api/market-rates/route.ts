import { NextResponse } from "next/server";

// Type d'intérêt pour chaque durée de prêt
type RatesByDuration = {
  [duration: number]: number;
};

// Type pour les données de taux d'intérêt par type de prêt
interface MarketRates {
  acheter: RatesByDuration;
  locatif: RatesByDuration;
  viager: RatesByDuration;
  lastUpdated: string;
}

// Taux d'intérêt actuels du marché immobilier français (mis à jour juin 2024)
// Ces taux pourraient être récupérés d'une base de données, d'une API externe ou mis à jour manuellement
const currentMarketRates: MarketRates = {
  // Taux pour les prêts immobiliers résidentiels (achat de résidence principale)
  acheter: {
    5: 3.10,   // 5 ans
    10: 3.30,  // 10 ans
    15: 3.50,  // 15 ans
    20: 3.70,  // 20 ans
    25: 3.85,  // 25 ans
    30: 4.05   // 30 ans
  },
  
  // Taux pour les prêts immobiliers locatifs (investissement locatif)
  locatif: {
    5: 3.25,   // 5 ans
    10: 3.45,  // 10 ans
    15: 3.65,  // 15 ans
    20: 3.90,  // 20 ans
    25: 4.10,  // 25 ans
    30: 4.30   // 30 ans
  },
  
  // Taux de rendement pour les viagers
  viager: {
    5: 4.00,   // Court terme
    10: 4.20,  // Moyen terme
    15: 4.40,  // Long terme
    20: 4.60   // Très long terme
  },
  
  // Date de la dernière mise à jour des taux
  lastUpdated: "2024-06-15"
};

// Fonction pour interpoler un taux en fonction de la durée exacte
function interpolateRate(rates: RatesByDuration, exactDuration: number): number {
  // Récupérer toutes les durées disponibles
  const availableDurations = Object.keys(rates).map(Number).sort((a, b) => a - b);
  
  // Si la durée exacte existe dans les données
  if (rates[exactDuration] !== undefined) {
    return rates[exactDuration];
  }
  
  // Si la durée est inférieure à la plus petite durée disponible
  if (exactDuration <= availableDurations[0]) {
    return rates[availableDurations[0]];
  }
  
  // Si la durée est supérieure à la plus grande durée disponible
  if (exactDuration >= availableDurations[availableDurations.length - 1]) {
    return rates[availableDurations[availableDurations.length - 1]];
  }
  
  // Trouver les deux durées qui encadrent la durée exacte
  let lowerDuration = availableDurations[0];
  let upperDuration = availableDurations[availableDurations.length - 1];
  
  for (let i = 0; i < availableDurations.length - 1; i++) {
    if (exactDuration >= availableDurations[i] && exactDuration <= availableDurations[i + 1]) {
      lowerDuration = availableDurations[i];
      upperDuration = availableDurations[i + 1];
      break;
    }
  }
  
  // Interpolation linéaire
  const ratio = (exactDuration - lowerDuration) / (upperDuration - lowerDuration);
  const interpolatedRate = rates[lowerDuration] + ratio * (rates[upperDuration] - rates[lowerDuration]);
  
  return parseFloat(interpolatedRate.toFixed(2));
}

export async function GET(request: Request) {
  try {
    // Récupérer les paramètres de la requête
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const duration = searchParams.get('duration');
    
    // Si un type de prêt et une durée sont spécifiés, retourner uniquement ce taux
    if (type && duration && ['acheter', 'locatif', 'viager'].includes(type)) {
      const exactDuration = parseInt(duration, 10);
      const rates = currentMarketRates[type as keyof typeof currentMarketRates] as RatesByDuration;
      
      // Interpoler le taux exact
      const interpolatedRate = interpolateRate(rates, exactDuration);
      
      return NextResponse.json({
        type,
        duration: exactDuration,
        rate: interpolatedRate,
        lastUpdated: currentMarketRates.lastUpdated
      });
    }
    
    // Sinon, retourner tous les taux
    return NextResponse.json(currentMarketRates);
  } catch (error) {
    console.error('Erreur lors de la récupération des taux du marché:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des taux du marché' },
      { status: 500 }
    );
  }
} 