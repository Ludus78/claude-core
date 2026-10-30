import { describe, expect, it } from 'vitest';

import { calculateLoanDetails, calculateNotaryFees, calculatePTZ, type LoanInputs } from './pret';

describe('calculatePTZ', () => {
  it('renvoie 0 si l\'acheteur n\'est pas primo-accédant', () => {
    expect(calculatePTZ(300000, 'A', false)).toBe(0);
  });

  it('applique 40 % du prix quand le plafond n\'est pas atteint', () => {
    expect(calculatePTZ(300000, 'A', true)).toBe(120000);
    expect(calculatePTZ(200000, 'C', true)).toBe(80000);
  });

  it('plafonne le PTZ selon la zone', () => {
    expect(calculatePTZ(500000, 'A', true)).toBe(150000);
    expect(calculatePTZ(500000, 'B1', true)).toBe(135000);
    expect(calculatePTZ(500000, 'B2', true)).toBe(110000);
    expect(calculatePTZ(500000, 'C', true)).toBe(100000);
  });

  it('utilise le plafond de 100000 pour une zone inconnue', () => {
    expect(calculatePTZ(500000, 'Z', true)).toBe(100000);
  });
});

describe('calculateNotaryFees', () => {
  it('applique 8 % du prix d\'achat', () => {
    expect(calculateNotaryFees(200000)).toBeCloseTo(16000, 6);
    expect(calculateNotaryFees(0)).toBe(0);
  });
});

describe('calculateLoanDetails', () => {
  // Cas vérifié à la main :
  // notaire = 200000 x 8 % = 16000 ; capital = 200000 + 16000 - 20000 = 196000
  // taux mensuel = 3,6 / 1200 = 0,003 ; nombre de mensualités = 240
  // facteur (1,003)^240 = 2,052223 ; mensualité hors assurance = 196000 x 0,003 x 2,052223 / 1,052223 = 1146,82
  // assurance = 196000 x 0,3 % / 12 = 49
  // mensualité totale = 1195,82 ; taux d'endettement = 1195,82 / 4000 = 29,90 %
  // reste à vivre = 4000 - 1195,82 - 500 = 2304,18
  // total remboursé = 1146,82 x 240 = 275236,05 ; intérêts = 275236,05 - 196000 = 79236,05
  const baseInputs: LoanInputs = {
    purchasePrice: 200000,
    downPayment: 20000,
    loanTerm: 20,
    interestRate: 3.6,
    monthlyIncome: 4000,
    monthlyExpenses: 500,
    insuranceRate: 0.3,
    isFirstTimeBuyer: false,
    propertyZone: 'C',
  };

  it('calcule la mensualité hors assurance et la mensualité totale', () => {
    const result = calculateLoanDetails(baseInputs);
    expect(result.monthlyPayment).toBeCloseTo(1195.82, 1);
    expect(result.monthlyPayment - 49).toBeCloseTo(1146.82, 1);
  });

  it('calcule le coût total et les intérêts', () => {
    const result = calculateLoanDetails(baseInputs);
    expect(result.totalAmount).toBeCloseTo(275236.05, 0);
    expect(result.totalInterest).toBeCloseTo(79236.05, 0);
  });

  it('calcule le taux d\'endettement et le reste à vivre', () => {
    const result = calculateLoanDetails(baseInputs);
    expect(result.debtRatio).toBeCloseTo(29.8954, 2);
    expect(result.remainingForLife).toBeCloseTo(2304.18, 1);
  });

  it('renvoie les frais de notaire et un PTZ nul pour un non primo-accédant', () => {
    const result = calculateLoanDetails(baseInputs);
    expect(result.notaryFees).toBeCloseTo(16000, 6);
    expect(result.ptzAmount).toBe(0);
  });

  it('cohérence : totalAmount = mensualité hors assurance x durée', () => {
    const result = calculateLoanDetails(baseInputs);
    const monthlyHorsAssurance = result.monthlyPayment - 49;
    expect(result.totalAmount).toBeCloseTo(monthlyHorsAssurance * 240, 0);
  });

  it('déduit le PTZ du capital emprunté pour un primo-accédant', () => {
    // capital = 200000 + 16000 - 20000 - 80000 (PTZ zone C) = 116000, sans assurance
    const result = calculateLoanDetails({
      ...baseInputs,
      isFirstTimeBuyer: true,
      insuranceRate: 0,
    });
    expect(result.ptzAmount).toBe(80000);
    expect(result.totalAmount - result.totalInterest).toBeCloseTo(116000, 0);
  });

  it('renvoie une mensualité finie avec un taux à 0 %', () => {
    // capital = 120000 + 9600 = 129600 ; 120 mensualités ; attendu 1080 par mois
    const result = calculateLoanDetails({
      purchasePrice: 120000,
      downPayment: 0,
      loanTerm: 10,
      interestRate: 0,
      monthlyIncome: 3000,
      monthlyExpenses: 0,
      insuranceRate: 0,
      isFirstTimeBuyer: false,
      propertyZone: 'C',
    });
    expect(Number.isFinite(result.monthlyPayment)).toBe(true);
    expect(result.monthlyPayment).toBeCloseTo(1080, 2);
  });
});
