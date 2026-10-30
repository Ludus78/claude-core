import { describe, expect, it } from 'vitest';
import { ageOn, decideSignup, isValidPseudo } from './signup';

const TODAY = '2026-10-30';

describe('ageOn', () => {
  it('compte les années pleines', () => {
    expect(ageOn('1990-05-12', TODAY)).toBe(36);
  });

  it('ne compte pas l’anniversaire la veille', () => {
    expect(ageOn('2013-10-31', TODAY)).toBe(12);
  });

  it('compte l’anniversaire le jour exact', () => {
    expect(ageOn('2013-10-30', TODAY)).toBe(13);
  });

  it('gère le 29 février (pas d’anniversaire avant le 1er mars une année non bissextile)', () => {
    expect(ageOn('2008-02-29', '2026-02-28')).toBe(17);
    expect(ageOn('2008-02-29', '2026-03-01')).toBe(18);
  });

  it('accepte une date de naissance du jour même', () => {
    expect(ageOn(TODAY, TODAY)).toBe(0);
  });

  it('renvoie null pour une date de naissance future', () => {
    expect(ageOn('2026-10-31', TODAY)).toBeNull();
    expect(ageOn('2027-01-01', TODAY)).toBeNull();
  });

  it('renvoie null pour une date inexistante', () => {
    expect(ageOn('2024-02-30', TODAY)).toBeNull();
    expect(ageOn('2010-13-01', TODAY)).toBeNull();
  });

  it('renvoie null pour un format invalide', () => {
    expect(ageOn('30/06/2010', TODAY)).toBeNull();
    expect(ageOn('2010-6-5', TODAY)).toBeNull();
    expect(ageOn('', TODAY)).toBeNull();
  });

  it('renvoie null si la date du jour est invalide', () => {
    expect(ageOn('2010-06-15', '2026-02-30')).toBeNull();
  });
});

describe('decideSignup', () => {
  it('refuse les moins de 13 ans (12 ans, veille des 13 ans)', () => {
    expect(decideSignup({ birthDate: '2013-10-31', consent: true, today: TODAY })).toEqual({
      allowed: false,
      reason: 'too_young',
    });
  });

  it('accepte en attente de consentement parental le jour des 13 ans', () => {
    expect(decideSignup({ birthDate: '2013-10-30', consent: true, today: TODAY })).toEqual({
      allowed: true,
      accountStatus: 'pending_parental',
    });
  });

  it('accepte en attente de consentement parental à 14 ans et 364 jours', () => {
    expect(decideSignup({ birthDate: '2011-10-31', consent: true, today: TODAY })).toEqual({
      allowed: true,
      accountStatus: 'pending_parental',
    });
  });

  it('active le compte le jour des 15 ans', () => {
    expect(decideSignup({ birthDate: '2011-10-30', consent: true, today: TODAY })).toEqual({
      allowed: true,
      accountStatus: 'active',
    });
  });

  it('active le compte d’un adulte', () => {
    expect(decideSignup({ birthDate: '1990-05-12', consent: true, today: TODAY })).toEqual({
      allowed: true,
      accountStatus: 'active',
    });
  });

  it('exige le consentement', () => {
    expect(decideSignup({ birthDate: '1990-05-12', consent: false, today: TODAY })).toEqual({
      allowed: false,
      reason: 'consent_required',
    });
  });

  it('renvoie invalid_birth_date pour une date invalide', () => {
    expect(decideSignup({ birthDate: '2024-02-30', consent: true, today: TODAY })).toEqual({
      allowed: false,
      reason: 'invalid_birth_date',
    });
    expect(decideSignup({ birthDate: 'pas une date', consent: true, today: TODAY })).toEqual({
      allowed: false,
      reason: 'invalid_birth_date',
    });
  });

  it('renvoie invalid_birth_date pour une date future', () => {
    expect(decideSignup({ birthDate: '2026-11-01', consent: true, today: TODAY })).toEqual({
      allowed: false,
      reason: 'invalid_birth_date',
    });
  });

  it('ordre des erreurs : une date invalide passe avant le consentement', () => {
    expect(decideSignup({ birthDate: '2024-02-30', consent: false, today: TODAY })).toEqual({
      allowed: false,
      reason: 'invalid_birth_date',
    });
  });

  it('ordre des erreurs : le consentement passe avant l’âge minimum', () => {
    expect(decideSignup({ birthDate: '2013-10-31', consent: false, today: TODAY })).toEqual({
      allowed: false,
      reason: 'consent_required',
    });
  });
});

describe('isValidPseudo', () => {
  it('accepte 3 et 20 caractères', () => {
    expect(isValidPseudo('abc')).toBe(true);
    expect(isValidPseudo('a'.repeat(20))).toBe(true);
  });

  it('refuse 2 et 21 caractères', () => {
    expect(isValidPseudo('ab')).toBe(false);
    expect(isValidPseudo('a'.repeat(21))).toBe(false);
  });

  it('accepte les caractères _ . - et les chiffres', () => {
    expect(isValidPseudo('a_b')).toBe(true);
    expect(isValidPseudo('a.b')).toBe(true);
    expect(isValidPseudo('a-b')).toBe(true);
    expect(isValidPseudo('User42')).toBe(true);
  });

  it('refuse un espace, un accent, un @ et la chaîne vide', () => {
    expect(isValidPseudo('a b c')).toBe(false);
    expect(isValidPseudo('Zoé')).toBe(false);
    expect(isValidPseudo('abc@x')).toBe(false);
    expect(isValidPseudo('')).toBe(false);
  });
});
