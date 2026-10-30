import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { getAccessToken, getSignedInEmail, invalidateAccessToken } from '../auth/identity'
import { fetchRecentInboxMails, fetchRecentSpamMails } from './client'

vi.mock('../auth/identity', () => ({
  getAccessToken: vi.fn(),
  getSignedInEmail: vi.fn(),
  invalidateAccessToken: vi.fn(),
}))

vi.mock('../detection/riskScorer', () => ({
  calculateRiskScore: vi.fn(() => ({
    score: 42,
    level: 'medium',
    triggeredSignals: [{ signal: 'link', explanation: 'Lien suspect fictif', weight: 10 }],
  })),
}))

const LIST_URL = 'https://gmail.googleapis.com/gmail/v1/users/me/messages'
const MESSAGE_URL = 'https://gmail.googleapis.com/gmail/v1/users/me/messages/msg-1'

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

function encodeHtml(html: string): string {
  return Buffer.from(html, 'utf8').toString('base64url')
}

/** Mail fictif : aucune donnée réelle. */
function buildMessage(html: string) {
  return {
    id: 'msg-1',
    threadId: 'thread-1',
    payload: {
      mimeType: 'text/html',
      headers: [
        { name: 'From', value: 'Banque Exemple <alerte@banque-exemple.fr>' },
        { name: 'To', value: 'moi@example.com' },
        { name: 'Subject', value: 'Message de test' },
        { name: 'Date', value: 'Mon, 1 Jun 2026 10:00:00 +0000' },
        {
          name: 'Authentication-Results',
          value: 'mx.google.com; spf=pass smtp.mailfrom=banque-exemple.fr; dkim=pass header.i=@banque-exemple.fr; dmarc=pass header.from=banque-exemple.fr',
        },
      ],
      body: { data: encodeHtml(html) },
    },
  }
}

describe('fetchRecentInboxMails / fetchRecentSpamMails', () => {
  let fetchMock: ReturnType<typeof vi.fn>
  let consoleGroup: ReturnType<typeof vi.spyOn>
  let consoleGroupEnd: ReturnType<typeof vi.spyOn>
  let consoleLog: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    vi.mocked(getAccessToken).mockReset()
    vi.mocked(getSignedInEmail).mockReset()
    vi.mocked(invalidateAccessToken).mockReset()

    vi.mocked(getAccessToken).mockResolvedValue('token-1')
    vi.mocked(getSignedInEmail).mockResolvedValue('moi@example.com')
    vi.mocked(invalidateAccessToken).mockResolvedValue(undefined)

    consoleGroup = vi.spyOn(console, 'group').mockImplementation(() => {})
    consoleGroupEnd = vi.spyOn(console, 'groupEnd').mockImplementation(() => {})
    consoleLog = vi.spyOn(console, 'log').mockImplementation(() => {})

    fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('interroge la liste INBOX avec maxResults=10 et un Bearer token', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({}))

    await fetchRecentInboxMails()

    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith(
      `${LIST_URL}?maxResults=10&labelIds=INBOX`,
      { headers: { Authorization: 'Bearer token-1' } },
    )
  })

  it('interroge la liste SPAM pour fetchRecentSpamMails', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({}))

    await fetchRecentSpamMails()

    expect(fetchMock).toHaveBeenCalledWith(
      `${LIST_URL}?maxResults=10&labelIds=SPAM`,
      { headers: { Authorization: 'Bearer token-1' } },
    )
  })

  it('renvoie une liste vide et l\'adresse du compte quand la boîte est vide', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({ resultSizeEstimate: 0 }))

    const result = await fetchRecentInboxMails()

    expect(result).toEqual({ accountEmail: 'moi@example.com', mails: [] })
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('transmet un compte null quand le profil ne peut pas être lu', async () => {
    vi.mocked(getSignedInEmail).mockResolvedValueOnce(null)
    fetchMock.mockResolvedValueOnce(jsonResponse({}))

    const result = await fetchRecentInboxMails()

    expect(result.accountEmail).toBeNull()
    expect(result.mails).toEqual([])
  })

  it('mappe les champs d\'un mail et ses liens', async () => {
    const html =
      '<p>Bonjour, <a href="https://secure.banque-exemple.fr/connexion">Vérifier mon compte</a></p>'
    fetchMock
      .mockResolvedValueOnce(jsonResponse({ messages: [{ id: 'msg-1', threadId: 'thread-1' }] }))
      .mockResolvedValueOnce(jsonResponse(buildMessage(html)))

    const result = await fetchRecentInboxMails()

    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      `${MESSAGE_URL}?format=full`,
      { headers: { Authorization: 'Bearer token-1' } },
    )

    expect(result.mails).toHaveLength(1)
    const mail = result.mails[0]

    expect(mail.id).toBe('msg-1')
    expect(mail.threadId).toBe('thread-1')
    expect(mail.snippet).toBe('')
    expect(mail.subject).toBe('Message de test')
    expect(mail.date).toBe('Mon, 1 Jun 2026 10:00:00 +0000')
    expect(mail.from).toEqual({
      raw: 'Banque Exemple <alerte@banque-exemple.fr>',
      displayName: 'Banque Exemple',
      emailAddress: 'alerte@banque-exemple.fr',
      domain: 'banque-exemple.fr',
    })
    expect(mail.auth).toEqual(
      expect.objectContaining({ spf: 'pass', dkim: 'pass', dmarc: 'pass' }),
    )
    expect(mail.riskScore).toBe(42)
    expect(mail.riskLevel).toBe('medium')
    expect(mail.triggeredSignals).toEqual([{ signal: 'link', explanation: 'Lien suspect fictif' }])
    expect(mail.links).toEqual([
      { displayHost: null, actualHost: 'secure.banque-exemple.fr' },
    ])
    expect(mail.headers).toEqual(buildMessage(html).payload.headers)
  })

  it('utilise le snippet Gmail quand il est présent', async () => {
    const message = { ...buildMessage('<p>Texte</p>'), snippet: 'Extrait fictif' }
    fetchMock
      .mockResolvedValueOnce(jsonResponse({ messages: [{ id: 'msg-1', threadId: 'thread-1' }] }))
      .mockResolvedValueOnce(jsonResponse(message))

    const result = await fetchRecentInboxMails()

    expect(result.mails[0].snippet).toBe('Extrait fictif')
  })

  it('journalise les mails récupérés dans la console', async () => {
    fetchMock
      .mockResolvedValueOnce(jsonResponse({ messages: [{ id: 'msg-1', threadId: 'thread-1' }] }))
      .mockResolvedValueOnce(jsonResponse(buildMessage('<p>Texte</p>')))

    await fetchRecentInboxMails()

    expect(consoleGroup).toHaveBeenCalledWith(
      '[Confio] 1 mail(s) INBOX — moi@example.com',
    )
    expect(consoleGroupEnd).toHaveBeenCalled()
    expect(consoleLog).toHaveBeenCalledWith('id', 'msg-1')
  })

  describe('gestion du 401', () => {
    it('évince le token, en redemande un et rejoue la requête une fois', async () => {
      vi.mocked(getAccessToken)
        .mockResolvedValueOnce('token-1')
        .mockResolvedValueOnce('token-2')

      fetchMock
        .mockResolvedValueOnce(new Response('Unauthorized', { status: 401 }))
        .mockResolvedValueOnce(jsonResponse({}))

      const result = await fetchRecentInboxMails()

      expect(invalidateAccessToken).toHaveBeenCalledWith('token-1')
      expect(getAccessToken).toHaveBeenNthCalledWith(2, true)
      expect(fetchMock).toHaveBeenNthCalledWith(
        2,
        `${LIST_URL}?maxResults=10&labelIds=INBOX`,
        { headers: { Authorization: 'Bearer token-2' } },
      )
      expect(result.mails).toEqual([])
    })

    it('lève une erreur si le 401 se répète après le nouveau token', async () => {
      vi.mocked(getAccessToken)
        .mockResolvedValueOnce('token-1')
        .mockResolvedValueOnce('token-2')

      fetchMock
        .mockResolvedValueOnce(new Response('Unauthorized', { status: 401 }))
        .mockResolvedValueOnce(new Response('Still unauthorized', { status: 401 }))

      await expect(fetchRecentInboxMails()).rejects.toThrow('Gmail API 401: Still unauthorized')

      expect(fetchMock).toHaveBeenCalledTimes(2)
      expect(invalidateAccessToken).toHaveBeenCalledTimes(1)
      expect(getAccessToken).toHaveBeenCalledTimes(2)
    })
  })

  it('lève une erreur avec le statut et le corps quand la réponse n\'est pas ok', async () => {
    fetchMock.mockResolvedValueOnce(new Response('boom', { status: 500 }))

    await expect(fetchRecentInboxMails()).rejects.toThrow('Gmail API 500: boom')
    expect(invalidateAccessToken).not.toHaveBeenCalled()
  })

  it('utilise le statusText quand le corps d\'erreur est vide', async () => {
    fetchMock.mockResolvedValueOnce(new Response('', { status: 503, statusText: 'Service Unavailable' }))

    await expect(fetchRecentInboxMails()).rejects.toThrow('Gmail API 503: Service Unavailable')
  })

  describe('extraction des hôtes des liens (extractHost)', () => {
    async function linkFor(html: string) {
      fetchMock
        .mockResolvedValueOnce(jsonResponse({ messages: [{ id: 'msg-1', threadId: 'thread-1' }] }))
        .mockResolvedValueOnce(jsonResponse(buildMessage(html)))

      const result = await fetchRecentInboxMails()
      return result.mails[0].links
    }

    it('accepte un lien avec schéma et un texte sans schéma', async () => {
      const links = await linkFor(
        '<a href="https://Secure.Banque-Exemple.fr/x">Banque-Exemple.FR</a>',
      )

      expect(links).toEqual([
        { displayHost: 'banque-exemple.fr', actualHost: 'secure.banque-exemple.fr' },
      ])
    })

    it('accepte un lien sans schéma et en déduit l\'hôte réel', async () => {
      const links = await linkFor('<a href="www.exemple.fr/page">exemple.fr</a>')

      expect(links).toEqual([
        { displayHost: 'exemple.fr', actualHost: 'www.exemple.fr' },
      ])
    })

    it('renvoie null pour un texte invalide comme hôte', async () => {
      const links = await linkFor(
        '<a href="https://secure.banque-exemple.fr/">banque sécurisée</a>',
      )

      expect(links).toEqual([
        { displayHost: null, actualHost: 'secure.banque-exemple.fr' },
      ])
    })

    it('reprend l\'URL comme texte quand le lien n\'a pas de texte visible', async () => {
      const links = await linkFor(
        '<a href="https://secure.banque-exemple.fr/connexion">   </a>',
      )

      expect(links).toEqual([
        { displayHost: 'secure.banque-exemple.fr', actualHost: 'secure.banque-exemple.fr' },
      ])
    })
  })
})
