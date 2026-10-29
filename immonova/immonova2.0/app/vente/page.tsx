import { Metadata } from 'next';
import VenteClient from '../components/VenteClient';

export const metadata: Metadata = {
  title: 'Vendre un bien immobilier | Immonova - Expert Immobilier Paris',
  description: 'Conseils et accompagnement pour vendre votre bien immobilier à Paris. Estimation gratuite, mise en valeur et stratégie de vente optimisée.',
  openGraph: {
    title: 'Vendre un bien immobilier | Immonova',
    description: 'Conseils et accompagnement pour vendre votre bien immobilier à Paris.',
  },
};

export default function VentePage() {
  return <VenteClient />;
} 