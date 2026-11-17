import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import { requireSessionEmail } from '../../server/session';
import { parseSignupForm } from '../../server/signup-form';
import { createUser, findUserByEmail } from '../../server/users';
import { requestParentalConsent } from '../../server/parental';
import { demanderAccordParent, inscrire } from './actions';

// Comme le vrai redirect de Next : il lève une erreur qui porte l'URL.
const { RedirectError } = vi.hoisted(() => {
  class RedirectError extends Error {
    url: string;
    constructor(url: string) {
      super(`NEXT_REDIRECT ${url}`);
      this.url = url;
    }
  }
  return { RedirectError };
});

vi.mock('next/navigation', () => ({
  redirect: (url: string) => {
    throw new RedirectError(url);
  },
}));
vi.mock('../../server/session', () => ({ requireSessionEmail: vi.fn() }));
vi.mock('../../server/signup-form', () => ({ parseSignupForm: vi.fn() }));
vi.mock('../../server/users', () => ({ createUser: vi.fn(), findUserByEmail: vi.fn() }));
vi.mock('../../server/parental', () => ({ requestParentalConsent: vi.fn() }));

const requireSessionEmailMock = requireSessionEmail as unknown as Mock;
const parseSignupFormMock = parseSignupForm as unknown as Mock;
const createUserMock = createUser as unknown as Mock;
const findUserByEmailMock = findUserByEmail as unknown as Mock;
const requestParentalConsentMock = requestParentalConsent as unknown as Mock;

const SESSION_EMAIL = 'membre@example.com';

// Renvoie l'URL de la redirection levée par l'action, ou échoue si aucune redirection n'a lieu.
async function redirectUrl(action: Promise<unknown>): Promise<string> {
  try {
    await action;
  } catch (error) {
    if (error instanceof RedirectError) return error.url;
    throw error;
  }
  throw new Error('aucune redirection');
}

function formOf(fields: Record<string, string>): FormData {
  const formData = new FormData();
  for (const [key, value] of Object.entries(fields)) formData.append(key, value);
  return formData;
}

const validForm = { pseudo: 'cinephile', birthDate: '1990-05-12', consent: true };

beforeEach(() => {
  requireSessionEmailMock.mockReset();
  parseSignupFormMock.mockReset();
  createUserMock.mockReset();
  findUserByEmailMock.mockReset();
  requestParentalConsentMock.mockReset();
  requireSessionEmailMock.mockResolvedValue(SESSION_EMAIL);
});

describe('inscrire', () => {
  it('redirige vers /inscription avec l’erreur quand le formulaire est invalide', async () => {
    parseSignupFormMock.mockReturnValue({ error: 'consent_required' });

    const url = await redirectUrl(inscrire(new FormData()));

    expect(url).toBe('/inscription?erreur=consent_required');
    expect(createUserMock).not.toHaveBeenCalled();
  });

  it('redirige vers /inscription avec la raison quand la création est refusée', async () => {
    parseSignupFormMock.mockReturnValue(validForm);
    createUserMock.mockResolvedValue({ ok: false, reason: 'too_young' });

    const url = await redirectUrl(inscrire(new FormData()));

    expect(url).toBe('/inscription?erreur=too_young');
  });

  it('redirige vers /inscription/parent quand le compte est pending_parental', async () => {
    parseSignupFormMock.mockReturnValue(validForm);
    createUserMock.mockResolvedValue({ ok: true, userId: 'u1', accountStatus: 'pending_parental' });

    const url = await redirectUrl(inscrire(new FormData()));

    expect(url).toBe('/inscription/parent');
  });

  it('redirige vers / quand le compte est actif', async () => {
    parseSignupFormMock.mockReturnValue(validForm);
    createUserMock.mockResolvedValue({ ok: true, userId: 'u1', accountStatus: 'active' });

    const url = await redirectUrl(inscrire(new FormData()));

    expect(url).toBe('/');
  });

  it('prend l’e-mail de la session et jamais celui du formulaire', async () => {
    // Que parseSignupForm ne renvoie jamais `email` est vérifié dans signup-form.test.ts.
    parseSignupFormMock.mockReturnValue(validForm);
    createUserMock.mockResolvedValue({ ok: true, userId: 'u1', accountStatus: 'active' });

    await redirectUrl(inscrire(formOf({ email: 'attaquant@example.com', pseudo: 'cinephile' })));

    expect(createUserMock).toHaveBeenCalledTimes(1);
    expect(createUserMock).toHaveBeenCalledWith({ email: SESSION_EMAIL, ...validForm });
  });

  it('renvoie vers la connexion sans rien créer quand il n’y a pas de session', async () => {
    requireSessionEmailMock.mockRejectedValue(new RedirectError('/api/auth/login?post_login_redirect_url=%2Finscription'));

    const url = await redirectUrl(inscrire(new FormData()));

    expect(url).toBe('/api/auth/login?post_login_redirect_url=%2Finscription');
    expect(requireSessionEmailMock).toHaveBeenCalledWith('/inscription');
    expect(parseSignupFormMock).not.toHaveBeenCalled();
    expect(createUserMock).not.toHaveBeenCalled();
  });
});

describe('demanderAccordParent', () => {
  it('renvoie vers la connexion sans rien chercher quand il n’y a pas de session', async () => {
    requireSessionEmailMock.mockRejectedValue(
      new RedirectError('/api/auth/login?post_login_redirect_url=%2Finscription%2Fparent'),
    );

    const url = await redirectUrl(demanderAccordParent(formOf({ parentEmail: 'parent@example.com' })));

    expect(url).toBe('/api/auth/login?post_login_redirect_url=%2Finscription%2Fparent');
    expect(requireSessionEmailMock).toHaveBeenCalledWith('/inscription/parent');
    expect(findUserByEmailMock).not.toHaveBeenCalled();
    expect(requestParentalConsentMock).not.toHaveBeenCalled();
  });

  it('redirige vers /inscription sans demande quand l’utilisateur est absent', async () => {
    findUserByEmailMock.mockResolvedValue(null);

    const url = await redirectUrl(demanderAccordParent(formOf({ parentEmail: 'parent@example.com' })));

    expect(url).toBe('/inscription');
    expect(requestParentalConsentMock).not.toHaveBeenCalled();
  });

  it('redirige vers /inscription sans demande quand le compte n’est pas pending_parental', async () => {
    findUserByEmailMock.mockResolvedValue({ id: 'u1', accountStatus: 'active' });

    const url = await redirectUrl(demanderAccordParent(formOf({ parentEmail: 'parent@example.com' })));

    expect(url).toBe('/inscription');
    expect(requestParentalConsentMock).not.toHaveBeenCalled();
  });

  it('redirige vers /inscription/parent avec la raison quand la demande est refusée', async () => {
    findUserByEmailMock.mockResolvedValue({ id: 'u1', accountStatus: 'pending_parental' });
    requestParentalConsentMock.mockResolvedValue({ ok: false, reason: 'invalid_parent_email' });

    const url = await redirectUrl(demanderAccordParent(formOf({ parentEmail: 'pas-un-email' })));

    expect(url).toBe('/inscription/parent?erreur=invalid_parent_email');
  });

  it('enregistre la demande sans jamais mettre le jeton dans une URL', async () => {
    const token = 'f'.repeat(64);
    findUserByEmailMock.mockResolvedValue({ id: 'u1', accountStatus: 'pending_parental' });
    requestParentalConsentMock.mockResolvedValue({ ok: true, token });

    const url = await redirectUrl(demanderAccordParent(formOf({ parentEmail: '  parent@example.com  ' })));

    expect(findUserByEmailMock).toHaveBeenCalledWith(SESSION_EMAIL);
    expect(requestParentalConsentMock).toHaveBeenCalledWith('u1', 'parent@example.com');
    expect(url).toBe('/inscription/parent?enregistre=1');
    expect(url).not.toContain(token);
  });
});
