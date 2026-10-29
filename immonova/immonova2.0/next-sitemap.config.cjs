/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://immonova.org',
  generateRobotsTxt: true,
  exclude: ['/api/*', '/dashboard/*', '/auth/*'],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/*', '/dashboard/*', '/auth/*'],
      },
    ],
  },
  transform: async (config, path) => {
    // Utiliser la date d'aujourd'hui
    const today = new Date()
    return {
      loc: path,
      changefreq: 'daily',
      priority: 0.7,
      lastmod: today.toISOString().split('T')[0], // Format YYYY-MM-DD
    }
  },
} 