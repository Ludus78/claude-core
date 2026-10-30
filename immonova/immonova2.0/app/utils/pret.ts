export interface LoanDetails {
  monthlyPayment: number;
  totalInterest: number;
  totalAmount: number;
  debtRatio: number;
  notaryFees: number;
  ptzAmount: number;
  remainingForLife: number;
}

export interface LoanInputs {
  purchasePrice: number;
  downPayment: number;
  loanTerm: number;
  interestRate: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  insuranceRate: number;
  isFirstTimeBuyer: boolean;
  propertyZone: string;
}

// Calcul du PTZ
export const calculatePTZ = (price: number, zone: string, isFirstTimeBuyer: boolean) => {
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
export const calculateNotaryFees = (price: number) => {
  return price * 0.08; // Approximation des frais de notaire
};

// Calcul du prêt
export const calculateLoanDetails = (inputs: LoanInputs): LoanDetails => {
  const {
    purchasePrice, downPayment, loanTerm, interestRate,
    monthlyIncome, monthlyExpenses, insuranceRate, isFirstTimeBuyer, propertyZone
  } = inputs;

  const ptz = calculatePTZ(purchasePrice, propertyZone, isFirstTimeBuyer);
  const notaryFees = calculateNotaryFees(purchasePrice);
  const totalLoanAmount = purchasePrice + notaryFees - downPayment - ptz;

  // Calcul du prêt principal
  const monthlyRate = interestRate / 1200;
  const numberOfPayments = loanTerm * 12;
  const monthlyPayment = monthlyRate === 0
    ? totalLoanAmount / numberOfPayments
    : totalLoanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

  // Ajout de l'assurance
  const monthlyInsurance = (totalLoanAmount * (insuranceRate / 100)) / 12;
  const totalMonthlyPayment = monthlyPayment + monthlyInsurance;

  // Calcul du taux d'endettement
  const debtRatio = (totalMonthlyPayment / monthlyIncome) * 100;

  // Calcul du reste à vivre
  const remainingForLife = monthlyIncome - totalMonthlyPayment - monthlyExpenses;

  return {
    monthlyPayment: totalMonthlyPayment,
    totalInterest: (monthlyPayment * numberOfPayments) - totalLoanAmount,
    totalAmount: monthlyPayment * numberOfPayments,
    debtRatio: debtRatio,
    notaryFees: notaryFees,
    ptzAmount: ptz,
    remainingForLife: remainingForLife
  };
};
