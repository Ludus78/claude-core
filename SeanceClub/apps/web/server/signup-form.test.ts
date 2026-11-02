import { describe, expect, it } from 'vitest';
import { parseSignupForm, signupMessage } from './signup-form';

function form(fields: Record<string, string>): FormData {
  const data = new FormData();
  for (const [key, value] of Object.entries(fields)) data.set(key, value);
  return data;
}

const valid = { pseudo: 'cinephile', birthDate: '1990-05-12', consent: 'on' };

describe('parseSignupForm', () => {
  it('lit un formulaire valide', () => {
    expect(parseSignupForm(form(valid))).toEqual({
      pseudo: 'cinephile',
      birthDate: '1990-05-12',
      consent: true,
    });
  });

  it('exige le consentement', () => {
    expect(parseSignupForm(form({ pseudo: 'cinephile', birthDate: '1990-05-12' }))).toEqual({
      error: 'consent_required',
    });
  });

  it('refuse un consentement qui n’est pas « on »', () => {
    expect(parseSignupForm(form({ ...valid, consent: 'off' }))).toEqual({ error: 'consent_required' });
    expect(parseSignupForm(form({ ...valid, consent: 'true' }))).toEqual({ error: 'consent_required' });
  });

  it('renvoie invalid_form si un champ est manquant', () => {
    expect(parseSignupForm(form({ birthDate: '1990-05-12', consent: 'on' }))).toEqual({
      error: 'invalid_form',
    });
    expect(parseSignupForm(form({ pseudo: 'cinephile', consent: 'on' }))).toEqual({
      error: 'invalid_form',
    });
  });

  it('rogne le pseudo et la date de naissance', () => {
    expect(parseSignupForm(form({ pseudo: '  cinephile  ', birthDate: ' 1990-05-12 ', consent: 'on' }))).toEqual({
      pseudo: 'cinephile',
      birthDate: '1990-05-12',
      consent: true,
    });
  });

  it('ignore un e-mail présent dans le formulaire', () => {
    const result = parseSignupForm(form({ ...valid, email: 'autre@example.com' }));

    expect(result).toEqual({ pseudo: 'cinephile', birthDate: '1990-05-12', consent: true });
    expect(result).not.toHaveProperty('email');
  });
});

describe('signupMessage', () => {
  it.each([
    'invalid_pseudo',
    'invalid_email',
    'invalid_birth_date',
    'consent_required',
    'too_young',
    'pseudo_taken',
    'email_taken',
  ])('renvoie un texte pour le code %s', (code) => {
    const message = signupMessage(code);

    expect(typeof message).toBe('string');
    expect(message?.length).toBeGreaterThan(0);
  });

  it('renvoie un texte pour invalid_form, invalid_parent_email et not_eligible', () => {
    expect(signupMessage('invalid_form')).toEqual(expect.any(String));
    expect(signupMessage('invalid_parent_email')).toEqual(expect.any(String));
    expect(signupMessage('not_eligible')).toEqual(expect.any(String));
  });

  it('renvoie null pour un code inconnu', () => {
    expect(signupMessage('autre_chose')).toBeNull();
    expect(signupMessage('<script>alert(1)</script>')).toBeNull();
  });

  it('renvoie null pour un code absent ou vide', () => {
    expect(signupMessage(undefined)).toBeNull();
    expect(signupMessage('')).toBeNull();
  });

  it('renvoie null pour les propriétés héritées de l’objet', () => {
    expect(signupMessage('__proto__')).toBeNull();
    expect(signupMessage('constructor')).toBeNull();
    expect(signupMessage('toString')).toBeNull();
    expect(signupMessage('hasOwnProperty')).toBeNull();
  });
});
