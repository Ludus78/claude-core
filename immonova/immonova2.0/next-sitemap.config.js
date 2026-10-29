/** @type {import('next-sitemap').IConfig} */
const config = {
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
}

export default config
  