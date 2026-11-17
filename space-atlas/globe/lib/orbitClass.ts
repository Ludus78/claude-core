// Classement d'une orbite en famille (LEO, MEO, GEO, HEO) à partir de ses altitudes.
//
// Les seuils ci-dessous sont des conventions courantes, pas des faits vérifiés : à vérifier à la
// source (voir docs/research/orbit-families.md, menée par le propriétaire) avant toute publication.
// Les définitions varient selon les sources, d'où des constantes nommées faciles à changer.

export type OrbitFamily = "LEO" | "MEO" | "GEO" | "HEO" | "autre";

/** Rayon équatorial terrestre, km (valeur usuelle, à vérifier à la source). */
export const EARTH_RADIUS_KM = 6378.137;
/** Paramètre gravitationnel terrestre, km³/s² (valeur usuelle, à vérifier à la source). */
export const EARTH_MU_KM3_S2 = 398600.4418;
/** Altitude de l'orbite géostationnaire, km (valeur usuelle, à vérifier à la source). */
export const GEO_ALTITUDE_KM = 35786;
/** Limite haute de la LEO, km (convention, à vérifier à la source). */
export const LEO_MAX_ALTITUDE_KM = 2000;
/** Écart toléré autour de l'altitude géostationnaire, km (choix de ce prototype, à vérifier). */
export const GEO_TOLERANCE_KM = 300;

export type OrbitAltitudes = { perigeeKm: number; apogeeKm: number };

/**
 * Altitudes de périgée et d'apogée (au-dessus du rayon équatorial) à partir du mouvement moyen
 * (révolutions par jour) et de l'excentricité, comme dans les données GP/OMM de CelesTrak.
 * Lance une erreur si les valeurs sont hors domaine.
 */
export function altitudesFromMeanMotion(meanMotionRevPerDay: number, eccentricity: number): OrbitAltitudes {
  if (!Number.isFinite(meanMotionRevPerDay) || meanMotionRevPerDay <= 0) {
    throw new RangeError("Le mouvement moyen doit être un nombre positif.");
  }
  if (!Number.isFinite(eccentricity) || eccentricity < 0 || eccentricity >= 1) {
    throw new RangeError("L'excentricité doit être comprise entre 0 (inclus) et 1 (exclu).");
  }
  const meanMotionRadPerSec = (meanMotionRevPerDay * 2 * Math.PI) / 86400;
  const semiMajorAxisKm = Math.cbrt(EARTH_MU_KM3_S2 / (meanMotionRadPerSec * meanMotionRadPerSec));
  const perigeeKm = semiMajorAxisKm * (1 - eccentricity) - EARTH_RADIUS_KM;
  if (perigeeKm < 0) {
    throw new RangeError("Orbite impossible : le périgée passe sous la surface de la Terre.");
  }
  return { perigeeKm, apogeeKm: semiMajorAxisKm * (1 + eccentricity) - EARTH_RADIUS_KM };
}

/**
 * Famille d'orbite :
 * - LEO : apogée sous `LEO_MAX_ALTITUDE_KM` ;
 * - GEO : périgée et apogée proches de `GEO_ALTITUDE_KM` ;
 * - HEO : l'orbite passe sous la limite LEO et monte au-dessus (très elliptique, ex. type Molniya) ;
 * - MEO : entièrement entre la limite LEO et la bande géostationnaire ;
 * - autre : le reste (par exemple au-delà de la géostationnaire).
 */
export function classifyOrbit({ perigeeKm, apogeeKm }: OrbitAltitudes): OrbitFamily {
  if (!Number.isFinite(perigeeKm) || !Number.isFinite(apogeeKm) || apogeeKm < perigeeKm) {
    throw new RangeError("Altitudes invalides : l'apogée doit être supérieur ou égal au périgée.");
  }
  if (apogeeKm <= LEO_MAX_ALTITUDE_KM) return "LEO";

  const geoLow = GEO_ALTITUDE_KM - GEO_TOLERANCE_KM;
  const geoHigh = GEO_ALTITUDE_KM + GEO_TOLERANCE_KM;
  if (perigeeKm >= geoLow && apogeeKm <= geoHigh) return "GEO";

  if (perigeeKm < LEO_MAX_ALTITUDE_KM) return "HEO";
  if (apogeeKm < geoLow) return "MEO";
  return "autre";
}
