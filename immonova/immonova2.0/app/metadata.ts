import { Metadata } from 'next'

export const defaultMetadata: Metadata = {
  metadataBase: new URL('https://immonova.org'),
  title: {
    default: 'Immonova - Calculettes et guides pour votre projet immobilier',
    template: '%s | Immonova'
  },
  description: 'Simulez gratuitement votre prêt, votre capacité d\'emprunt et la rentabilité d\'un investissement locatif. Guides et actualités pour acheter, investir et vendre en toute sérénité.',
  keywords: ['calculette immobilière', 'capacité d\'emprunt', 'simulation prêt immobilier', 'PTZ', 'investissement locatif', 'achat immobilier', 'primo-accédant'],
  authors: [{ name: 'Immonova' }],
  creator: 'Immonova',
  publisher: 'Immonova',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: 'https://immonova.org',
    siteName: 'Immonova',
    title: 'Immonova - Calculettes et guides pour votre projet immobilier',
    description: 'Simulez gratuitement votre prêt, votre capacité d\'emprunt et la rentabilité d\'un investissement locatif. Guides et actualités pour acheter, investir et vendre en toute sérénité.',
    images: [
      {
        url: '/images/maisons/maison-10.jpg',
        width: 1200,
        height: 630,
        alt: 'Immonova - Calculettes et guides immobiliers',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Immonova - Calculettes et guides pour votre projet immobilier',
    description: 'Simulez gratuitement votre prêt, votre capacité d\'emprunt et la rentabilité d\'un investissement locatif.',
    images: ['/images/maisons/maison-10.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: './',
  },
} 