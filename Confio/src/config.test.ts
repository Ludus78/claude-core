import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const ENV_KEY = 'VITE_GOOGLE_OAUTH_CLIENT_ID'

async function loadIsConfigured(value: string | undefined): Promise<boolean> {
  vi.resetModules()
  if (value === undefined) {
    delete process.env[ENV_KEY]
  } else {
    vi.stubEnv(ENV_KEY, value)
  }
  const { isOAuthClientConfigured } = await import('./config')
  return isOAuthClientConfigured()
}

describe('isOAuthClientConfigured', () => {
  beforeEach(() => {
    delete process.env[ENV_KEY]
  })

  afterEach(() => {
    vi.unstubAllEnvs()
    delete process.env[ENV_KEY]
    vi.resetModules()
  })

  it('renvoie false quand la variable est absente', async () => {
    expect(await loadIsConfigured(undefined)).toBe(false)
  })

  it('renvoie false quand la variable est vide', async () => {
    expect(await loadIsConfigured('')).toBe(false)
  })

  it('renvoie false quand la variable ne contient que des espaces', async () => {
    expect(await loadIsConfigured('   ')).toBe(false)
  })

  it('renvoie false pour la valeur factice du placeholder', async () => {
    expect(await loadIsConfigured('YOUR_CLIENT_ID.apps.googleusercontent.com')).toBe(false)
  })

  it('renvoie false quand la valeur ne contient pas .apps.googleusercontent.com', async () => {
    expect(await loadIsConfigured('123-abc.example.com')).toBe(false)
  })

  it('renvoie true pour un identifiant client valide', async () => {
    expect(await loadIsConfigured('123-abc.apps.googleusercontent.com')).toBe(true)
  })

  it('ignore les espaces autour d\'un identifiant valide', async () => {
    expect(await loadIsConfigured('  123-abc.apps.googleusercontent.com  ')).toBe(true)
  })
})
