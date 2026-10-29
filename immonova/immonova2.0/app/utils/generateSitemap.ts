import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://immonova.fr'
  
  const routes = [
    '',
    '/achat',
    '/vente',
    '/estimation',
    '/contact',
    '/qui-suis-je',
    '/actualites',
    '/calculette',
    '/calculette-viager',
    '/calculette-locative',
    '/frais-annexes',
    '/mise-en-valeur',
    '/documents',
    '/diagnostics',
  ]

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: route === '' ? 1 : 0.8,
  }))
} 