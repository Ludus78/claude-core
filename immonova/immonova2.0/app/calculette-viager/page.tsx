"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useDefaultRate } from '../hooks/useMarketRates';
import CalculatorActions from '../components/CalculatorActions';

export default function CalculetteViager() {
  const calculatorRef = useRef<HTMLDivElement>(null);
  
  // Paramètres du bien
  const [prixValeurTotale, setPrixValeurTotale] = useState<number>(200000);
  const [fraisNotaire, setFraisNotaire] = useState<number>(8);
  const [fraisAgence, setFraisAgence] = useState<number>(5);
  const [fraisTravaux, setFraisTravaux] = useState<number>(0);
  
  // Paramètres du viager
  const [bouquet, setBouquet] = useState<number>(40000);
  const [renteMensuelle, setRenteMensuelle] = useState<number>(800);
  const [ageVendeur, setAgeVendeur] = useState<number>(75);
  const [ageConjoint, setAgeConjoint] = useState<number>(72);
  const [sexeVendeur, setSexeVendeur] = useState<'homme' | 'femme'>('homme');
  const [sexeConjoint, setSexeConjoint] = useState<'homme' | 'femme'>('femme');
  const [typeViager, setTypeViager] = useState<'libre' | 'occupé'>('libre');
  
  // Paramètres financiers
  // Récupérer le taux du marché via le hook, avec une valeur par défaut de 4%
  const tauxMarche = useDefaultRate('viager', 15, 4);
  const [tauxRendement, setTauxRendement] = useState<number>(tauxMarche);
  const [inflation, setInflation] = useState<number>(2);
  
  // Mettre à jour le taux de rendement quand le taux du marché change
  useEffect(() => {
    setTauxRendement(tauxMarche);
  }, [tauxMarche]);
  
  // Calculs des coûts totaux de l'investissement
  const calculerInvestissementTotal = () => {
    const fraisNotaireValeur = prixValeurTotale * fraisNotaire / 100;
    const fraisAgenceValeur = prixValeurTotale * fraisAgence / 100;
    const total = bouquet + fraisNotaireValeur + fraisAgenceValeur + fraisTravaux;
    
    return {
      fraisNotaire: Math.round(fraisNotaireValeur),
      fraisAgence: Math.round(fraisAgenceValeur),
      fraisTravaux: fraisTravaux,
      totalInvestissement: Math.round(total)
    };
  };
  
  const investissement = calculerInvestissementTotal();
  
  // Calcul de l'espérance de vie selon le sexe et l'âge
  const calculerEsperanceVie = (age: number, sexe: 'homme' | 'femme') => {
    // Table simplifiée d'espérance de vie (source: INSEE)
    const tableEsperanceVie = {
      homme: {
        70: 15.5,
        75: 11.5,
        80: 8.5,
        85: 6.0,
        90: 4.0
      },
      femme: {
        70: 18.0,
        75: 13.5,
        80: 10.0,
        85: 7.0,
        90: 4.5
      }
    } as const;
    
    // Trouver la valeur la plus proche dans la table
    const ages = Object.keys(tableEsperanceVie[sexe]).map(Number);
    const ageReference = ages.reduce((prev, curr) => 
      Math.abs(curr - age) < Math.abs(prev - age) ? curr : prev
    );
    
    // Utiliser une assertion de type pour indiquer que ageReference est une clé valide
    return tableEsperanceVie[sexe][ageReference as keyof typeof tableEsperanceVie[typeof sexe]];
  };
  
  const esperanceVieVendeur = calculerEsperanceVie(ageVendeur, sexeVendeur);
  const esperanceVieConjoint = calculerEsperanceVie(ageConjoint, sexeConjoint);
  
  // Calcul de la rente viagère théorique
  const calculerRenteViagere = () => {
    // Formule simplifiée de la rente viagère
    const tauxMensuel = tauxRendement / 100 / 12;
    const esperanceVieMois = esperanceVieVendeur * 12;
    
    if (tauxMensuel === 0) return (prixValeurTotale - bouquet) / esperanceVieMois;
    
    const numerateur = tauxMensuel * Math.pow(1 + tauxMensuel, esperanceVieMois);
    const denominateur = Math.pow(1 + tauxMensuel, esperanceVieMois) - 1;
    
    return Math.round((prixValeurTotale - bouquet) * (numerateur / denominateur));
  };
  
  const renteViagereTheorique = calculerRenteViagere();
  
  // Calcul de la rentabilité brute
  const rentabiliteBrute = (renteMensuelle * 12 / investissement.totalInvestissement) * 100;
  
  // Calcul de la rentabilité nette (tenant compte de l'inflation)
  const rentabiliteNette = ((renteMensuelle * 12 * (1 - inflation / 100)) / investissement.totalInvestissement) * 100;
  
  // Calcul du rendement sur le bouquet
  const rendementBouquet = ((renteMensuelle * 12) / bouquet) * 100;
  
  // Calcul du temps de récupération du bouquet
  const tempsRecuperationBouquet = bouquet / (renteMensuelle * 12);
  
  // Calcul de la rente annuelle indexée
  const renteAnnuelleIndexee = renteMensuelle * 12 * (1 + inflation / 100);

  return (
    <div ref={calculatorRef} className="bg-white rounded-lg shadow-md p-6">
      <h1 className="text-2xl font-bold mb-2 text-indigo-700">Calculette d'investissement en viager</h1>
      <p className="text-gray-600 mb-6">
        Estimez la rentabilité de votre investissement en viager en tenant compte des spécificités de ce type d'investissement.
      </p>
      
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Paramètres du bien</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Valeur totale du bien (€)
              </label>
              <input
                type="number"
                value={prixValeurTotale || ''}
                onChange={(e) => setPrixValeurTotale(Number(e.target.value))}
                className="w-full p-2 border border-gray-300 rounded focus:ring focus:ring-indigo-200 focus:border-indigo-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Frais de notaire (%)
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                value={fraisNotaire}
                onChange={(e) => setFraisNotaire(Number(e.target.value))}
                className="w-full p-2 border border-gray-300 rounded focus:ring focus:ring-indigo-200 focus:border-indigo-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Frais d'agence (%)
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                value={fraisAgence}
                onChange={(e) => setFraisAgence(Number(e.target.value))}
                className="w-full p-2 border border-gray-300 rounded focus:ring focus:ring-indigo-200 focus:border-indigo-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Budget travaux (€)
              </label>
              <input
                type="number"
                value={fraisTravaux}
                onChange={(e) => setFraisTravaux(Number(e.target.value))}
                className="w-full p-2 border border-gray-300 rounded focus:ring focus:ring-indigo-200 focus:border-indigo-500"
              />
            </div>
          </div>
          
          <h2 className="text-xl font-semibold mt-6 mb-4 text-gray-800">Paramètres du viager</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bouquet (€)
              </label>
              <input
                type="number"
                value={bouquet}
                onChange={(e) => setBouquet(Number(e.target.value))}
                className="w-full p-2 border border-gray-300 rounded focus:ring focus:ring-indigo-200 focus:border-indigo-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rente mensuelle (€)
              </label>
              <input
                type="number"
                value={renteMensuelle}
                onChange={(e) => setRenteMensuelle(Number(e.target.value))}
                className="w-full p-2 border border-gray-300 rounded focus:ring focus:ring-indigo-200 focus:border-indigo-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type de viager
              </label>
              <select
                value={typeViager}
                onChange={(e) => setTypeViager(e.target.value as 'libre' | 'occupé')}
                className="w-full p-2 border border-gray-300 rounded focus:ring focus:ring-indigo-200 focus:border-indigo-500"
              >
                <option value="libre">Viager libre</option>
                <option value="occupé">Viager occupé</option>
              </select>
            </div>
          </div>
          
          <h2 className="text-xl font-semibold mt-6 mb-4 text-gray-800">Paramètres du vendeur</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Âge du vendeur
              </label>
              <input
                type="number"
                min="60"
                max="100"
                value={ageVendeur}
                onChange={(e) => setAgeVendeur(Number(e.target.value))}
                className="w-full p-2 border border-gray-300 rounded focus:ring focus:ring-indigo-200 focus:border-indigo-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sexe du vendeur
              </label>
              <select
                value={sexeVendeur}
                onChange={(e) => setSexeVendeur(e.target.value as 'homme' | 'femme')}
                className="w-full p-2 border border-gray-300 rounded focus:ring focus:ring-indigo-200 focus:border-indigo-500"
              >
                <option value="homme">Homme</option>
                <option value="femme">Femme</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Âge du conjoint
              </label>
              <input
                type="number"
                min="60"
                max="100"
                value={ageConjoint}
                onChange={(e) => setAgeConjoint(Number(e.target.value))}
                className="w-full p-2 border border-gray-300 rounded focus:ring focus:ring-indigo-200 focus:border-indigo-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sexe du conjoint
              </label>
              <select
                value={sexeConjoint}
                onChange={(e) => setSexeConjoint(e.target.value as 'homme' | 'femme')}
                className="w-full p-2 border border-gray-300 rounded focus:ring focus:ring-indigo-200 focus:border-indigo-500"
              >
                <option value="homme">Homme</option>
                <option value="femme">Femme</option>
              </select>
            </div>
          </div>
          
          <h2 className="text-xl font-semibold mt-6 mb-4 text-gray-800">Paramètres financiers</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Taux de rendement attendu (%)
              </label>
              <div className="flex flex-col space-y-2">
                <div className="bg-gray-50 p-2 rounded border border-gray-200 text-sm text-gray-600">
                  Taux du marché actuel: {tauxMarche.toFixed(2)}%
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    step="0.01"
                    min="0.1"
                    max="15"
                    value={tauxRendement}
                    onChange={(e) => setTauxRendement(Number(e.target.value))}
                    className="flex-1 p-2 border border-gray-300 rounded focus:ring focus:ring-indigo-200 focus:border-indigo-500"
                  />
                  <button 
                    type="button" 
                    onClick={() => setTauxRendement(tauxMarche)}
                    className="p-2 bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200 text-sm"
                  >
                    Réinitialiser
                  </button>
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Taux d'inflation annuel (%)
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                value={inflation}
                onChange={(e) => setInflation(Number(e.target.value))}
                className="w-full p-2 border border-gray-300 rounded focus:ring focus:ring-indigo-200 focus:border-indigo-500"
              />
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-6 text-indigo-700">Résultats</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="font-medium text-gray-700 mb-2">Investissement total</h3>
              <div className="text-3xl font-bold text-indigo-700">
                {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(investissement.totalInvestissement)}
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Bouquet + frais
              </p>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-700 mb-2">Espérance de vie</h3>
              <div className="text-2xl font-bold text-indigo-600">
                {esperanceVieVendeur.toFixed(1)} ans
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Pour le vendeur ({ageVendeur} ans, {sexeVendeur})
              </p>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-700 mb-2">Rente viagère théorique</h3>
              <div className="text-2xl font-bold text-indigo-600">
                {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(renteViagereTheorique)}
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Calculée sur la base de l'espérance de vie
              </p>
            </div>
            
            <div className="pt-4 border-t border-gray-200">
              <h3 className="font-medium text-gray-700 mb-2">Rente annuelle indexée</h3>
              <div className="text-2xl font-bold text-green-600">
                {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(renteAnnuelleIndexee)}
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Tenant compte de l'inflation de {inflation}%
              </p>
            </div>
            
            <div className="border-t border-gray-200 pt-4 mt-4">
              <h3 className="font-medium text-gray-700 mb-2">Rentabilité brute</h3>
              <div className="text-3xl font-bold text-indigo-700">
                {rentabiliteBrute.toFixed(2)}%
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Rente annuelle / Investissement total
              </p>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-700 mb-2">Rentabilité nette</h3>
              <div className="text-3xl font-bold text-indigo-700">
                {rentabiliteNette.toFixed(2)}%
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Tenant compte de l'inflation
              </p>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-700 mb-2">Rendement sur le bouquet</h3>
              <div className="text-3xl font-bold text-indigo-700">
                {rendementBouquet.toFixed(2)}%
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Rente annuelle / Bouquet
              </p>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-700 mb-2">Temps de récupération du bouquet</h3>
              <div className="text-3xl font-bold text-indigo-700">
                {tempsRecuperationBouquet.toFixed(1)} ans
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Basé sur la rente actuelle
              </p>
            </div>
          </div>
          
          <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-100">
            <h3 className="font-medium text-blue-700 mb-2">Conseil ImmoNova</h3>
            <p className="text-sm text-blue-600">
              {rentabiliteNette >= tauxRendement 
                ? `Votre investissement en viager semble intéressant avec une rentabilité nette de ${rentabiliteNette.toFixed(2)}%, supérieure à votre taux de rendement personnalisé de ${tauxRendement.toFixed(2)}%. Contactez nos experts pour optimiser davantage votre investissement.`
                : `Attention, votre investissement en viager génère une rentabilité nette de ${rentabiliteNette.toFixed(2)}%, inférieure à votre taux de rendement personnalisé de ${tauxRendement.toFixed(2)}%. Nos experts peuvent vous aider à optimiser votre stratégie d'investissement.`
              }
            </p>
          </div>
          
          <div className="mt-8 text-center">
            <Link href="/calculette" className="text-indigo-600 hover:text-indigo-800 font-medium">
              Voir aussi notre calculette d'achat immobilier →
            </Link>
          </div>
        </div>
      </div>
      
      <CalculatorActions calculatorType="viager" calculatorRef={calculatorRef} />
    </div>
  );
} 