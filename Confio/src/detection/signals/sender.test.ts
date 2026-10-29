import { describe, expect, it } from 'vitest'

import type { ParsedEmail } from '../types'
import { WEIGHTS } from '../types'
import { checkSenderMismatch } from './sender'

const mail = (senderDisplayName: string, senderEmail: string): Partial<ParsedEmail> => ({
  senderDisplayName,
  senderEmail,
})

describe('checkSenderMismatch', () => {
  it('ne déclenche rien sans email (null ou undefined)', () => {
    expect(checkSenderMismatch(null)).toMatchObject({ weight: 0, triggered: false })
    expect(checkSenderMismatch(undefined)).toMatchObject({ weight: 0, triggered: false })
  })

  it('ne déclenche rien quand le nom d\'affichage ou l\'adresse est vide', () => {
    expect(checkSenderMismatch(mail('', 'support@paypal.com'))).toMatchObject({
      weight: 0,
      triggered: false,
    })
    expect(checkSenderMismatch(mail('PayPal', ''))).toMatchObject({
      weight: 0,
      triggered: false,
    })
    expect(checkSenderMismatch(mail('   ', '   '))).toMatchObject({
      weight: 0,
      triggered: false,
    })
  })

  it('ne déclenche rien pour une marque inconnue', () => {
    const result = checkSenderMismatch(mail('Boulangerie Martin', 'contact@boulangerie-martin.fr'))

    expect(result.triggered).toBe(false)
    expect(result.weight).toBe(0)
    expect(result.explanation).toBe('')
  })

  it('ne déclenche rien quand la marque connue vient de son domaine officiel', () => {
    const result = checkSenderMismatch(mail('PayPal', 'service@paypal.com'))

    expect(result.triggered).toBe(false)
    expect(result.weight).toBe(0)
  })

  it('accepte un sous-domaine du domaine officiel', () => {
    const result = checkSenderMismatch(mail('PayPal', 'notifications@service.paypal.com'))

    expect(result.triggered).toBe(false)
    expect(result.weight).toBe(0)
  })

  it('déclenche le signal quand la marque vient d\'un autre domaine', () => {
    const result = checkSenderMismatch(mail('PayPal', 'support@paypal-verif.ru'))

    expect(result.triggered).toBe(true)
    expect(result.weight).toBe(WEIGHTS.SENDER_MISMATCH)
    expect(result.explanation).toContain('PayPal')
  })

  it('ignore la casse et les accents du nom d\'affichage', () => {
    const impots = checkSenderMismatch(mail('IMPOTS', 'dgfip@mail-suspect.com'))
    const socgen = checkSenderMismatch(mail('Société Générale', 'alerte@mail-suspect.com'))

    expect(impots.triggered).toBe(true)
    expect(impots.weight).toBe(WEIGHTS.SENDER_MISMATCH)
    expect(socgen.triggered).toBe(true)
    expect(socgen.weight).toBe(WEIGHTS.SENDER_MISMATCH)
  })

  it('reconnaît la marque sans accents ni casse : domaine officiel accepté, autre domaine signalé', () => {
    expect(checkSenderMismatch(mail('SOCIETE GENERALE', 'contact@societegenerale.fr')).triggered).toBe(false)
    expect(checkSenderMismatch(mail('SOCIETE GENERALE', 'contact@mail-suspect.com')).triggered).toBe(true)
  })

  it('accepte le domaine officiel écrit en majuscules', () => {
    const result = checkSenderMismatch(mail('PayPal', 'SERVICE@PAYPAL.COM'))

    expect(result.triggered).toBe(false)
    expect(result.weight).toBe(0)
  })

  it('déclenche sur un domaine qui se termine par le nom officiel sans point', () => {
    const result = checkSenderMismatch(mail('PayPal', 'support@evilpaypal.com'))

    expect(result.triggered).toBe(true)
    expect(result.weight).toBe(WEIGHTS.SENDER_MISMATCH)
  })

  it('déclenche sur un domaine piège qui commence par le domaine officiel', () => {
    const result = checkSenderMismatch(mail('PayPal', 'security@paypal.com.evil.fr'))

    expect(result.triggered).toBe(true)
    expect(result.weight).toBe(WEIGHTS.SENDER_MISMATCH)
  })

  it('déclenche sur un domaine qui contient le nom de la marque', () => {
    const result = checkSenderMismatch(mail('PayPal', 'support@paypal-secure.com'))

    expect(result.triggered).toBe(true)
    expect(result.weight).toBe(WEIGHTS.SENDER_MISMATCH)
  })

  it('accepte chacun des domaines officiels d\'une marque qui en a plusieurs', () => {
    expect(checkSenderMismatch(mail('Amazon', 'auto-confirm@amazon.fr')).triggered).toBe(false)
    expect(checkSenderMismatch(mail('Amazon', 'auto-confirm@amazon.com')).triggered).toBe(false)
  })
})
