// Photos de l'accueil : une est tirée au hasard à chaque visite.
// Chaque photo montre la maison en entier. Format 1200 x 675 pixels, moins de 150 Ko, dans public/images/maisons/.
// `credit` : auteur et source, affiché en petit sous la photo si renseigné.
// Photos Unsplash : licence Unsplash, usage libre sans attribution obligatoire (à vérifier à la source : unsplash.com/license).

export type Maison = { src: string; alt: string; credit?: string };

export const MAISONS: Maison[] = [
  { src: '/images/maisons/maison-01.jpg', alt: 'Grande demeure en pierre éclairée au crépuscule', credit: 'Photo : Daniel Barnes, Unsplash' },
  { src: '/images/maisons/maison-02.jpg', alt: 'Villa moderne blanche avec terrasse en bois et piscine', credit: 'Photo : Avi Werde, Unsplash' },
  { src: '/images/maisons/maison-03.jpg', alt: 'Villa contemporaine vitrée au coucher du soleil', credit: 'Photo : Michael Brown, Unsplash' },
  { src: '/images/maisons/maison-04.jpg', alt: "Maison de maître blanche au bord d'un étang", credit: 'Photo : avechenri, Unsplash' },
  { src: '/images/maisons/maison-05.jpg', alt: 'Grand manoir en brique et sa pelouse', credit: 'Photo : Jone Madsen, Unsplash' },
  { src: '/images/maisons/maison-06.jpg', alt: 'Villa moderne blanche avec piscine sous un ciel bleu', credit: 'Photo : Frames For Your Heart, Unsplash' },
  { src: '/images/maisons/maison-07.jpg', alt: 'Villa de style espagnol et sa piscine de nuit', credit: 'Photo : Vita Vilcina, Unsplash' },
  { src: '/images/maisons/maison-08.jpg', alt: 'Demeure néoclassique et son bassin', credit: 'Photo : Nick Romanov, Unsplash' },
  { src: '/images/maisons/maison-09.jpg', alt: 'Grande maison entourée de jardins fleuris', credit: 'Photo : Laurel and Michael Evans, Unsplash' },
  { src: '/images/maisons/maison-10.jpg', alt: 'Belle maison moderne avec jardin au crépuscule' },
];
