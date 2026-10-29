"use client";

import { useState, useEffect, useRef } from 'react';
import { Tab } from '@headlessui/react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import CalculatorActions from '../../components/CalculatorActions';
import { formatNumber } from '../../utils/formatters';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { 
  InformationCircleIcon,
  ChartPieIcon,
  TableCellsIcon,
  DocumentTextIcon,
  ShareIcon,
  BookmarkIcon
} from '@heroicons/react/24/outline';

// Enregistrement des composants Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

// Import dynamique des composants Chart.js pour éviter les erreurs côté serveur
const DynamicLine = dynamic(() => import('react-chartjs-2').then(mod => mod.Line), { ssr: false });
const DynamicDoughnut = dynamic(() => import('react-chartjs-2').then(mod => mod.Doughnut), { ssr: false });

interface LoanDetails {
  monthlyPayment: number;
  totalInterest: number;
  totalAmount: number;
  debtRatio: number;
  notaryFees: number;
  ptzAmount: number;
  remainingForLife: number;
}

export default function LoanCalculator() {
  const calculatorRef = useRef<HTMLDivElement>(null);
  // États pour les entrées utilisateur
  const [purchasePrice, setPurchasePrice] = useState(200000);
  const [downPayment, setDownPayment] = useState(20000);
  const [loanTerm, setLoanTerm] = useState(25);
  const [interestRate, setInterestRate] = useState(4.1);
  const [monthlyIncome, setMonthlyIncome] = useState(3000);
  const [monthlyExpenses, setMonthlyExpenses] = useState(800);
  const [insuranceRate, setInsuranceRate] = useState(0.34);
  const [isFirstTimeBuyer, setIsFirstTimeBuyer] = useState(true);
  const [propertyType, setPropertyType] = useState('apartment');
  const [propertyZone, setPropertytyZone] = useState('B1');
  const [energyRating, setEnergyRating] = useState('D');

  // États pour les résultats
  const [loanDetails, setLoanDetails] = useState<LoanDetails>({
    monthlyPayment: 0,
    totalInterest: 0,
    totalAmount: 0,
    debtRatio: 0,
    notaryFees: 0,
    ptzAmount: 0,
    remainingForLife: 0
  });

  // État pour le mode d'affichage
  const [displayMode, setDisplayMode] = useState<'graph' | 'table'>('graph');

  // Calcul du PTZ
  const calculatePTZ = (price: number, zone: string) => {
    if (!isFirstTimeBuyer) return 0;
    
    const maxPriceByZone = {
      'A': 150000,
      'B1': 135000,
      'B2': 110000,
      'C': 100000
    };
    
    const maxPrice = maxPriceByZone[zone as keyof typeof maxPriceByZone] || 100000;
    return Math.min(price * 0.4, maxPrice);
  };

  // Calcul des frais de notaire
  const calculateNotaryFees = (price: number) => {
    return price * 0.08; // Approximation des frais de notaire
  };

  // Calcul du prêt
  useEffect(() => {
    const calculateLoan = () => {
      const ptz = calculatePTZ(purchasePrice, propertyZone);
      const notaryFees = calculateNotaryFees(purchasePrice);
      const totalLoanAmount = purchasePrice + notaryFees - downPayment - ptz;
      
      // Calcul du prêt principal
      const monthlyRate = interestRate / 1200;
      const numberOfPayments = loanTerm * 12;
      const monthlyPayment = totalLoanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
      
      // Ajout de l'assurance
      const monthlyInsurance = (totalLoanAmount * (insuranceRate / 100)) / 12;
      const totalMonthlyPayment = monthlyPayment + monthlyInsurance;
      
      // Calcul du taux d'endettement
      const debtRatio = (totalMonthlyPayment / monthlyIncome) * 100;
      
      // Calcul du reste à vivre
      const remainingForLife = monthlyIncome - totalMonthlyPayment - monthlyExpenses;

      setLoanDetails({
        monthlyPayment: totalMonthlyPayment,
        totalInterest: (monthlyPayment * numberOfPayments) - totalLoanAmount,
        totalAmount: monthlyPayment * numberOfPayments,
        debtRatio: debtRatio,
        notaryFees: notaryFees,
        ptzAmount: ptz,
        remainingForLife: remainingForLife
      });
    };

    calculateLoan();
  }, [purchasePrice, downPayment, loanTerm, interestRate, monthlyIncome, monthlyExpenses, insuranceRate, isFirstTimeBuyer, propertyZone]);

  // Configuration du graphique en donut
  const donutData = {
    labels: ['Prix du bien', 'Frais de notaire', 'Intérêts', 'PTZ', 'Apport'],
    datasets: [{
      data: [
        purchasePrice,
        loanDetails.notaryFees,
        loanDetails.totalInterest,
        loanDetails.ptzAmount,
        downPayment
      ],
      backgroundColor: [
        'rgba(54, 162, 235, 0.8)',
        'rgba(255, 99, 132, 0.8)',
        'rgba(255, 206, 86, 0.8)',
        'rgba(75, 192, 192, 0.8)',
        'rgba(153, 102, 255, 0.8)'
      ]
    }]
  };

  return (
    <div ref={calculatorRef} className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Simulateur de prêt immobilier</h1>
          <p className="mt-2 text-gray-600">
            Calculez votre capacité d'emprunt et simulez votre prêt immobilier en quelques clics
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Panneau de configuration */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Votre projet</h2>
              
              {/* Prix du bien */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Prix du bien
                </label>
                <div className="flex items-center">
                  <input
                    type="range"
                    min="50000"
                    max="1000000"
                    step="5000"
                    value={purchasePrice}
                    onChange={(e) => setPurchasePrice(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="ml-2 w-24 text-sm text-gray-600">
                    {formatNumber(purchasePrice)} €
                  </span>
                </div>
              </div>

              {/* Apport */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Apport personnel
                </label>
                <div className="flex items-center">
                  <input
                    type="range"
                    min="0"
                    max={purchasePrice * 0.5}
                    step="1000"
                    value={downPayment}
                    onChange={(e) => setDownPayment(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="ml-2 w-24 text-sm text-gray-600">
                    {formatNumber(downPayment)} €
                  </span>
                </div>
              </div>

              {/* Durée du prêt */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Durée du prêt
                </label>
                <div className="flex items-center">
                  <input
                    type="range"
                    min="5"
                    max="30"
                    step="1"
                    value={loanTerm}
                    onChange={(e) => setLoanTerm(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="ml-2 w-24 text-sm text-gray-600">
                    {loanTerm} ans
                  </span>
                </div>
              </div>

              {/* Taux d'intérêt */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Taux d'intérêt
                </label>
                <div className="flex items-center">
                  <input
                    type="range"
                    min="1"
                    max="7"
                    step="0.1"
                    value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="ml-2 w-24 text-sm text-gray-600">
                    {interestRate}%
                  </span>
                </div>
              </div>

              {/* Revenus mensuels */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Revenus mensuels nets
                </label>
                <div className="flex items-center">
                  <input
                    type="range"
                    min="1200"
                    max="10000"
                    step="100"
                    value={monthlyIncome}
                    onChange={(e) => setMonthlyIncome(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="ml-2 w-24 text-sm text-gray-600">
                    {formatNumber(monthlyIncome)}€
                  </span>
                </div>
              </div>

              {/* Options supplémentaires */}
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Options supplémentaires</h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={isFirstTimeBuyer}
                      onChange={(e) => setIsFirstTimeBuyer(e.target.checked)}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-600">
                      Primo-accédant (PTZ)
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Résultats et visualisations */}
          <div className="lg:col-span-2 space-y-6">
            {/* Résumé */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-sm font-medium text-gray-500">Mensualité</div>
                  <div className="mt-1 text-3xl font-semibold text-primary-600">
                    {formatNumber(loanDetails.monthlyPayment)} €
                  </div>
                  <div className="mt-1 text-xs text-gray-500">Assurance incluse</div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-medium text-gray-500">Taux d'endettement</div>
                  <div className="mt-1 text-3xl font-semibold text-primary-600">
                    {Math.round(loanDetails.debtRatio)}%
                  </div>
                  <div className="mt-1 text-xs text-gray-500">
                    {loanDetails.debtRatio <= 35 ? 'Acceptable' : 'Trop élevé'}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-medium text-gray-500">Reste à vivre</div>
                  <div className="mt-1 text-3xl font-semibold text-primary-600">
                    {formatNumber(loanDetails.remainingForLife)}€
                  </div>
                  <div className="mt-1 text-xs text-gray-500">Par mois</div>
                </div>
              </div>
            </div>

            {/* Graphiques */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Répartition du coût total</h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setDisplayMode('graph')}
                    className={`p-2 rounded-md ${displayMode === 'graph' ? 'bg-primary-100 text-primary-600' : 'text-gray-400 hover:text-gray-500'}`}
                  >
                    <ChartPieIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setDisplayMode('table')}
                    className={`p-2 rounded-md ${displayMode === 'table' ? 'bg-primary-100 text-primary-600' : 'text-gray-400 hover:text-gray-500'}`}
                  >
                    <TableCellsIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {displayMode === 'graph' ? (
                <div className="h-80">
                  <DynamicDoughnut 
                    data={donutData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                    }}
                  />
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Composant
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Montant
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Pourcentage
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {[
                        { label: 'Prix du bien', value: purchasePrice },
                        { label: 'Frais de notaire', value: loanDetails.notaryFees },
                        { label: 'Intérêts', value: loanDetails.totalInterest },
                        { label: 'PTZ', value: loanDetails.ptzAmount },
                        { label: 'Apport', value: downPayment },
                      ].map((item, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {item.label}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                            {formatNumber(item.value)}€
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                            {Math.round((item.value / (purchasePrice + loanDetails.notaryFees + loanDetails.totalInterest)) * 100)}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Supprimer les boutons personnalisés redondants */}
            <div className="mt-4">
              <CalculatorActions calculatorType="pret" calculatorRef={calculatorRef} />
            </div>
          </div>
        </div>

        <div className="mt-8 text-center space-y-4">
          <Link href="/calculette" className="block text-indigo-600 hover:text-indigo-800 font-medium">
            Revenir à la version classique →
          </Link>
          <Link href="/calculette-locative" className="block text-indigo-600 hover:text-indigo-800 font-medium">
            Voir aussi notre calculette d'investissement locatif →
          </Link>
          <Link href="/calculette-viager" className="block text-indigo-600 hover:text-indigo-800 font-medium">
            Découvrez notre calculette d'investissement en viager →
          </Link>
        </div>
      </div>
    </div>
  );
} 