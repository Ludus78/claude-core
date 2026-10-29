import { Metadata } from 'next';
import AchatClient from '../components/AchatClient';

export const metadata: Metadata = {
  title: 'Acheter un bien immobilier | Immonova - Expert Immobilier Paris',
  description: 'Guide complet pour l\'achat de votre bien immobilier à Paris. Découvrez nos conseils, notre accompagnement personnalisé et nos outils pour faciliter votre projet d\'achat.',
  openGraph: {
    title: 'Acheter un bien immobilier | Immonova',
    description: 'Guide complet pour l\'achat de votre bien immobilier à Paris.',
  },
};

export default function AchatPage() {
  return <AchatClient />;
} 