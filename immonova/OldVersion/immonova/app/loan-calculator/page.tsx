'use client';

import { useState } from 'react';
import MainLayout from '../components/layout/MainLayout';
import { FaCalculator, FaInfoCircle, FaChartLine, FaDownload } from 'react-icons/fa';

export default function LoanCalculatorPage() {
  // Loan parameters state
  const [loanAmount, setLoanAmount] = useState<number>(200000);
  const [interestRate, setInterestRate] = useState<number>(2.5);
  const [loanTerm, setLoanTerm] = useState<number>(25);
  const [downPayment, setDownPayment] = useState<number>(20000);
  const [insuranceRate, setInsuranceRate] = useState<number>(0.3);

  // Calculate monthly payment
  const calculateMonthlyPayment = () => {
    // Convert annual interest rate to monthly and decimal form
    const monthlyInterestRate = interestRate / 100 / 12;
    // Convert years to months
    const totalPayments = loanTerm * 12;
    // Calculate the amount financed
    const amountFinanced = loanAmount - downPayment;
    
    // Calculate monthly payment using the loan formula
    if (monthlyInterestRate === 0) {
      return amountFinanced / totalPayments;
    }
    
    const x = Math.pow(1 + monthlyInterestRate, totalPayments);
    const monthlyPayment = (amountFinanced * monthlyInterestRate * x) / (x - 1);
    
    // Add insurance
    const monthlyInsurance = (amountFinanced * (insuranceRate / 100)) / 12;
    
    return monthlyPayment + monthlyInsurance;
  };

  // Format as currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  // Calculate total cost of loan
  const calculateTotalCost = () => {
    const monthlyPayment = calculateMonthlyPayment();
    const totalPayments = loanTerm * 12;
    return monthlyPayment * totalPayments;
  };

  // Calculate total interest paid
  const calculateTotalInterest = () => {
    const amountFinanced = loanAmount - downPayment;
    const totalCost = calculateTotalCost();
    return totalCost - amountFinanced;
  };

  // Calculate the debt-to-income ratio
  const calculateDebtToIncomeRatio = (monthlyIncome: number) => {
    if (!monthlyIncome) return 0;
    return (calculateMonthlyPayment() / monthlyIncome) * 100;
  };

  const [monthlyIncome, setMonthlyIncome] = useState<number>(3000);
  const debtToIncomeRatio = calculateDebtToIncomeRatio(monthlyIncome);

  // Loan types for educational purpose
  const loanTypes = [
    {
      name: 'Prêt à taux fixe',
      description: 'Le taux d\'intérêt reste constant pendant toute la durée du prêt, ce qui donne des mensualités stables.',
      pros: ['Mensualités fixes et prévisibles', 'Protection contre les hausses de taux', 'Idéal pour une planification budgétaire à long terme'],
      cons: ['Taux généralement plus élevé qu\'un prêt à taux variable', 'Pénalités de remboursement anticipé souvent plus importantes']
    },
    {
      name: 'Prêt à taux variable',
      description: 'Le taux d\'intérêt peut fluctuer en fonction de l\'évolution des taux du marché, ce qui peut faire varier les mensualités.',
      pros: ['Taux initial souvent plus bas que le taux fixe', 'Possibilité de profiter des baisses de taux', 'Pénalités de remboursement anticipé souvent moins élevées'],
      cons: ['Mensualités imprévisibles', 'Risque de hausse significative en cas d\'augmentation des taux']
    },
    {
      name: 'Prêt à paliers',
      description: 'Permet de commencer avec des mensualités plus faibles qui augmentent progressivement selon un calendrier prédéfini.',
      pros: ['Mensualités initiales réduites', 'Adapté aux jeunes actifs dont les revenus vont augmenter', 'Permet d\'accéder à la propriété plus rapidement'],
      cons: ['Coût total du crédit généralement plus élevé', 'Risque financier si l\'augmentation de revenus espérée ne se produit pas']
    },
    {
      name: 'Prêt à taux zéro (PTZ)',
      description: 'Prêt sans intérêt accordé sous conditions de ressources pour l\'achat d\'un premier logement ou d\'un logement neuf.',
      pros: ['Aucun intérêt à payer', 'Permet d\'augmenter la capacité d\'emprunt', 'Possibilité de différer le remboursement'],
      cons: ['Montant limité', 'Conditions d\'éligibilité strictes', 'Ne peut financer qu\'une partie de l\'achat']
    }
  ];

  // Active loan type for the detail panel
  const [activeLoanType, setActiveLoanType] = useState(0);

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Simulation de Prêt Immobilier</h1>
        <p className="text-lg text-gray-600 mb-10">
          Calculez vos mensualités, comprenez les différents types de prêts et évaluez votre capacité d'emprunt.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calculator Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <FaCalculator className="mr-2 text-indigo-600" />
                  Calculateur de Prêt
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Montant du prêt (€)
                    </label>
                    <input
                      type="number"
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      value={loanAmount}
                      onChange={(e) => setLoanAmount(Number(e.target.value))}
                    />
                    <input
                      type="range"
                      className="w-full mt-2"
                      min="10000"
                      max="1000000"
                      step="10000"
                      value={loanAmount}
                      onChange={(e) => setLoanAmount(Number(e.target.value))}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Apport initial (€)
                    </label>
                    <input
                      type="number"
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      value={downPayment}
                      onChange={(e) => setDownPayment(Number(e.target.value))}
                    />
                    <input
                      type="range"
                      className="w-full mt-2"
                      min="0"
                      max={loanAmount * 0.5}
                      step="5000"
                      value={downPayment}
                      onChange={(e) => setDownPayment(Number(e.target.value))}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Taux d'intérêt (%)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      value={interestRate}
                      onChange={(e) => setInterestRate(Number(e.target.value))}
                    />
                    <input
                      type="range"
                      className="w-full mt-2"
                      min="0"
                      max="10"
                      step="0.1"
                      value={interestRate}
                      onChange={(e) => setInterestRate(Number(e.target.value))}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Durée du prêt (années)
                    </label>
                    <input
                      type="number"
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      value={loanTerm}
                      onChange={(e) => setLoanTerm(Number(e.target.value))}
                    />
                    <input
                      type="range"
                      className="w-full mt-2"
                      min="5"
                      max="30"
                      step="1"
                      value={loanTerm}
                      onChange={(e) => setLoanTerm(Number(e.target.value))}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Taux d'assurance (%)
                    </label>
                    <input
                      type="number"
                      step="0.05"
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      value={insuranceRate}
                      onChange={(e) => setInsuranceRate(Number(e.target.value))}
                    />
                    <input
                      type="range"
                      className="w-full mt-2"
                      min="0"
                      max="2"
                      step="0.05"
                      value={insuranceRate}
                      onChange={(e) => setInsuranceRate(Number(e.target.value))}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Revenu mensuel net (€)
                    </label>
                    <input
                      type="number"
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      value={monthlyIncome}
                      onChange={(e) => setMonthlyIncome(Number(e.target.value))}
                    />
                    <input
                      type="range"
                      className="w-full mt-2"
                      min="1000"
                      max="10000"
                      step="100"
                      value={monthlyIncome}
                      onChange={(e) => setMonthlyIncome(Number(e.target.value))}
                    />
                  </div>
                </div>

                <div className="mt-8 p-6 bg-gray-50 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm text-gray-600">Mensualité estimée</p>
                      <p className="text-2xl font-bold text-indigo-600">
                        {formatCurrency(calculateMonthlyPayment())}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600">Coût total du crédit</p>
                      <p className="text-2xl font-bold text-gray-800">
                        {formatCurrency(calculateTotalCost())}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600">Total des intérêts payés</p>
                      <p className="text-xl font-bold text-gray-800">
                        {formatCurrency(calculateTotalInterest())}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600">Taux d'endettement</p>
                      <p className={`text-xl font-bold ${
                        debtToIncomeRatio > 33 ? 'text-red-600' : 'text-green-600'
                      }`}>
                        {debtToIncomeRatio.toFixed(1)}%
                        {debtToIncomeRatio > 33 && (
                          <span className="ml-2 text-sm font-normal text-red-600">
                            (Supérieur au seuil recommandé de 33%)
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-center">
                  <button className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    <FaDownload className="mr-2" />
                    Télécharger le tableau d'amortissement
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Educational Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <FaInfoCircle className="mr-2 text-indigo-600" />
                  Types de Prêts Immobiliers
                </h2>

                <div className="space-y-4">
                  {loanTypes.map((loan, index) => (
                    <button
                      key={index}
                      className={`w-full text-left p-3 rounded-lg transition-colors ${
                        activeLoanType === index
                          ? 'bg-indigo-100 text-indigo-800'
                          : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                      }`}
                      onClick={() => setActiveLoanType(index)}
                    >
                      {loan.name}
                    </button>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-lg text-gray-900 mb-2">
                    {loanTypes[activeLoanType].name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {loanTypes[activeLoanType].description}
                  </p>

                  <div className="mb-3">
                    <h4 className="font-medium text-green-700 mb-1">Avantages:</h4>
                    <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                      {loanTypes[activeLoanType].pros.map((pro, index) => (
                        <li key={index}>{pro}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium text-red-700 mb-1">Inconvénients:</h4>
                    <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                      {loanTypes[activeLoanType].cons.map((con, index) => (
                        <li key={index}>{con}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 bg-indigo-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-indigo-900 mb-3">
                Conseils pour votre emprunt
              </h3>
              <ul className="space-y-2 text-indigo-700">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Comparez les offres de plusieurs banques pour obtenir les meilleures conditions</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>N'hésitez pas à négocier le taux d'assurance, qui peut représenter un coût significatif</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Privilégiez un apport personnel d'au moins 10% pour rassurer les banques</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Maintenez votre taux d'endettement en dessous de 33% pour maximiser vos chances d'obtenir un prêt</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
} 