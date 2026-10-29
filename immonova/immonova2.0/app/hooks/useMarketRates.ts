import { useState, useEffect } from "react";

interface Rate {
  type: string;
  duration: number;
  rate: number;
  lastUpdated: string;
}

interface UseMarketRatesResult {
  rate: number | null;
  isLoading: boolean;
  error: Error | null;
  lastUpdated: string | null;
}

/**
 * Hook pour récupérer les taux d'intérêt actuels du marché immobilier
 * @param type Type de prêt ('acheter', 'locatif', 'viager')
 * @param duration Durée du prêt en années
 * @returns Objet contenant le taux, l'état de chargement, et les erreurs éventuelles
 */
export function useMarketRates(
  type: 'acheter' | 'locatif' | 'viager', 
  duration: number
): UseMarketRatesResult {
  const [data, setData] = useState<Rate | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    
    const fetchRate = async () => {
      try {
        setIsLoading(true);
        
        // Construire l'URL de l'API avec les paramètres
        const url = `/api/market-rates?type=${type}&duration=${duration}`;
        
        // Effectuer la requête
        const response = await fetch(url, {
          signal: controller.signal,
          headers: {
            'Cache-Control': 'no-cache'
          }
        });
        
        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }
        
        const rateData = await response.json();
        
        if (isMounted) {
          setData(rateData);
          setError(null);
        }
      } catch (err) {
        if (isMounted && err instanceof Error && err.name !== 'AbortError') {
          setError(err);
          console.error('Erreur lors de la récupération des taux:', err);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };
    
    fetchRate();
    
    // Nettoyer l'effet
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [type, duration]);
  
  return {
    rate: data?.rate ?? null,
    isLoading,
    error,
    lastUpdated: data?.lastUpdated ?? null
  };
}

/**
 * Hook simplifié pour obtenir un taux d'intérêt par défaut avec une valeur de secours.
 * Utile lorsqu'on veut éviter de gérer les états de chargement et d'erreur.
 * @param type Type de prêt ('acheter', 'locatif', 'viager')
 * @param duration Durée du prêt en années
 * @param fallbackRate Taux de secours à utiliser en cas d'erreur ou pendant le chargement
 * @returns Le taux d'intérêt ou le taux de secours
 */
export function useDefaultRate(
  type: 'acheter' | 'locatif' | 'viager', 
  duration: number,
  fallbackRate: number
): number {
  const { rate, isLoading, error } = useMarketRates(type, duration);
  
  // Si le taux est disponible, l'utiliser, sinon utiliser le taux de secours
  return rate !== null && !isLoading && !error ? rate : fallbackRate;
} 