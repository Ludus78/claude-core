import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import { query } from './db';
import { createUser } from './users';

vi.mock('./db', () => ({ query: vi.fn() }));

const TODAY = '2026-10-30';
const queryMock = query as unknown as Mock;

const adult = { email: 'a@example.com', pseudo: 'cinephile', birthDate: '1990-05-12', consent: true };

describe('createUser', () => {
  beforeEach(() => {
    queryMock.mockReset();
  });

  it('crée un compte actif pour un adulte', async () => {
    queryMock.mockResolvedValueOnce({ rows: [{ id: 'u-1' }] });

    const result = await createUser(adult, TODAY);

    expect(queryMock).toHaveBeenCalledTimes(1);
    expect(queryMock).toHaveBeenCalledWith(expect.stringContaining('INSERT INTO users'), [
      'a@example.com',
      'cinephile',
      '1990-05-12',
      'active',
    ]);
    expect(result).toEqual({ ok: true, userId: 'u-1', accountStatus: 'active' });
  });

  it('crée un compte en attente parentale à 13-14 ans', async () => {
    queryMock.mockResolvedValueOnce({ rows: [{ id: 'u-2' }] });

    const result = await createUser({ ...adult, birthDate: '2013-10-30' }, TODAY);

    expect(queryMock).toHaveBeenCalledWith(expect.any(String), [
      'a@example.com',
      'cinephile',
      '2013-10-30',
      'pending_parental',
    ]);
    expect(result).toEqual({ ok: true, userId: 'u-2', accountStatus: 'pending_parental' });
  });

  it('refuse les moins de 13 ans sans appeler la base', async () => {
    const result = await createUser({ ...adult, birthDate: '2013-10-31' }, TODAY);

    expect(result).toEqual({ ok: false, reason: 'too_young' });
    expect(queryMock).not.toHaveBeenCalled();
  });

  it('exige le consentement sans appeler la base', async () => {
    const result = await createUser({ ...adult, consent: false }, TODAY);

    expect(result).toEqual({ ok: false, reason: 'consent_required' });
    expect(queryMock).not.toHaveBeenCalled();
  });

  it('refuse une date de naissance invalide sans appeler la base', async () => {
    const result = await createUser({ ...adult, birthDate: '2024-02-30' }, TODAY);

    expect(result).toEqual({ ok: false, reason: 'invalid_birth_date' });
    expect(queryMock).not.toHaveBeenCalled();
  });

  it('refuse un pseudo invalide sans appeler la base', async () => {
    const result = await createUser({ ...adult, pseudo: 'a b c' }, TODAY);

    expect(result).toEqual({ ok: false, reason: 'invalid_pseudo' });
    expect(queryMock).not.toHaveBeenCalled();
  });

  it('refuse un e-mail invalide sans appeler la base', async () => {
    const result = await createUser({ ...adult, email: 'pas-un-email' }, TODAY);

    expect(result).toEqual({ ok: false, reason: 'invalid_email' });
    expect(queryMock).not.toHaveBeenCalled();
  });

  it('traduit une violation de contrainte pseudo en pseudo_taken', async () => {
    queryMock.mockRejectedValueOnce({ code: '23505', constraint: 'users_pseudo_key' });

    const result = await createUser(adult, TODAY);

    expect(result).toEqual({ ok: false, reason: 'pseudo_taken' });
  });

  it('traduit une violation de contrainte email en email_taken', async () => {
    queryMock.mockRejectedValueOnce({ code: '23505', constraint: 'users_email_key' });

    const result = await createUser(adult, TODAY);

    expect(result).toEqual({ ok: false, reason: 'email_taken' });
  });

  it('traduit une erreur too_young venant de la base', async () => {
    queryMock.mockRejectedValueOnce({ code: 'P0001', message: 'too_young' });

    const result = await createUser(adult, TODAY);

    expect(result).toEqual({ ok: false, reason: 'too_young' });
  });

  it('relance une erreur de connexion', async () => {
    queryMock.mockRejectedValueOnce(new Error('connexion perdue'));

    await expect(createUser(adult, TODAY)).rejects.toThrow('connexion perdue');
  });

  it('relance une violation unique sur une autre contrainte', async () => {
    const error = { code: '23505', constraint: 'users_autre_key' };
    queryMock.mockRejectedValueOnce(error);

    await expect(createUser(adult, TODAY)).rejects.toEqual(error);
  });
});
