import { NextResponse } from 'next/server';

// Données de recherche factices pour le mode de secours
const fallbackSearchResults = {
  "achat immobilier": [
    {
      title: "Guide complet pour l'achat immobilier - 10 étapes essentielles",
      link: "https://example.com/guide-achat-immobilier",
      snippet: "Découvrez les étapes clés pour réussir votre achat immobilier : budget, recherche, visite, offre, crédit, compromis, acte authentique..."
    },
    {
      title: "Calculer son budget d'achat immobilier - Simulateur en ligne",
      link: "https://example.com/calculateur-achat",
      snippet: "Calculez rapidement votre capacité d'emprunt et estimez votre budget d'achat immobilier avec notre simulateur gratuit."
    }
  ],
  "vente immobilier": [
    {
      title: "Vendre son bien immobilier: guide pratique et conseils",
      link: "https://example.com/guide-vente-immobilier",
      snippet: "Comment estimer le prix de votre bien, préparer votre logement pour la vente, choisir le bon agent immobilier et négocier au mieux."
    },
    {
      title: "Les documents obligatoires pour vendre un bien immobilier",
      link: "https://example.com/documents-vente",
      snippet: "Liste complète des diagnostics et documents légaux nécessaires pour mettre en vente votre appartement ou maison."
    }
  ],
  "prix immobilier": [
    {
      title: "Évolution des prix de l'immobilier en France - Tendances actuelles",
      link: "https://example.com/prix-immobilier",
      snippet: "Analyse des prix au m² dans les principales villes françaises, prévisions et conseils pour investir au bon moment."
    }
  ],
  "crédit immobilier": [
    {
      title: "Comment obtenir le meilleur taux pour son crédit immobilier",
      link: "https://example.com/taux-credit-immobilier",
      snippet: "Conseils pour négocier votre crédit immobilier, comparer les offres et optimiser votre dossier pour obtenir le taux le plus avantageux."
    }
  ]
};

function getFallbackSearchResults(query: string) {
  const lowerCaseQuery = query.toLowerCase();
  
  // Rechercher des correspondances dans les mots-clés prédéfinis
  for (const [keyword, results] of Object.entries(fallbackSearchResults)) {
    if (lowerCaseQuery.includes(keyword)) {
      return results;
    }
  }
  
  // Si aucune correspondance n'est trouvée, retourner un tableau vide
  return [];
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { query } = body;

    if (!query) {
      return NextResponse.json(
        { error: "La requête de recherche est requise" },
        { status: 400 }
      );
    }

    // Vérifier si les clés API Google sont configurées
    const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
    const GOOGLE_CSE_ID = process.env.GOOGLE_CSE_ID;
    
    if (!GOOGLE_API_KEY || !GOOGLE_CSE_ID || 
        GOOGLE_API_KEY === "votre-cle-api-google" || 
        GOOGLE_CSE_ID === "votre-identifiant-cse-google") {
      
      console.log("Mode de secours activé - Clés Google non configurées");
      
      // Utiliser des résultats prédéfinis
      const fallbackResults = getFallbackSearchResults(query);
      return NextResponse.json({ results: fallbackResults }, { status: 200 });
    }

    try {
      const url = `https://www.googleapis.com/customsearch/v1?key=${GOOGLE_API_KEY}&cx=${GOOGLE_CSE_ID}&q=${encodeURIComponent(query)}`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(`Erreur de l'API de recherche: ${data.error?.message || 'Erreur inconnue'}`);
      }

      // Extraire les résultats pertinents
      const searchResults = data.items?.map((item: any) => ({
        title: item.title,
        link: item.link,
        snippet: item.snippet
      })) || [];

      return NextResponse.json({ results: searchResults }, { status: 200 });
    } catch (googleError) {
      console.error("Erreur API Google:", googleError);
      
      // Fallback en cas d'erreur avec l'API Google
      const fallbackResults = getFallbackSearchResults(query);
      return NextResponse.json({ results: fallbackResults }, { status: 200 });
    }
  } catch (error) {
    console.error("Erreur lors de la recherche web:", error);
    return NextResponse.json(
      { results: [] },
      { status: 200 }
    );
  }
} 