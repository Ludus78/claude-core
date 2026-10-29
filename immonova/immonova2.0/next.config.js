/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    turbo: {},
  },
  pageExtensions: ['js', 'jsx', 'ts', 'tsx'],
  // Utiliser index.tsx comme page principale au lieu de page.tsx
  trailingSlash: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  env: {
    // Configurer dynamiquement les URLs Kinde pour résoudre les problèmes de State
    KINDE_SITE_URL: process.env.KINDE_SITE_URL || 'http://localhost:3000',
    KINDE_CLIENT_ID: process.env.KINDE_CLIENT_ID || process.env.NEXT_PUBLIC_KINDE_CLIENT_ID,
    KINDE_ISSUER_URL: process.env.KINDE_ISSUER_URL || process.env.NEXT_PUBLIC_KINDE_AUTH_URL,
    KINDE_REDIRECT_URL: process.env.KINDE_REDIRECT_URL || process.env.NEXT_PUBLIC_KINDE_REDIRECT_URL,
    KINDE_POST_LOGOUT_REDIRECT_URL: process.env.KINDE_POST_LOGOUT_REDIRECT_URL || 'http://localhost:3000',
    KINDE_POST_LOGIN_REDIRECT_URL: process.env.KINDE_POST_LOGIN_REDIRECT_URL || 'http://localhost:3000/dashboard',
    // Désactiver la vérification d'état pour résoudre l'erreur "State not found"
    KINDE_DISABLE_STATE_PARAM: 'true'
  },
  async rewrites() {
    return [
      {
        source: '/ingest/static/:path*',
        destination: 'https://eu-assets.i.posthog.com/static/:path*',
      },
      {
        source: '/ingest/:path*',
        destination: 'https://eu.i.posthog.com/:path*',
      },
      {
        source: '/ingest/decide',
        destination: 'https://eu.i.posthog.com/decide',
      },
    ];
  },
  skipTrailingSlashRedirect: true,
  // Configuration pour servir les fichiers statiques
  async headers() {
    return [
      {
        source: '/sitemap.xml',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/xml',
          },
        ],
      },
      {
        source: '/robots.txt',
        headers: [
          {
            key: 'Content-Type',
            value: 'text/plain',
          },
        ],
      },
    ];
  },
}

export default nextConfig
