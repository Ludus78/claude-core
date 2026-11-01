// Photos du bandeau d'accueil : une est tirée au hasard à chaque visite.
// Format 1800 x 420 pixels (la maison doit tenir dans une bande large et basse), moins de 150 Ko, dans public/images/maisons/.
// `credit` : auteur et source, affiché en petit dans un coin du bandeau si renseigné.
// Photos Unsplash : licence Unsplash, usage libre sans attribution obligatoire (à vérifier à la source : unsplash.com/license).

export type Maison = { src: string; alt: string; credit?: string };

export const MAISONS: Maison[] = [
  { src: '/images/maisons/maison-01.jpg', alt: 'Grande demeure en pierre éclairée au crépuscule', credit: 'Photo : Daniel Barnes, Unsplash' },
  { src: '/images/maisons/maison-02.jpg', alt: 'Villa de style espagnol et sa piscine de nuit', credit: 'Photo : Vita Vilcina, Unsplash' },
  { src: '/images/maisons/maison-03.jpg', alt: 'Demeure néoclassique aux hautes fenêtres', credit: 'Photo : Nick Romanov, Unsplash' },
  { src: '/images/maisons/maison-04.jpg', alt: 'Grande maison entourée de jardins fleuris', credit: 'Photo : Laurel and Michael Evans, Unsplash' },
  { src: '/images/maisons/maison-05.jpg', alt: 'Belle maison moderne avec jardin au crépuscule' },
  { src: '/images/maisons/maison-06.jpg', alt: 'Château blanc et ses jardins', credit: 'Photo : Shaun Rainer, Unsplash' },
  { src: '/images/maisons/maison-07.jpg', alt: 'Château blanc aux tourelles', credit: 'Photo : Dorian Mongel, Unsplash' },
  { src: '/images/maisons/maison-08.jpg', alt: 'Château et son parc', credit: 'Photo : Leonis Caeli, Unsplash' },
  { src: '/images/maisons/maison-09.jpg', alt: 'Château de la Loire, vue d\'ensemble', credit: 'Photo : Dorian Mongel, Unsplash' },
  { src: '/images/maisons/maison-10.jpg', alt: 'Château et ses jardins à la française', credit: 'Photo : Maxwell Andrews, Unsplash' },
];
