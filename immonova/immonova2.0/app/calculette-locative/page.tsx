"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useDefaultRate } from '../hooks/useMarketRates';
import CalculatorActions from '../components/CalculatorActions';

export default function CalculetteLocative() {
  const calculatorRef = useRef<HTMLDivElement>(null);
  
  // Paramètres d'entrée de l'investissement
  const [prixAchat, setPrixAchat] = useState<number>(200000);
  const [fraisNotaire, setFraisNotaire] = useState<number>(8);
  const [fraisAgence, setFraisAgence] = useState<number>(5);
  const [fraisTravaux, setFraisTravaux] = useState<number>(0);
  const [apport, setApport] = useState<number>(40000);
  
  // Paramètres du financement
  const [duree, setDuree] = useState<number>(20);
  // Récupérer le taux du marché via le hook, avec une valeur par défaut de 3.5%
  const tauxMarche = useDefaultRate('locatif', duree, 3.5);
  const [tauxInteret, setTauxInteret] = useState<number>(tauxMarche);
  const [fraisDossier, setFraisDossier] = useState<number>(1000);
  
  // Mettre à jour le taux d'intérêt quand la durée change
  useEffect(() => {
    setTauxInteret(tauxMarche);
  }, [tauxMarche]);
  
  // Paramètres locatifs
  const [loyerMensuel, setLoyerMensuel] = useState<number>(800);
  const [chargesCopropriete, setChargesCopropriete] = useState<number>(100);
  const [taxeFonciere, setTaxeFonciere] = useState<number>(1200);
  const [assurancePNO, setAssurancePNO] = useState<number>(300);
  const [vacanceLocative, setVacanceLocative] = useState<number>(5);
  const [impotsRevenus, setImpotsRevenus] = useState<number>(30);
  
  // Calculs des coûts totaux de l'investissement
  const calculerInvestissementTotal = () => {
    const fraisNotaireValeur = prixAchat * fraisNotaire / 100;
    const fraisAgenceValeur = prixAchat * fraisAgence / 100;
    const total = prixAchat + fraisNotaireValeur + fraisAgenceValeur + fraisTravaux + fraisDossier;
    
    return {
      fraisNotaire: Math.round(fraisNotaireValeur),
      fraisAgence: Math.round(fraisAgenceValeur),
      fraisDossier: fraisDossier,
      fraisTravaux: fraisTravaux,
      totalInvestissement: Math.round(total)
    };
  };
  
  const investissement = calculerInvestissementTotal();
  
  // Calcul du montant à emprunter
  const montantEmprunt = investissement.totalInvestissement - apport;
  
  // Calcul de la mensualité du prêt
  const calculerMensualite = () => {
    const tauxMensuel = tauxInteret / 100 / 12;
    const nombreMensualites = duree * 12;
    
    if (tauxMensuel === 0) return montantEmprunt / nombreMensualites;
    
    const numerateur = tauxMensuel * Math.pow(1 + tauxMensuel, nombreMensualites);
    const denominateur = Math.pow(1 + tauxMensuel, nombreMensualites) - 1;
    
    return Math.round(montantEmprunt * (numerateur / denominateur));
  };
  
  const mensualitePret = calculerMensualite();
  
  // Calcul des revenus locatifs annuels (tenant compte de la vacance)
  const revenuLocatifAnnuel = loyerMensuel * 12 * (1 - vacanceLocative / 100);
  
  // Calcul des charges annuelles
  const chargesAnnuelles = chargesCopropriete * 12 + taxeFonciere + assurancePNO;
  
  // Calcul des intérêts d'emprunt de la première année
  const calculerInteretsPremiereAnnee = () => {
    const tauxMensuel = tauxInteret / 100 / 12;
    let capitalRestant = montantEmprunt;
    let interetsAnnee = 0;
    
    for (let i = 0; i < 12; i++) {
      const interetsMois = capitalRestant * tauxMensuel;
      const amortissementCapital = mensualitePret - interetsMois;
      interetsAnnee += interetsMois;
      capitalRestant -= amortissementCapital;
    }
    
    return Math.round(interetsAnnee);
  };
  
  const interetsPremiereAnnee = calculerInteretsPremiereAnnee();
  
  // Calcul du cash-flow mensuel (avant impôts)
  const cashFlowMensuelAvantImpots = (revenuLocatifAnnuel - chargesAnnuelles - mensualitePret * 12) / 12;
  
  // Calcul du cash-flow mensuel (après impôts)
  const revenuImposable = revenuLocatifAnnuel - chargesAnnuelles - interetsPremiereAnnee;
  const impots = Math.max(0, revenuImposable * impotsRevenus / 100);
  const cashFlowMensuelApresImpots = (revenuLocatifAnnuel - chargesAnnuelles - mensualitePret * 12 - impots) / 12;
  
  // Calcul de la rentabilité brute
  const rentabiliteBrute = (revenuLocatifAnnuel / investissement.totalInvestissement) * 100;
  
  // Calcul de la rentabilité nette (avant impôts)
  const rentabiliteNette = ((revenuLocatifAnnuel - chargesAnnuelles) / investissement.totalInvestissement) * 100;
  
  // Calcul du rendement net
  const rendementNet = ((revenuLocatifAnnuel - chargesAnnuelles - mensualitePret * 12) / apport) * 100;

  return (
    <div ref={calculatorRef} className="bg-white rounded-lg shadow-md p-6">
      <h1 className="text-2xl font-bold mb-2 text-indigo-700">Calculette d'investissement locatif</h1>
      <p className="text-gray-600 mb-6">
        Estimez la rentabilité et le cash-flow de votre futur investissement locatif.
      </p>
      
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Paramètres d'achat</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Prix d'achat du bien (€)
              </label>
              <input
                type="number"
                value={prixAchat || ''}
                onChange={(e) => setPrixAchat(Number(e.target.value))}
                className="w-full p-2 border border-gray-300 rounded focus:ring focus:ring-indigo-200 focus:border-indigo-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Apport personnel (€)
              </label>
              <input
                type="number"
                value={apport || ''}
                onChange={(e) => setApport(Number(e.target.value))}
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
          
          <h2 className="text-xl font-semibold mt-6 mb-4 text-gray-800">Paramètres du financement</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Durée du prêt (années)
              </label>
              <input
                type="range"
                min="5"
                max="30"
                step="1"
                value={duree}
                onChange={(e) => setDuree(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>5 ans</span>
                <span>{duree} ans</span>
                <span>30 ans</span>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Taux d'intérêt (%)
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
                    value={tauxInteret}
                    onChange={(e) => setTauxInteret(Number(e.target.value))}
                    className="flex-1 p-2 border border-gray-300 rounded focus:ring focus:ring-indigo-200 focus:border-indigo-500"
                  />
                  <button 
                    type="button" 
                    onClick={() => setTauxInteret(tauxMarche)}
                    className="p-2 bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200 text-sm"
                  >
                    Réinitialiser
                  </button>
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Frais de dossier bancaire (€)
              </label>
              <input
                type="number"
                value={fraisDossier}
                onChange={(e) => setFraisDossier(Number(e.target.value))}
                className="w-full p-2 border border-gray-300 rounded focus:ring focus:ring-indigo-200 focus:border-indigo-500"
              />
            </div>
          </div>
          
          <h2 className="text-xl font-semibold mt-6 mb-4 text-gray-800">Paramètres locatifs</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Loyer mensuel (€)
              </label>
              <input
                type="number"
                value={loyerMensuel}
                onChange={(e) => setLoyerMensuel(Number(e.target.value))}
                className="w-full p-2 border border-gray-300 rounded focus:ring focus:ring-indigo-200 focus:border-indigo-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Charges de copropriété mensuelles (€)
              </label>
              <input
                type="number"
                value={chargesCopropriete}
                onChange={(e) => setChargesCopropriete(Number(e.target.value))}
                className="w-full p-2 border border-gray-300 rounded focus:ring focus:ring-indigo-200 focus:border-indigo-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Taxe foncière annuelle (€)
              </label>
              <input
                type="number"
                value={taxeFonciere}
                onChange={(e) => setTaxeFonciere(Number(e.target.value))}
                className="w-full p-2 border border-gray-300 rounded focus:ring focus:ring-indigo-200 focus:border-indigo-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Assurance PNO annuelle (€)
              </label>
              <input
                type="number"
                value={assurancePNO}
                onChange={(e) => setAssurancePNO(Number(e.target.value))}
                className="w-full p-2 border border-gray-300 rounded focus:ring focus:ring-indigo-200 focus:border-indigo-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Taux de vacance locative (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                step="1"
                value={vacanceLocative}
                onChange={(e) => setVacanceLocative(Number(e.target.value))}
                className="w-full p-2 border border-gray-300 rounded focus:ring focus:ring-indigo-200 focus:border-indigo-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Taux marginal d'imposition (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                step="1"
                value={impotsRevenus}
                onChange={(e) => setImpotsRevenus(Number(e.target.value))}
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
                Prix d'achat + frais
              </p>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-700 mb-2">Montant emprunté</h3>
              <div className="text-3xl font-bold text-indigo-600">
                {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(montantEmprunt)}
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Investissement total - apport
              </p>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-700 mb-2">Mensualité du prêt</h3>
              <div className="text-2xl font-bold text-red-600">
                {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(mensualitePret)}
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Sur {duree} ans à {tauxInteret.toFixed(2)}%
              </p>
            </div>
            
            <div className="pt-4 border-t border-gray-200">
              <h3 className="font-medium text-gray-700 mb-2">Revenus locatifs annuels</h3>
              <div className="text-2xl font-bold text-green-600">
                {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(revenuLocatifAnnuel)}
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Tenant compte d'un taux de vacance de {vacanceLocative}%
              </p>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-700 mb-2">Charges annuelles totales</h3>
              <div className="text-2xl font-bold text-red-600">
                {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(chargesAnnuelles)}
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Charges copropriété + taxe foncière + assurance PNO
              </p>
            </div>
            
            <div className="border-t border-gray-200 pt-4 mt-4">
              <h3 className="font-medium text-gray-700 mb-2">Rentabilité brute</h3>
              <div className="text-3xl font-bold text-indigo-700">
                {rentabiliteBrute.toFixed(2)}%
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Loyers annuels / Investissement total
              </p>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-700 mb-2">Rentabilité nette</h3>
              <div className="text-3xl font-bold text-indigo-700">
                {rentabiliteNette.toFixed(2)}%
              </div>
              <p className="text-sm text-gray-500 mt-1">
                (Loyers annuels - charges) / Investissement total
              </p>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-700 mb-2">Rendement de l'apport</h3>
              <div className="text-3xl font-bold text-indigo-700">
                {rendementNet.toFixed(2)}%
              </div>
              <p className="text-sm text-gray-500 mt-1">
                (Loyers annuels - charges - remboursement crédit) / Apport
              </p>
            </div>
            
            <div className="border-t border-gray-200 pt-4 mt-4">
              <h3 className="font-medium text-gray-700 mb-2">Cash-flow mensuel</h3>
              <div className={`text-3xl font-bold ${cashFlowMensuelAvantImpots >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(cashFlowMensuelAvantImpots)}
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Avant impôts
              </p>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-700 mb-2">Cash-flow mensuel après impôts</h3>
              <div className={`text-3xl font-bold ${cashFlowMensuelApresImpots >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(cashFlowMensuelApresImpots)}
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Tenant compte de votre taux d'imposition
              </p>
            </div>
          </div>
          
          <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-100">
            <h3 className="font-medium text-blue-700 mb-2">Conseil ImmoNova</h3>
            <p className="text-sm text-blue-600">
              {cashFlowMensuelApresImpots >= 0 
                ? `Votre investissement locatif semble rentable avec un cash-flow mensuel positif de ${new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(cashFlowMensuelApresImpots)}. Contactez nos experts pour optimiser davantage votre investissement.`
                : `Attention, votre investissement génère un cash-flow mensuel négatif de ${new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(cashFlowMensuelApresImpots)}. Nos experts peuvent vous aider à optimiser votre stratégie d'investissement.`
              }
            </p>
          </div>
          
          <div className="mt-8 text-center space-y-4">
            <Link href="/calculette" className="block text-indigo-600 hover:text-indigo-800 font-medium">
              Voir aussi notre calculette d'achat immobilier →
            </Link>
            <Link href="/calculette-viager" className="block text-indigo-600 hover:text-indigo-800 font-medium">
              Découvrez notre calculette d'investissement en viager →
            </Link>
          </div>
        </div>
      </div>
      
      <CalculatorActions calculatorType="locatif" calculatorRef={calculatorRef} />
    </div>
  );
} 