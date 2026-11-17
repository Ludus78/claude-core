import { describe, expect, it } from "vitest";
import {
  GEO_ALTITUDE_KM,
  GEO_TOLERANCE_KM,
  LEO_MAX_ALTITUDE_KM,
  altitudesFromMeanMotion,
  classifyOrbit,
} from "./orbitClass";

// Les valeurs de mouvement moyen et d'excentricité ci-dessous sont des exemples approximatifs,
// inventés pour tester la géométrie. Ce ne sont pas des données réelles d'un satellite.

describe("altitudesFromMeanMotion", () => {
  it("donne une orbite basse d'environ 420 km pour un mouvement moyen type ISS", () => {
    // Exemple approximatif : 15,5 rév/jour, excentricité 0,0005.
    const { perigeeKm, apogeeKm } = altitudesFromMeanMotion(15.5, 0.0005);

    expect(perigeeKm).toBeGreaterThan(380);
    expect(perigeeKm).toBeLessThan(450);
    expect(apogeeKm).toBeGreaterThan(380);
    expect(apogeeKm).toBeLessThan(450);
    expect(apogeeKm).toBeGreaterThanOrEqual(perigeeKm);
  });

  it("donne une altitude géostationnaire d'environ 35786 km pour 1,0027 rév/jour et e = 0", () => {
    // Exemple approximatif : orbite quasi circulaire à la période d'un jour sidéral.
    const { perigeeKm, apogeeKm } = altitudesFromMeanMotion(1.0027, 0);

    expect(Math.abs(perigeeKm - GEO_ALTITUDE_KM)).toBeLessThanOrEqual(50);
    expect(Math.abs(apogeeKm - GEO_ALTITUDE_KM)).toBeLessThanOrEqual(50);
    expect(perigeeKm).toBeCloseTo(apogeeKm, 6);
  });

  it("donne une orbite très elliptique type Molniya pour 2 rév/jour et e = 0,7", () => {
    // Exemple approximatif : deux révolutions par jour, forte excentricité.
    const { perigeeKm, apogeeKm } = altitudesFromMeanMotion(2, 0.7);

    expect(perigeeKm).toBeGreaterThan(1000);
    expect(perigeeKm).toBeLessThan(2500);
    expect(apogeeKm).toBeGreaterThan(38000);
    expect(apogeeKm).toBeLessThan(40000);
  });

  it.each([
    ["zéro", 0],
    ["négatif", -15.5],
    ["NaN", Number.NaN],
  ])("lance une RangeError si le mouvement moyen est %s", (_label, meanMotion) => {
    expect(() => altitudesFromMeanMotion(meanMotion, 0.001)).toThrow(RangeError);
  });

  it.each([
    ["négative", -0.1],
    ["égale à 1", 1],
    ["NaN", Number.NaN],
  ])("lance une RangeError si l'excentricité est %s", (_label, eccentricity) => {
    expect(() => altitudesFromMeanMotion(15.5, eccentricity)).toThrow(RangeError);
  });
});

describe("altitudesFromMeanMotion : orbite impossible", () => {
  it("lance une RangeError quand le périgée passerait sous la surface", () => {
    // Mouvement moyen volontairement énorme (valeur inventée) : demi-grand axe plus petit que la Terre.
    expect(() => altitudesFromMeanMotion(30, 0)).toThrow(RangeError);
  });
});

describe("classifyOrbit", () => {
  it("classe en LEO une orbite dont l'apogée est sous la limite", () => {
    // Exemple approximatif, altitudes inventées.
    expect(classifyOrbit({ perigeeKm: 410, apogeeKm: 420 })).toBe("LEO");
  });

  it("classe en LEO quand l'apogée vaut exactement la limite LEO", () => {
    expect(classifyOrbit({ perigeeKm: 400, apogeeKm: LEO_MAX_ALTITUDE_KM })).toBe("LEO");
  });

  it("classe en MEO une orbite entre la limite LEO et la géostationnaire", () => {
    // Exemple approximatif : périgée 19000 km, apogée 19300 km.
    expect(classifyOrbit({ perigeeKm: 19000, apogeeKm: 19300 })).toBe("MEO");
  });

  it("classe en GEO une orbite circulaire à l'altitude géostationnaire", () => {
    expect(classifyOrbit({ perigeeKm: GEO_ALTITUDE_KM, apogeeKm: GEO_ALTITUDE_KM })).toBe("GEO");
  });

  it("classe en GEO quand périgée et apogée sont aux bornes basses et hautes de la tolérance", () => {
    const low = GEO_ALTITUDE_KM - GEO_TOLERANCE_KM;
    const high = GEO_ALTITUDE_KM + GEO_TOLERANCE_KM;

    expect(classifyOrbit({ perigeeKm: low, apogeeKm: low })).toBe("GEO");
    expect(classifyOrbit({ perigeeKm: high, apogeeKm: high })).toBe("GEO");
    expect(classifyOrbit({ perigeeKm: low, apogeeKm: high })).toBe("GEO");
  });

  it("ne classe pas en GEO une orbite juste hors de la tolérance", () => {
    const low = GEO_ALTITUDE_KM - GEO_TOLERANCE_KM;
    const high = GEO_ALTITUDE_KM + GEO_TOLERANCE_KM;

    expect(classifyOrbit({ perigeeKm: low - 1, apogeeKm: high })).not.toBe("GEO");
    expect(classifyOrbit({ perigeeKm: low, apogeeKm: high + 1 })).not.toBe("GEO");
  });

  it("classe en HEO une orbite qui passe sous la LEO et monte très haut", () => {
    // Exemple approximatif : périgée 500 km, apogée 39000 km.
    expect(classifyOrbit({ perigeeKm: 500, apogeeKm: 39000 })).toBe("HEO");
  });

  it("classe en « autre » une orbite au-delà de la géostationnaire", () => {
    // Exemple approximatif : périgée 40000 km, apogée 42000 km.
    expect(classifyOrbit({ perigeeKm: 40000, apogeeKm: 42000 })).toBe("autre");
  });

  it("classe en « autre » une orbite dont le périgée dépasse la LEO et l'apogée touche la bande géostationnaire (choix D31)", () => {
    // Exemple approximatif : périgée 10000 km, apogée 35786 km (ni MEO pur, ni GEO).
    expect(classifyOrbit({ perigeeKm: 10000, apogeeKm: 35786 })).toBe("autre");
  });

  it("lance une RangeError si l'apogée est inférieur au périgée", () => {
    expect(() => classifyOrbit({ perigeeKm: 1000, apogeeKm: 500 })).toThrow(RangeError);
  });

  it.each([
    ["NaN", { perigeeKm: Number.NaN, apogeeKm: 500 }],
    ["infini", { perigeeKm: 500, apogeeKm: Number.POSITIVE_INFINITY }],
  ])("lance une RangeError si une altitude est %s", (_label, altitudes) => {
    expect(() => classifyOrbit(altitudes)).toThrow(RangeError);
  });
});
