import { describe, expect, it } from 'vitest'

import type { ParsedEmail } from '../types'
import { WEIGHTS } from '../types'
import { checkAuthFailure } from './auth'

type AuthResult = ParsedEmail['spfResult']

const mail = (spfResult: AuthResult, dkimResult: AuthResult): Partial<ParsedEmail> => ({
  senderEmail: 'expediteur@example.fr',
  spfResult,
  dkimResult,
})

describe('checkAuthFailure', () => {
  it('ne déclenche rien sans email (null ou undefined)', () => {
    expect(checkAuthFailure(null)).toMatchObject({ weight: 0, triggered: false })
    expect(checkAuthFailure(undefined)).toMatchObject({ weight: 0, triggered: false })
  })

  it('déclenche un échec fort quand SPF échoue', () => {
    const result = checkAuthFailure(mail('fail', 'pass'))

    expect(result.triggered).toBe(true)
    expect(result.weight).toBe(WEIGHTS.AUTH_FAIL)
  })

  it('déclenche un échec fort quand DKIM échoue', () => {
    const result = checkAuthFailure(mail('pass', 'fail'))

    expect(result.triggered).toBe(true)
    expect(result.weight).toBe(WEIGHTS.AUTH_FAIL)
  })

  it('déclenche la pénalité AUTH_NONE quand SPF et DKIM valent none', () => {
    const result = checkAuthFailure(mail('none', 'none'))

    expect(result.triggered).toBe(true)
    expect(result.weight).toBe(WEIGHTS.AUTH_NONE)
  })

  it('ignore la casse et les espaces autour du résultat', () => {
    const failResult = checkAuthFailure(mail(' FAIL ' as AuthResult, 'pass'))
    const noneResult = checkAuthFailure(mail(' NONE ' as AuthResult, '  None' as AuthResult))

    expect(failResult.weight).toBe(WEIGHTS.AUTH_FAIL)
    expect(noneResult.weight).toBe(WEIGHTS.AUTH_NONE)
  })

  it('ne déclenche rien quand SPF et DKIM passent', () => {
    const result = checkAuthFailure(mail('pass', 'pass'))

    expect(result.triggered).toBe(false)
    expect(result.weight).toBe(0)
  })

  it('ne déclenche pas la pénalité none avec un seul résultat none', () => {
    expect(checkAuthFailure(mail('none', 'pass')).triggered).toBe(false)
    expect(checkAuthFailure(mail('pass', 'none')).triggered).toBe(false)
  })

  it('privilégie l\'échec fort sur la pénalité none', () => {
    const result = checkAuthFailure(mail('fail', 'none'))

    expect(result.weight).toBe(WEIGHTS.AUTH_FAIL)
    expect(result.signal).toBe('Échec d\'authentification')
  })

  it('traite les champs absents comme non déclenché', () => {
    expect(checkAuthFailure({ senderEmail: 'expediteur@example.fr' })).toMatchObject({
      weight: 0,
      triggered: false,
    })
    expect(checkAuthFailure({})).toMatchObject({ weight: 0, triggered: false })
  })
})
