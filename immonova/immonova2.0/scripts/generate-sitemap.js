const { generateSitemap } = require('next-sitemap/dist/cjs/generator')

const config = {
  siteUrl: process.env.SITE_URL || 'https://immonova.org',
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  changefreq: 'daily',
  priority: 0.7,
  sitemapSize: 7000,
  exclude: ['/api/*', '/dashboard/*', '/auth/*'],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/*', '/dashboard/*', '/auth/*'],
      },
    ],
    additionalSitemaps: [
      `${process.env.SITE_URL || 'https://immonova.org'}/sitemap.xml`,
    ],
  },
}

async function generate() {
  try {
    await generateSitemap(config)
    console.log('Sitemap generated successfully')
  } catch (error) {
    console.error('Error generating sitemap:', error)
    process.exit(1)
  }
}

generate() 