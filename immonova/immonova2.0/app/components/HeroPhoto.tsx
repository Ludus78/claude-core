"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { MAISONS } from "../maisons";

const LAST_KEY = "immonova-derniere-maison";

// Choisit une photo au hasard à chaque visite, différente de la précédente quand c'est possible.
// Le choix se fait côté navigateur : le fond reste uni le temps du chargement, puis la photo apparaît en fondu.
export default function HeroPhoto() {
  const [index, setIndex] = useState<number | null>(null);

  useEffect(() => {
    let last = -1;
    try {
      last = Number(window.localStorage.getItem(LAST_KEY) ?? -1);
    } catch {
      // stockage indisponible : tirage simple
    }

    let choix = Math.floor(Math.random() * MAISONS.length);
    if (MAISONS.length > 1 && choix === last) {
      choix = (choix + 1 + Math.floor(Math.random() * (MAISONS.length - 1))) % MAISONS.length;
    }

    try {
      window.localStorage.setItem(LAST_KEY, String(choix));
    } catch {
      // sans importance
    }
    setIndex(choix);
  }, []);

  const maison = index === null ? null : MAISONS[index];

  return (
    <>
      <div className="absolute inset-0 bg-forest-800" aria-hidden="true" />
      {maison && (
        <Image
          key={maison.src}
          src={maison.src}
          alt={maison.alt}
          fill
          priority
          sizes="100vw"
          quality={80}
          className="animate-[fadein_0.8s_ease-out] object-cover"
        />
      )}
      <div className="absolute inset-0 bg-forest-800/55" aria-hidden="true" />
      {maison?.credit && (
        <p className="absolute bottom-2 right-3 text-xs text-white/70">{maison.credit}</p>
      )}
    </>
  );
}
