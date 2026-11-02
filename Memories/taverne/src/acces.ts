import { createHash, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

// La porte de l'auberge : un mot de passe partagé avec les amis (variable ACCES_TAVERNE).
// Le cookie ne contient qu'une empreinte du mot de passe, jamais le mot de passe lui-même.
export const COOKIE_ACCES = "taverne";

const empreinte = (texte: string) => createHash("sha256").update(`taverne:${texte}`).digest("hex");

const egal = (a: string, b: string) => {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
};

export function motDePasseValide(saisi: string): boolean {
  const attendu = process.env.ACCES_TAVERNE;
  return !!attendu && egal(empreinte(saisi), empreinte(attendu));
}

export function empreinteAcces(saisi: string): string {
  return empreinte(saisi);
}

export async function aAcces(): Promise<boolean> {
  const attendu = process.env.ACCES_TAVERNE;
  const valeur = (await cookies()).get(COOKIE_ACCES)?.value;
  return !!attendu && !!valeur && egal(valeur, empreinte(attendu));
}
