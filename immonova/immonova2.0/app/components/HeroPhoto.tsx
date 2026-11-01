"use client";

import { useEffect, useState } from "react";
import { MAISONS } from "../maisons";

const LAST_KEY = "immonova-derniere-maison";

// Script exécuté dès que le navigateur lit la bannière, avant même le chargement du reste du site :
// il tire une photo au hasard (différente de la précédente) et la pose en fond, ce qui lance son téléchargement tout de suite.
const SCRIPT = `(function(){try{var l=${JSON.stringify(MAISONS.map((m) => m.src))};var last=-1;try{last=+localStorage.getItem("${LAST_KEY}")}catch(e){}var i=Math.floor(Math.random()*l.length);if(l.length>1&&i===last){i=(i+1+Math.floor(Math.random()*(l.length-1)))%l.length}try{localStorage.setItem("${LAST_KEY}",String(i))}catch(e){}var el=document.getElementById("hero-bg");if(el){el.style.backgroundImage="url("+l[i]+")";el.setAttribute("data-maison",String(i))}}catch(e){}})();`;

export default function HeroPhoto() {
  const [credit, setCredit] = useState<string | undefined>();

  useEffect(() => {
    const el = document.getElementById("hero-bg");
    if (!el) return;

    let index = Number(el.getAttribute("data-maison"));
    // Navigation interne : le script de la page n'a pas tourné, on tire la photo ici.
    if (!Number.isInteger(index) || !MAISONS[index]) {
      index = Math.floor(Math.random() * MAISONS.length);
      el.style.backgroundImage = `url(${MAISONS[index].src})`;
      el.setAttribute("data-maison", String(index));
    }
    setCredit(MAISONS[index].credit);
  }, []);

  return (
    <>
      <div
        id="hero-bg"
        suppressHydrationWarning
        className="absolute inset-0 animate-[fadein_0.7s_ease-out] bg-forest-800 bg-cover bg-center"
        aria-hidden="true"
      />
      <script dangerouslySetInnerHTML={{ __html: SCRIPT }} />
      <div className="absolute inset-0 bg-gradient-to-r from-forest-800/70 via-forest-800/30 to-transparent" aria-hidden="true" />
      {credit && <p className="absolute bottom-1.5 right-3 text-[11px] text-white/70">{credit}</p>}
    </>
  );
}
