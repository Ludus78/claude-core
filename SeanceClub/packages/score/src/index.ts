import { config as defaultConfig, type Config } from './config';

export type ScoreInput = {
  filmsSeen: number;
  genresCovered: number;       // familles de genres avec >= minPerGenre films
  erasCovered: number;         // époques avec >= minPerEra films
  regionsCovered: number;      // régions avec >= minPerRegion films
  nonEnglishShare: number;     // 0..1, part de films en langue originale non anglophone
  refSeen: number;             // films de la liste de référence vus
  accessibleRefCount: number;  // films de la liste accessibles à l'âge du membre
};

export type ScoreResult = {
  score: number;               // 0..100
  level: string;
  volume: number;              // 0..1
  diversity: number;           // 0..1
  reference: number;           // 0..1 (0 si non utilisée)
  referenceUsed: boolean;
};

export function interpolate(x: number, pts: [number, number][]): number {
  if (x <= pts[0][0]) return pts[0][1];
  for (let i = 1; i < pts.length; i++) {
    const [x1, y1] = pts[i];
    if (x <= x1) {
      const [x0, y0] = pts[i - 1];
      return y0 + ((x - x0) / (x1 - x0)) * (y1 - y0);
    }
  }
  return pts[pts.length - 1][1];
}

export function levelFor(score: number, c: Config = defaultConfig): string {
  let name = c.levels[0].name;
  for (const l of c.levels) if (score >= l.min) name = l.name;
  return name;
}

export function shouldShowScore(filmsSeen: number, c: Config = defaultConfig): boolean {
  return filmsSeen >= c.minFilmsToShow;
}

export function computeScore(i: ScoreInput, c: Config = defaultConfig): ScoreResult {
  const d = c.diversity;
  const volume = interpolate(i.filmsSeen, c.volumePoints);
  const diversity =
    (i.genresCovered / d.genres +
      i.erasCovered / d.eras +
      i.regionsCovered / d.regions +
      Math.min(1, i.nonEnglishShare / d.nonEnglishFullAt)) / 4;
  const referenceUsed = i.accessibleRefCount >= c.reference.minAccessible;
  const reference = referenceUsed
    ? Math.min(1, i.refSeen / (c.reference.fullAt * i.accessibleRefCount))
    : 0;
  const w = referenceUsed ? c.weights : c.weightsWithoutRef;
  const raw = w.volume * volume + w.diversity * diversity + w.reference * reference;
  const score = Math.round(100 * raw);
  return { score, level: levelFor(score, c), volume, diversity, reference, referenceUsed };
}

// ---- Construction de l'entrée à partir des films vus ----

export type FilmFact = {
  id: string;
  year: number | null;
  runtimeMin: number | null;
  families: string[];          // familles de genres (table genre_families)
  region: string | null;       // 'hollywood' | 'france' | 'europe' | 'asie' | 'monde' (table country_regions)
  language: string | null;     // langue originale, code ISO ('en', 'fr', ...)
};

export function eraOf(year: number): number {
  if (year < 1960) return 0;
  if (year < 1980) return 1;
  if (year < 1990) return 2;
  if (year < 2000) return 3;
  if (year < 2010) return 4;
  if (year < 2020) return 5;
  return 6;
}

export function buildInput(
  seen: FilmFact[],
  referenceIds: Set<string>,
  accessibleRefCount: number,
  c: Config = defaultConfig,
): ScoreInput {
  const counted = seen.filter((f) => f.runtimeMin == null || f.runtimeMin >= c.minRuntimeMin);
  const fam = new Map<string, number>();
  const era = new Map<number, number>();
  const reg = new Map<string, number>();
  let withLang = 0, nonEn = 0, refSeen = 0;
  for (const f of counted) {
    for (const x of new Set(f.families)) fam.set(x, (fam.get(x) ?? 0) + 1);
    if (f.year != null) era.set(eraOf(f.year), (era.get(eraOf(f.year)) ?? 0) + 1);
    if (f.region) reg.set(f.region, (reg.get(f.region) ?? 0) + 1);
    if (f.language) { withLang++; if (f.language !== 'en') nonEn++; }
    if (referenceIds.has(f.id)) refSeen++;
  }
  const covered = <K>(m: Map<K, number>, min: number) => [...m.values()].filter((n) => n >= min).length;
  return {
    filmsSeen: counted.length,
    genresCovered: covered(fam, c.diversity.minPerGenre),
    erasCovered: covered(era, c.diversity.minPerEra),
    regionsCovered: covered(reg, c.diversity.minPerRegion),
    nonEnglishShare: withLang ? nonEn / withLang : 0,
    refSeen,
    accessibleRefCount,
  };
}
