import { z } from "zod";
import { CLASSES, RACES, SEXES } from "./warcraft";

// Champ texte facultatif : vide devient null.
const facultatif = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .transform((v) => (v === "" ? null : v));

export const ficheSchema = z.object({
  joueur: z.string().trim().min(1).max(60),
  nom: z.string().trim().min(1).max(60),
  race: z.enum(RACES.map((r) => r.nom) as [string, ...string[]]),
  sexe: z.enum(SEXES as [string, ...string[]]),
  classe: z.enum(CLASSES as [string, ...string[]]),
  apparence: facultatif(2000),
  representation: facultatif(2000),
  equipement: facultatif(2000),
  caractere: facultatif(2000),
  phraseCulte: facultatif(300),
  histoire: facultatif(8000),
  limites: facultatif(2000),
  accordUsage: z.boolean(),
  relecture: z.boolean(),
});

export const recitSchema = z.object({
  titre: z.string().trim().min(1).max(120),
  texte: z.string().trim().min(1).max(8000),
});

export type Fiche = z.infer<typeof ficheSchema>;
