"use server";

import { randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { aAcces, COOKIE_ACCES, empreinteAcces, motDePasseValide } from "../src/acces";
import { prisma } from "../src/prisma";
import { ficheSchema, recitSchema } from "../src/validation";

// Le navigateur envoie les retours à la ligne en CRLF (2 caractères) : on les ramène à LF pour que les limites de taille concordent.
const texte = (formData: FormData, nom: string) => String(formData.get(nom) ?? "").replaceAll("\r\n", "\n");

export async function entrer(formData: FormData) {
  const saisi = texte(formData, "motDePasse");
  if (!motDePasseValide(saisi)) redirect("/?erreur=1");

  (await cookies()).set(COOKIE_ACCES, empreinteAcces(saisi), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 60,
    path: "/",
  });
  redirect("/aventurier/nouveau");
}

export async function creerAventurier(formData: FormData) {
  if (!(await aAcces())) redirect("/");

  const fiche = ficheSchema.safeParse({
    joueur: texte(formData, "joueur"),
    nom: texte(formData, "nom"),
    race: texte(formData, "race"),
    sexe: texte(formData, "sexe"),
    classe: texte(formData, "classe"),
    apparence: texte(formData, "apparence"),
    representation: texte(formData, "representation"),
    equipement: texte(formData, "equipement"),
    caractere: texte(formData, "caractere"),
    phraseCulte: texte(formData, "phraseCulte"),
    histoire: texte(formData, "histoire"),
    limites: texte(formData, "limites"),
    accordUsage: formData.get("accordUsage") === "on",
    relecture: formData.get("relecture") === "on",
  });
  if (!fiche.success) redirect("/aventurier/nouveau?erreur=fiche");

  // Premier récit facultatif : ignoré s'il est vide, refusé s'il est à moitié rempli.
  const titre = texte(formData, "recitTitre").trim();
  const recitTexte = texte(formData, "recitTexte").trim();
  let recit: { titre: string; texte: string } | null = null;
  if (titre || recitTexte) {
    const lu = recitSchema.safeParse({ titre, texte: recitTexte });
    if (!lu.success) redirect("/aventurier/nouveau?erreur=recit");
    recit = lu.data;
  }

  const token = randomBytes(24).toString("hex");
  await prisma.aventurier.create({
    data: { ...fiche.data, token, recits: recit ? { create: recit } : undefined },
  });

  redirect(`/aventurier/${token}?nouveau=1`);
}

export async function ajouterRecit(formData: FormData) {
  const token = texte(formData, "token");
  const lu = recitSchema.safeParse({ titre: texte(formData, "titre"), texte: texte(formData, "texte") });
  if (!lu.success) redirect(`/aventurier/${encodeURIComponent(token)}?erreur=recit`);

  // Le lien privé (token) fait office de clé : pas besoin du mot de passe de la porte.
  const aventurier = await prisma.aventurier.findUnique({ where: { token }, select: { id: true } });
  if (!aventurier) redirect("/");

  await prisma.recit.create({ data: { ...lu.data, aventurierId: aventurier.id } });
  redirect(`/aventurier/${token}?ajoute=1`);
}
