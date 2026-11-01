// Photos de la bannière d'accueil : une est tirée au hasard à chaque visite.
// Pour en ajouter, déposer l'image (environ 1920 x 900 pixels) dans public/images/maisons/ puis l'ajouter à la liste.
// `credit` : auteur et source, affiché en petit sous la bannière si renseigné.
// Photos Unsplash : licence Unsplash, usage libre sans attribution obligatoire (à vérifier à la source : unsplash.com/license).

export type Maison = { src: string; alt: string; credit?: string };

export const MAISONS: Maison[] = [
  { src: '/images/hero-real-estate.jpg', alt: 'Belle maison moderne avec jardin' },
  { src: '/images/maisons/maison-01.jpg', alt: 'Grande demeure en pierre éclairée au crépuscule', credit: 'Photo : Daniel Barnes, Unsplash' },
  { src: '/images/maisons/maison-02.jpg', alt: 'Villa moderne blanche avec piscine', credit: 'Photo : Avi Werde, Unsplash' },
  { src: '/images/maisons/maison-03.jpg', alt: 'Villa contemporaine vitrée au coucher du soleil', credit: 'Photo : Michael Brown, Unsplash' },
  { src: '/images/maisons/maison-04.jpg', alt: 'Villa à toit de tuiles et palmiers', credit: 'Photo : James Day, Unsplash' },
  { src: '/images/maisons/maison-05.jpg', alt: 'Maison sur une colline entourée de pins', credit: 'Photo : Jack Harbieh, Unsplash' },
  { src: '/images/maisons/maison-06.jpg', alt: 'Maison blanche à toit rouge dans un jardin', credit: 'Photo : Noita Digital, Unsplash' },
  { src: '/images/maisons/maison-07.jpg', alt: 'Maison de maître blanche au bord d\'un étang', credit: 'Photo : avechenri, Unsplash' },
  { src: '/images/maisons/maison-08.jpg', alt: 'Manoir en pierre ancien', credit: 'Photo : T, Unsplash' },
  { src: '/images/maisons/maison-09.jpg', alt: 'Maison blanche dans une prairie', credit: 'Photo : Clay Banks, Unsplash' },
  { src: '/images/maisons/maison-10.jpg', alt: 'Grand manoir en brique et sa pelouse', credit: 'Photo : Jone Madsen, Unsplash' },
];
