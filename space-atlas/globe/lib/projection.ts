import { eciToEcf, gstime, propagate, type SatRec } from "satellite.js";

export const EARTH_RADIUS_KM = 6371;

// Position in scene units (Earth radius = 1), or null when SGP4 cannot propagate at this date.
// ECEF axes (x to 0°E, z to the north pole) become three.js axes (y up): (x, y, z) -> (x, z, -y).
export function scenePosition(satrec: SatRec, date: Date): [number, number, number] | null {
  const result = propagate(satrec, date);
  if (!result || typeof result.position === "boolean" || !result.position) return null;
  const ecf = eciToEcf(result.position, gstime(date));
  return [ecf.x / EARTH_RADIUS_KM, ecf.z / EARTH_RADIUS_KM, -ecf.y / EARTH_RADIUS_KM];
}
