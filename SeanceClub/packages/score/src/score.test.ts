import { describe, expect, it } from 'vitest';
import { buildInput, computeScore, interpolate, levelFor, shouldShowScore, type FilmFact } from './index';
import { config } from './config';

// Cas de référence de la spécification (liste de 250 films, 60 % = 150 films)
const cases = [
  { name: 'A occasionnel', in: { filmsSeen: 80, genresCovered: 5, erasCovered: 4, regionsCovered: 2, nonEnglishShare: 0.10, refSeen: 20, accessibleRefCount: 250 }, score: 27, level: 'Amateur' },
  { name: 'D blockbusters', in: { filmsSeen: 300, genresCovered: 4, erasCovered: 3, regionsCovered: 1, nonEnglishShare: 0.02, refSeen: 10, accessibleRefCount: 250 }, score: 35, level: 'Amateur' },
  { name: 'B éclectique', in: { filmsSeen: 500, genresCovered: 9, erasCovered: 6, regionsCovered: 4, nonEnglishShare: 0.25, refSeen: 90, accessibleRefCount: 250 }, score: 74, level: 'Cinéphile' },
  { name: 'C grand cinéphile', in: { filmsSeen: 1200, genresCovered: 10, erasCovered: 7, regionsCovered: 5, nonEnglishShare: 0.30, refSeen: 150, accessibleRefCount: 250 }, score: 96, level: 'Encyclopédie' },
];

describe('cas de référence de la spécification', () => {
  for (const c of cases) {
    it(`${c.name} = ${c.score}`, () => {
      const r = computeScore(c.in);
      expect(r.score).toBe(c.score);
      expect(r.level).toBe(c.level);
    });
  }
});

describe('volume', () => {
  it('interpole entre les points', () => {
    expect(interpolate(0, config.volumePoints)).toBe(0);
    expect(interpolate(80, config.volumePoints)).toBeCloseTo(0.2);
    expect(interpolate(300, config.volumePoints)).toBeCloseTo(0.5);
    expect(interpolate(1200, config.volumePoints)).toBeCloseTo(0.92);
    expect(interpolate(5000, config.volumePoints)).toBe(1);
  });
});

describe('niveaux', () => {
  it('respecte les bornes', () => {
    const t: [number, string][] = [[0, 'Curieux'], [24, 'Curieux'], [25, 'Amateur'], [44, 'Amateur'], [45, 'Passionné'], [64, 'Passionné'], [65, 'Cinéphile'], [81, 'Cinéphile'], [82, 'Encyclopédie'], [100, 'Encyclopédie']];
    for (const [s, n] of t) expect(levelFor(s)).toBe(n);
  });
  it('affiche le score à partir de 10 films', () => {
    expect(shouldShowScore(9)).toBe(false);
    expect(shouldShowScore(10)).toBe(true);
  });
});

describe('mineurs : moins de 50 films de référence accessibles', () => {
  it('retire les références et redistribue les poids', () => {
    const r = computeScore({ filmsSeen: 200, genresCovered: 6, erasCovered: 4, regionsCovered: 3, nonEnglishShare: 0.1, refSeen: 5, accessibleRefCount: 40 });
    expect(r.referenceUsed).toBe(false);
    expect(r.reference).toBe(0);
    const expected = Math.round(100 * (0.625 * 0.4 + 0.375 * ((6 / 10 + 4 / 7 + 3 / 5 + 0.4) / 4)));
    expect(r.score).toBe(expected);
  });
});

describe('buildInput', () => {
  const mk = (id: string, o: Partial<FilmFact> = {}): FilmFact => ({ id, year: 2005, runtimeMin: 100, families: ['drame'], region: 'france', language: 'fr', ...o });
  it('exclut les courts métrages et compte les durées inconnues', () => {
    const r = buildInput([mk('a'), mk('b', { runtimeMin: 15 }), mk('c', { runtimeMin: null })], new Set(), 250);
    expect(r.filmsSeen).toBe(2);
  });
  it('exige 3 films par genre, 3 par époque, 2 par région', () => {
    const films = [mk('1'), mk('2'), mk('3', { families: ['horreur'], region: 'monde' }), mk('4', { year: 1950 })];
    const r = buildInput(films, new Set(), 250);
    expect(r.genresCovered).toBe(1);   // drame : 3 films ; horreur : 1
    expect(r.erasCovered).toBe(1);     // 2000s : 3 films ; avant 1960 : 1
    expect(r.regionsCovered).toBe(1);  // france : 3 ; monde : 1
  });
  it('calcule la part de films non anglophones et les références vues', () => {
    const films = [mk('a'), mk('b', { language: 'en' }), mk('c', { language: 'ja' }), mk('d', { language: null })];
    const r = buildInput(films, new Set(['a', 'c']), 250);
    expect(r.nonEnglishShare).toBeCloseTo(2 / 3);
    expect(r.refSeen).toBe(2);
  });
});
