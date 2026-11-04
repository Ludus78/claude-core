// CelesTrak groups shown on the globe. Group names and sizes: à vérifier à la source
// (https://celestrak.org/NORAD/elements/), the list is not read from CelesTrak.
// maxObjects values are arbitrary prototype limits.
export const GROUPS = {
  stations: { label: "Stations spatiales (dont l'ISS)", color: "#ff5a5f", maxObjects: 50 },
  starlink: { label: "Starlink (échantillon)", color: "#4cc9f0", maxObjects: 300 },
  oneweb: { label: "OneWeb (échantillon)", color: "#f9c74f", maxObjects: 200 },
} as const;

export type GroupId = keyof typeof GROUPS;

export function isGroupId(value: string): value is GroupId {
  return Object.prototype.hasOwnProperty.call(GROUPS, value);
}
