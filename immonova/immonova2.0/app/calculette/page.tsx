"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useDefaultRate } from '../hooks/useMarketRates';
import CalculatorActions from '../components/CalculatorActions';
import { formatNumber } from '../utils/formatters';

export default function CalculetteAchat() {
  const calculatorRef = useRef<HTMLDivElement>(null);
  
  // Paramètres d'entrée de l'achat
  const [prixAchat, setPrixAchat] = useState<number>(300000);
  const [fraisNotaire, setFraisNotaire] = useState<number>(8);
  const [fraisAgence, setFraisAgence] = useState<number>(4);
  const [fraisDossier, setFraisDossier] = useState<number>(1000);
  const [apport, setApport] = useState<number>(30000);
  const [revenusMensuels, setRevenusMensuels] = useState<number>(3500);
  const [chargesMensuelles, setChargesMensuelles] = useState<number>(1000);
  const [estPrimoAccedant, setEstPrimoAccedant] = useState<boolean>(true);
  
  // Paramètres du financement
  const [duree, setDuree] = useState<number>(25);
  const tauxMarche = useDefaultRate('acheter', duree, 4.0);
  const [tauxInteret, setTauxInteret] = useState<number>(tauxMarche);
  const [tauxAssurance, setTauxAssurance] = useState<number>(0.34);
  
  useEffect(() => {
    setTauxInteret(tauxMarche);
  }, [tauxMarche]);

  // Calculs des coûts totaux de l'achat
  const calculerCoutTotal = () => {
    const fraisNotaireValeur = prixAchat * fraisNotaire / 100;
    const fraisAgenceValeur = prixAchat * fraisAgence / 100;
    const total = prixAchat + fraisNotaireValeur + fraisAgenceValeur + fraisDossier;
    
    return {
      fraisNotaire: Math.round(fraisNotaireValeur),
      fraisAgence: Math.round(fraisAgenceValeur),
      fraisDossier: fraisDossier,
      totalProjet: Math.round(total)
    };
  };
  
  const coutProjet = calculerCoutTotal();
  const montantEmprunt = coutProjet.totalProjet - apport;
  
  // Calcul de la mensualité du prêt
  const calculerMensualite = () => {
    const tauxMensuel = tauxInteret / 100 / 12;
    const nombreMensualites = duree * 12;
    
    let mensualiteHorsAssurance;
    if (tauxMensuel === 0) {
      mensualiteHorsAssurance = montantEmprunt / nombreMensualites;
    } else {
      const numerateur = tauxMensuel * Math.pow(1 + tauxMensuel, nombreMensualites);
      const denominateur = Math.pow(1 + tauxMensuel, nombreMensualites) - 1;
      mensualiteHorsAssurance = montantEmprunt * (numerateur / denominateur);
    }
    
    const assuranceMensuelle = (montantEmprunt * (tauxAssurance / 100)) / 12;
    
    return {
      total: Math.round(mensualiteHorsAssurance + assuranceMensuelle),
      assurance: Math.round(assuranceMensuelle),
      horAssurance: Math.round(mensualiteHorsAssurance)
    };
  };
  
  const mensualites = calculerMensualite();
  const tauxEndettement = (mensualites.total / revenusMensuels) * 100;
  const resteAVivre = revenusMensuels - mensualites.total - chargesMensuelles;
  const coutTotalCredit = (mensualites.total * duree * 12) - montantEmprunt;

  return (
    <div ref={calculatorRef} className="max-w-4xl mx-auto p-6 xl:max-w-[1500px]">
      <h1 className="text-3xl font-extrabold mb-2 text-forest-800">Simulateur de prêt immobilier</h1>
      <p className="text-gray-600 mb-8">Calculez votre capacité d'emprunt et simulez votre prêt immobilier en quelques clics</p>
      
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 xl:grid xl:grid-cols-2 xl:gap-8">
          <div>
          <h2 className="text-xl font-extrabold mb-4 text-forest-800">Paramètres d'achat</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Prix d'achat du bien (€)
              </label>
              <input
                type="number"
                value={prixAchat || ''}
                onChange={(e) => setPrixAchat(Number(e.target.value))}
                className="w-full p-2 border border-primary-100 rounded-xl focus:ring focus:ring-primary-200 focus:border-primary-500"
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
                className="w-full p-2 border border-primary-100 rounded-xl focus:ring focus:ring-primary-200 focus:border-primary-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Revenus mensuels nets (€)
              </label>
              <input
                type="number"
                value={revenusMensuels || ''}
                onChange={(e) => setRevenusMensuels(Number(e.target.value))}
                className="w-full p-2 border border-primary-100 rounded-xl focus:ring focus:ring-primary-200 focus:border-primary-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Charges mensuelles (€)
              </label>
              <input
                type="number"
                value={chargesMensuelles || ''}
                onChange={(e) => setChargesMensuelles(Number(e.target.value))}
                className="w-full p-2 border border-primary-100 rounded-xl focus:ring focus:ring-primary-200 focus:border-primary-500"
              />
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={estPrimoAccedant}
                onChange={(e) => setEstPrimoAccedant(e.target.checked)}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-primary-100 rounded-xl"
              />
              <label className="ml-2 block text-sm text-gray-700">
                Primo-accédant (éligible au PTZ)
              </label>
            </div>
          </div>
          </div>
          
          <div>
          <h2 className="text-xl font-extrabold mt-6 mb-4 text-forest-800 xl:mt-0">Paramètres du financement</h2>
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
                className="w-full h-2 bg-gray-200 rounded-2xl appearance-none cursor-pointer"
              />
              <div className="text-sm text-gray-600 mt-1">{duree} ans</div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Taux d'intérêt (%)
              </label>
              <input
                type="number"
                step="0.1"
                value={tauxInteret}
                onChange={(e) => setTauxInteret(Number(e.target.value))}
                className="w-full p-2 border border-primary-100 rounded-xl focus:ring focus:ring-primary-200 focus:border-primary-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Taux d'assurance (%)
              </label>
              <input
                type="number"
                step="0.01"
                value={tauxAssurance}
                onChange={(e) => setTauxAssurance(Number(e.target.value))}
                className="w-full p-2 border border-primary-100 rounded-xl focus:ring focus:ring-primary-200 focus:border-primary-500"
              />
            </div>
          </div>
          </div>
        </div>

        <div>
          <div className="bg-cream-100 rounded-2xl p-6 mb-6">
            <h3 className="text-lg font-extrabold mb-4 text-forest-800">Résumé du financement</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Mensualité totale</p>
                <p className="text-2xl font-extrabold text-primary-600">{formatNumber(mensualites.total)} €</p>
                <p className="text-xs text-gray-500">dont {formatNumber(mensualites.assurance)} € d'assurance</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Taux d'endettement</p>
                <p className="text-2xl font-extrabold text-primary-600">{Math.round(tauxEndettement)} %</p>
                <p className="text-xs text-gray-500">{tauxEndettement <= 35 ? 'Acceptable' : 'Trop élevé'}</p>
              </div>
            </div>
          </div>

          <div className="bg-cream-100 rounded-2xl p-6">
            <h3 className="text-lg font-extrabold mb-4 text-forest-800">Détails du projet</h3>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Coût total du projet</h4>
                <table className="w-full text-sm">
                  <tbody>
                    <tr>
                      <td className="py-1 text-gray-600">Prix d'achat</td>
                      <td className="py-1 text-right font-medium">{formatNumber(prixAchat)} €</td>
                    </tr>
                    <tr>
                      <td className="py-1 text-gray-600">Frais de notaire</td>
                      <td className="py-1 text-right font-medium">{formatNumber(coutProjet.fraisNotaire)} €</td>
                    </tr>
                    <tr>
                      <td className="py-1 text-gray-600">Frais d'agence</td>
                      <td className="py-1 text-right font-medium">{formatNumber(coutProjet.fraisAgence)} €</td>
                    </tr>
                    <tr>
                      <td className="py-1 text-gray-600">Frais de dossier</td>
                      <td className="py-1 text-right font-medium">{formatNumber(fraisDossier)} €</td>
                    </tr>
                    <tr className="border-t">
                      <td className="py-2 font-medium">Total</td>
                      <td className="py-2 text-right font-medium">{formatNumber(coutProjet.totalProjet)} €</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Capacité financière</h4>
                <table className="w-full text-sm">
                  <tbody>
                    <tr>
                      <td className="py-1 text-gray-600">Revenus mensuels</td>
                      <td className="py-1 text-right font-medium">{formatNumber(revenusMensuels)} €</td>
                    </tr>
                    <tr>
                      <td className="py-1 text-gray-600">Charges mensuelles</td>
                      <td className="py-1 text-right font-medium">{formatNumber(chargesMensuelles)} €</td>
                    </tr>
                    <tr>
                      <td className="py-1 text-gray-600">Reste à vivre</td>
                      <td className="py-1 text-right font-medium">{formatNumber(resteAVivre)} €</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Liens vers les autres calculettes */}
          <div className="mt-8 text-center space-y-4">
            <Link href="/calculateurs/pret" className="block text-primary-600 hover:text-primary-800 font-medium">
              Essayer la version avancée →
            </Link>
            <Link href="/calculette-locative" className="block text-primary-600 hover:text-primary-800 font-medium">
              Voir aussi notre calculette d'investissement locatif →
            </Link>
            <Link href="/calculette-viager" className="block text-primary-600 hover:text-primary-800 font-medium">
              Découvrez notre calculette d'investissement en viager →
            </Link>
          </div>
        </div>
      </div>

      <CalculatorActions calculatorType="achat" calculatorRef={calculatorRef} />
    </div>
  );
} 