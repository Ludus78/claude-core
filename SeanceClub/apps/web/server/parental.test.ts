import { createHash } from 'node:crypto';
import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import { query } from './db';
import { approveParentalConsent, requestParentalConsent } from './parental';

vi.mock('./db', () => ({ query: vi.fn() }));

const queryMock = query as unknown as Mock;
const sha256 = (value: string) => createHash('sha256').update(value).digest('hex');

describe('requestParentalConsent', () => {
  beforeEach(() => {
    queryMock.mockReset();
  });

  it('refuse un e-mail parent invalide sans appeler la base', async () => {
    const result = await requestParentalConsent('u1', 'pas-un-email');

    expect(result).toEqual({ ok: false, reason: 'invalid_parent_email' });
    expect(queryMock).not.toHaveBeenCalled();
  });

  it('renvoie un token brut de 64 caractères hexadécimaux quand la demande est créée', async () => {
    queryMock.mockResolvedValueOnce({ rows: [{ id: 'c1' }] });

    const result = await requestParentalConsent('u1', 'parent@example.com');

    expect(result).toEqual({ ok: true, token: expect.stringMatching(/^[0-9a-f]{64}$/) });
  });

  it("n'envoie pas le token brut à la base, mais son hash sha256", async () => {
    queryMock.mockResolvedValueOnce({ rows: [{ id: 'c1' }] });

    const result = await requestParentalConsent('u1', 'parent@example.com');

    expect(result.ok).toBe(true);
    const token = (result as { ok: true; token: string }).token;
    const [sql, params] = queryMock.mock.calls[0];
    expect(params).toEqual(['u1', 'parent@example.com', sha256(token)]);
    expect(params).not.toContain(token);
    expect(sql).toContain("u.account_status = 'pending_parental'");
    expect(sql).toContain('u.email <> $2::citext');
    expect(sql).toContain("SET status = 'expired'");
  });

  it('renvoie not_eligible quand aucune ligne n’est insérée', async () => {
    queryMock.mockResolvedValueOnce({ rows: [] });

    const result = await requestParentalConsent('u1', 'parent@example.com');

    expect(result).toEqual({ ok: false, reason: 'not_eligible' });
  });

  it('donne deux tokens différents à deux appels', async () => {
    queryMock.mockResolvedValue({ rows: [{ id: 'c1' }] });

    const first = await requestParentalConsent('u1', 'parent@example.com');
    const second = await requestParentalConsent('u1', 'parent@example.com');

    expect(first.ok && second.ok).toBe(true);
    expect((first as { token: string }).token).not.toBe((second as { token: string }).token);
  });
});

describe('approveParentalConsent', () => {
  beforeEach(() => {
    queryMock.mockReset();
  });

  it('active le compte quand le token correspond à une demande en attente', async () => {
    queryMock.mockResolvedValueOnce({ rows: [{ id: 'u1' }] });

    const result = await approveParentalConsent('a'.repeat(64));

    expect(result).toEqual({ ok: true });
  });

  it('renvoie invalid_or_expired quand aucune ligne n’est mise à jour', async () => {
    queryMock.mockResolvedValueOnce({ rows: [] });

    const result = await approveParentalConsent('a'.repeat(64));

    expect(result).toEqual({ ok: false, reason: 'invalid_or_expired' });
  });

  it('envoie à la base le hash sha256 du token, jamais le token brut', async () => {
    queryMock.mockResolvedValueOnce({ rows: [{ id: 'u1' }] });
    const token = 'b'.repeat(64);

    await approveParentalConsent(token);

    const [, params] = queryMock.mock.calls[0];
    expect(params).toEqual([sha256(token)]);
    expect(params).not.toContain(token);
  });

  it('garde les conditions de statut et d’expiration dans le SQL', async () => {
    queryMock.mockResolvedValueOnce({ rows: [{ id: 'u1' }] });

    await approveParentalConsent('c'.repeat(64));

    const [sql] = queryMock.mock.calls[0];
    expect(sql).toContain("pc.status = 'pending'");
    expect(sql).toContain("u.account_status = 'pending_parental'");
    expect(sql).toContain('expires_at > now()');
  });
});
