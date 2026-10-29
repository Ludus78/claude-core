import { Metadata } from 'next'

export const defaultMetadata: Metadata = {
  metadataBase: new URL('https://immonova.org'),
  title: {
    default: 'Immonova - Votre Expert Immobilier à Paris',
    template: '%s | Immonova'
  },
  description: 'Immonova, votre expert immobilier à Paris. Estimation gratuite, accompagnement personnalisé pour l\'achat et la vente de biens immobiliers.',
  keywords: ['immobilier', 'Paris', 'expert immobilier', 'estimation', 'achat', 'vente', 'investissement immobilier'],
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
    title: 'Immonova - Votre Expert Immobilier à Paris',
    description: 'Immonova, votre expert immobilier à Paris. Estimation gratuite, accompagnement personnalisé pour l\'achat et la vente de biens immobiliers.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Immonova - Expert Immobilier Paris',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Immonova - Votre Expert Immobilier à Paris',
    description: 'Immonova, votre expert immobilier à Paris. Estimation gratuite, accompagnement personnalisé pour l\'achat et la vente de biens immobiliers.',
    images: ['/twitter-image.jpg'],
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
    canonical: 'https://immonova.org',
  },
} 