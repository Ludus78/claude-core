// Constantes de la formule v1 (voir la spécification du score cinéphile).
// Toute modification doit incrémenter `version` et déclencher un recalcul des membres.
export const config = {
  version: 1,
  // [films vus, volume] : interpolation linéaire entre les points
  volumePoints: [[0, 0], [50, 0.15], [200, 0.4], [500, 0.7], [1000, 0.9], [2000, 1]] as [number, number][],
  weights: { volume: 0.5, diversity: 0.3, reference: 0.2 },
  // Utilisé quand moins de `reference.minAccessible` films de la liste sont accessibles (mineurs)
  weightsWithoutRef: { volume: 0.625, diversity: 0.375, reference: 0 },
  diversity: {
    genres: 10, eras: 7, regions: 5,
    minPerGenre: 3, minPerEra: 3, minPerRegion: 2,
    nonEnglishFullAt: 0.25,
  },
  reference: { fullAt: 0.6, minAccessible: 50 },
  levels: [
    { name: 'Curieux', min: 0 },
    { name: 'Amateur', min: 25 },
    { name: 'Passionné', min: 45 },
    { name: 'Cinéphile', min: 65 },
    { name: 'Encyclopédie', min: 82 },
  ],
  minRuntimeMin: 40,     // un film compte à partir de 40 minutes (durée inconnue : il compte)
  minFilmsToShow: 10,    // le score s'affiche à partir de 10 films
};
export type Config = typeof config;
