import { describe, expect, it } from 'vitest'

import type { ParsedEmail } from '../types'
import { WEIGHTS } from '../types'
import { checkUrgencyKeywords } from './urgency'

const mail = (subject: string, bodyText = ''): Partial<ParsedEmail> => ({
  senderEmail: 'expediteur@example.fr',
  subject,
  bodyText,
})

describe('checkUrgencyKeywords', () => {
  it('ne déclenche rien sans email (null ou undefined)', () => {
    expect(checkUrgencyKeywords(null)).toMatchObject({ weight: 0, triggered: false, explanation: '' })
    expect(checkUrgencyKeywords(undefined)).toMatchObject({ weight: 0, triggered: false, explanation: '' })
  })

  it('ne déclenche rien quand sujet et corps sont absents ou vides', () => {
    expect(checkUrgencyKeywords({})).toMatchObject({ weight: 0, triggered: false })
    expect(checkUrgencyKeywords(mail(''))).toMatchObject({ weight: 0, triggered: false })
    expect(checkUrgencyKeywords(mail('', ''))).toMatchObject({ weight: 0, triggered: false })
  })

  it('ne déclenche rien sur un texte neutre', () => {
    const result = checkUrgencyKeywords(
      mail('Réunion de projet', 'Voici le compte rendu de la semaine, merci.'),
    )

    expect(result.triggered).toBe(false)
    expect(result.weight).toBe(0)
    expect(result.explanation).toBe('')
  })

  it('déclenche sur un mot-clé dans le sujet', () => {
    const result = checkUrgencyKeywords(mail('Votre compte suspendu'))

    expect(result.triggered).toBe(true)
    expect(result.weight).toBe(WEIGHTS.URGENCY)
    expect(result.explanation).not.toBe('')
  })

  it('déclenche sur un mot-clé dans le corps', () => {
    const result = checkUrgencyKeywords(mail('Information', 'Votre compte bloqué depuis hier.'))

    expect(result.triggered).toBe(true)
    expect(result.weight).toBe(WEIGHTS.URGENCY)
  })

  it('additionne les motifs trouvés dans le sujet et dans le corps', () => {
    const result = checkUrgencyKeywords(mail('Urgence', 'Votre compte suspendu.'))

    expect(result.weight).toBe(2 * WEIGHTS.URGENCY)
  })

  it('ignore la casse', () => {
    expect(checkUrgencyKeywords(mail('COMPTE SUSPENDU'))).toMatchObject({
      triggered: true,
      weight: WEIGHTS.URGENCY,
    })
    expect(checkUrgencyKeywords(mail('URGENCE'))).toMatchObject({
      triggered: true,
      weight: WEIGHTS.URGENCY,
    })
  })

  it('ignore les accents', () => {
    expect(checkUrgencyKeywords(mail('Accès bloqué'))).toMatchObject({
      triggered: true,
      weight: WEIGHTS.URGENCY,
    })
    expect(checkUrgencyKeywords(mail('Confirmez votre identité'))).toMatchObject({
      triggered: true,
      weight: WEIGHTS.URGENCY,
    })
    // Comportement actuel : 4 motifs se chevauchent ici, donc le poids atteint le plafond (voir le test sur le double comptage).
    expect(checkUrgencyKeywords(mail('', 'Vérifiez immédiatement'))).toMatchObject({
      triggered: true,
      weight: WEIGHTS.URGENCY_CAP,
    })
  })

  it('compte deux fois « immédiatement » : motif accentué et motif sans accent se normalisent pareil', () => {
    // Les motifs 'immédiatement' et 'immediatement' correspondent tous deux au même texte après normalisation.
    // Comportement actuel : un seul mot vaut 2 motifs, soit 2 * URGENCY. Défaut connu de urgency.ts : si les motifs sont
    // dédoublonnés un jour, ce test devra attendre 1 * URGENCY.
    expect(checkUrgencyKeywords(mail('', 'Répondez immédiatement.')).weight).toBe(2 * WEIGHTS.URGENCY)
  })

  it('plafonne le poids à URGENCY_CAP quand beaucoup de mots-clés sont présents', () => {
    const result = checkUrgencyKeywords(
      mail(
        'Urgence',
        'Dernier délai. Dernière chance. Compte suspendu. Compte bloqué. Accès bloqué.',
      ),
    )

    expect(result.triggered).toBe(true)
    expect(result.weight).toBe(WEIGHTS.URGENCY_CAP)
  })

  it('donne un poids égal à nb de motifs * URGENCY en dessous du plafond', () => {
    expect(checkUrgencyKeywords(mail('Urgence')).weight).toBe(1 * WEIGHTS.URGENCY)
    expect(checkUrgencyKeywords(mail('Urgence')).weight).toBeLessThan(WEIGHTS.URGENCY_CAP)
  })
})
