// Photos de la bannière d'accueil : une est tirée au hasard à chaque visite.
// Pour en ajouter, déposer l'image dans public/images/maisons/ et l'ajouter à la liste.
// `credit` : auteur et source de la photo, affiché en petit sous la bannière si renseigné.

export type Maison = { src: string; alt: string; credit?: string };

export const MAISONS: Maison[] = [
  { src: '/images/hero-real-estate.jpg', alt: 'Belle maison moderne avec jardin' },
];
