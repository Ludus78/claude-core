import { describe, expect, it } from 'vitest'

import { decodeMimeHeader, extractAuthSignals, getHeader, parseFromHeader } from './headers'
import type { GmailHeader } from './types'

describe('getHeader', () => {
  const headers: GmailHeader[] = [
    { name: 'From', value: 'Jean <jean@example.fr>' },
    { name: 'Subject', value: 'Bonjour' },
  ]

  it('retrouve un en-tête sans tenir compte de la casse du nom', () => {
    expect(getHeader(headers, 'from')).toBe('Jean <jean@example.fr>')
    expect(getHeader(headers, 'SUBJECT')).toBe('Bonjour')
  })

  it('renvoie null quand l\'en-tête est absent', () => {
    expect(getHeader(headers, 'Reply-To')).toBeNull()
  })

  it('renvoie null quand la liste est vide', () => {
    expect(getHeader([], 'From')).toBeNull()
  })
})

describe('parseFromHeader', () => {
  it('renvoie des champs à null pour une valeur absente ou vide', () => {
    const empty = { raw: null, displayName: null, emailAddress: null, domain: null }

    expect(parseFromHeader(null)).toEqual(empty)
    expect(parseFromHeader('')).toEqual(empty)
  })

  it('sépare le nom et l\'adresse de la forme "Nom <a@b.fr>"', () => {
    expect(parseFromHeader('Nom <a@b.fr>')).toEqual({
      raw: 'Nom <a@b.fr>',
      displayName: 'Nom',
      emailAddress: 'a@b.fr',
      domain: 'b.fr',
    })
  })

  it('retire les guillemets autour du nom', () => {
    const parsed = parseFromHeader('"Jean Dupont" <jean@exemple.fr>')

    expect(parsed.displayName).toBe('Jean Dupont')
    expect(parsed.emailAddress).toBe('jean@exemple.fr')
    expect(parsed.domain).toBe('exemple.fr')
  })

  it('accepte une adresse seule, sans nom', () => {
    expect(parseFromHeader('a@b.fr')).toEqual({
      raw: 'a@b.fr',
      displayName: null,
      emailAddress: 'a@b.fr',
      domain: 'b.fr',
    })
  })

  it('retire le préfixe mailto: de l\'adresse', () => {
    expect(parseFromHeader('mailto:a@b.fr').emailAddress).toBe('a@b.fr')
    expect(parseFromHeader('<mailto:a@b.fr>').emailAddress).toBe('a@b.fr')
  })

  it('met le domaine en minuscules', () => {
    const parsed = parseFromHeader('Jean <Jean@EXEMPLE.FR>')

    expect(parsed.domain).toBe('exemple.fr')
  })

  it('décode un nom encodé en MIME base64', () => {
    const parsed = parseFromHeader('=?UTF-8?B?Q2zDqW1lbnQ=?= <c@d.fr>')

    expect(parsed.displayName).toBe('Clément')
    expect(parsed.raw).toBe('Clément <c@d.fr>')
    expect(parsed.emailAddress).toBe('c@d.fr')
  })

  it('décode un nom encodé en MIME quoted-printable avec des underscores', () => {
    const parsed = parseFromHeader('=?UTF-8?Q?Service_client_=21?= <contact@d.fr>')

    expect(parsed.displayName).toBe('Service client !')
    expect(parsed.domain).toBe('d.fr')
  })
})

describe('extractAuthSignals', () => {
  const authHeader = (value: string): GmailHeader[] => [{ name: 'Authentication-Results', value }]

  it('renvoie none pour SPF, DKIM et DMARC quand les en-têtes sont absents', () => {
    expect(extractAuthSignals([])).toEqual({
      spf: 'none',
      dkim: 'none',
      dmarc: 'none',
      authenticationResults: null,
      receivedSpf: null,
    })
  })

  it('lit pass, fail, neutral et none dans Authentication-Results', () => {
    const signals = extractAuthSignals(
      authHeader('mx.google.com; spf=pass smtp.mailfrom=a@b.fr; dkim=fail header.i=@b.fr; dmarc=neutral'),
    )

    expect(signals.spf).toBe('pass')
    expect(signals.dkim).toBe('fail')
    expect(signals.dmarc).toBe('neutral')
  })

  it('traite softfail, temperror et permerror comme fail', () => {
    expect(extractAuthSignals(authHeader('spf=softfail')).spf).toBe('fail')
    expect(extractAuthSignals(authHeader('spf=temperror')).spf).toBe('fail')
    expect(extractAuthSignals(authHeader('spf=permerror')).spf).toBe('fail')
  })

  it('renvoie none quand le mécanisme est explicitement none', () => {
    expect(extractAuthSignals(authHeader('dkim=none')).dkim).toBe('none')
  })

  it('renvoie unknown pour une valeur inconnue', () => {
    expect(extractAuthSignals(authHeader('spf=bizarre')).spf).toBe('unknown')
  })

  it('lit le résultat dans Received-SPF au format "spf=pass"', () => {
    const signals = extractAuthSignals([{ name: 'Received-SPF', value: 'spf=pass smtp.mailfrom=a@b.fr' }])

    expect(signals.spf).toBe('pass')
    expect(signals.receivedSpf).toBe('spf=pass smtp.mailfrom=a@b.fr')
  })

  it('lit un échec dans Received-SPF au format standard "fail (...)"', () => {
    const signals = extractAuthSignals([
      { name: 'Received-SPF', value: 'fail (google.com: domain of a@b.fr does not designate 1.2.3.4 as permitted sender)' },
    ])

    expect(signals.spf).toBe('fail')
  })

  it('lit le résultat dans Received-SPF au format standard "pass (...)"', () => {
    const signals = extractAuthSignals([
      {
        name: 'Received-SPF',
        value:
          'pass (google.com: domain of expediteur@example.fr designates 203.0.113.5 as permitted sender) client-ip=203.0.113.5;',
      },
    ])

    expect(signals.spf).toBe('pass')
  })

  it('retrouve Authentication-Results quel que soit la casse du nom d\'en-tête', () => {
    const signals = extractAuthSignals([{ name: 'authentication-results', value: 'dmarc=pass' }])

    expect(signals.dmarc).toBe('pass')
    expect(signals.authenticationResults).toBe('dmarc=pass')
  })

  it('combine plusieurs en-têtes et garde le premier résultat trouvé', () => {
    const signals = extractAuthSignals([
      { name: 'Authentication-Results', value: 'spf=pass' },
      { name: 'Received-SPF', value: 'spf=fail' },
    ])

    expect(signals.spf).toBe('pass')
  })
})

describe('decodeMimeHeader', () => {
  it('décode un mot encodé en base64 (B)', () => {
    expect(decodeMimeHeader('=?UTF-8?B?Q2zDqW1lbnQ=?=')).toBe('Clément')
  })

  it('accepte l\'encodage B en minuscules et un charset en minuscules', () => {
    expect(decodeMimeHeader('=?utf-8?b?Q2zDqW1lbnQ=?=')).toBe('Clément')
  })

  it('décode un mot encodé Q avec des _ et des =XX ASCII', () => {
    expect(decodeMimeHeader('=?UTF-8?Q?Bonjour_tout_le_monde=21?=')).toBe('Bonjour tout le monde!')
  })

  it('décode correctement une séquence UTF-8 multi-octets en Q', () => {
    expect(decodeMimeHeader('=?UTF-8?Q?Caf=C3=A9?=')).toBe('Café')
  })

  it('décode un mot Q dans un autre charset (ISO-8859-1)', () => {
    expect(decodeMimeHeader('=?ISO-8859-1?Q?Caf=E9?=')).toBe('Café')
  })

  it('se replie sur UTF-8 pour un charset inconnu', () => {
    expect(decodeMimeHeader('=?inconnu?Q?Caf=C3=A9?=')).toBe('Café')
  })

  it('renvoie le texte sans encodage tel quel', () => {
    expect(decodeMimeHeader('Bonjour à tous')).toBe('Bonjour à tous')
  })

  it('décode un mot encodé au milieu d\'un texte brut', () => {
    expect(decodeMimeHeader('Re: =?UTF-8?Q?Facture?= du mois')).toBe('Re: Facture du mois')
  })
})
