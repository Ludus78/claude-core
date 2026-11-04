import { json2satrec, type OMMJsonObject } from "satellite.js";
import { describe, expect, it } from "vitest";
import { scenePosition } from "./projection";

const ISS: OMMJsonObject = {
  OBJECT_NAME: "ISS (ZARYA)",
  OBJECT_ID: "1998-067A",
  EPOCH: "2026-11-04T08:52:07.404096",
  MEAN_MOTION: 15.49173979,
  ECCENTRICITY: 0.0007186,
  INCLINATION: 51.6329,
  RA_OF_ASC_NODE: 326.3987,
  ARG_OF_PERICENTER: 346.7494,
  MEAN_ANOMALY: 13.3304,
  EPHEMERIS_TYPE: 0,
  CLASSIFICATION_TYPE: "U",
  NORAD_CAT_ID: 25544,
  ELEMENT_SET_NO: 999,
  REV_AT_EPOCH: 59348,
  BSTAR: 0.00010236,
  MEAN_MOTION_DOT: 5.228e-5,
  MEAN_MOTION_DDOT: 0,
};

// Latitude maximale = inclinaison (51,6329°) ; marge ajoutée pour la précision de la conversion.
const MAX_SINE_OF_LATITUDE = Math.sin((51.7 * Math.PI) / 180) + 0.01;

describe("scenePosition", () => {
  it("place l'ISS à environ 1,05-1,1 rayon terrestre du centre", () => {
    const satrec = json2satrec(ISS);
    const position = scenePosition(satrec, new Date("2026-11-04T09:00:00Z"));

    expect(position).not.toBeNull();
    const [x, y, z] = position as [number, number, number];
    const distance = Math.sqrt(x * x + y * y + z * z);
    expect(distance).toBeGreaterThan(1.05);
    expect(distance).toBeLessThan(1.1);
  });

  it("garde la latitude de l'ISS dans l'inclinaison (axe nord = y)", () => {
    const satrec = json2satrec(ISS);
    // Plusieurs instants répartis sur une orbite (~93 min) pour couvrir les latitudes.
    const start = Date.parse("2026-11-04T09:00:00Z");
    for (let step = 0; step < 20; step++) {
      const date = new Date(start + step * 5 * 60 * 1000);
      const [x, y, z] = scenePosition(satrec, date) as [number, number, number];
      const distance = Math.sqrt(x * x + y * y + z * z);
      // y / distance = sin(latitude), la latitude ne dépasse pas l'inclinaison.
      expect(Math.abs(y / distance)).toBeLessThanOrEqual(MAX_SINE_OF_LATITUDE);
    }
  });

  it("renvoie null quand la propagation échoue", () => {
    // Excentricité hors plage : sgp4init/sgp4 refusent de propager.
    const broken = json2satrec({ ...ISS, ECCENTRICITY: 1.5 });
    expect(scenePosition(broken, new Date("2026-11-04T09:00:00Z"))).toBeNull();
  });
});
