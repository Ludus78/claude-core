import { redirect } from "next/navigation";
import { aAcces } from "../../../src/acces";
import { CAMPS, CLASSES, RACES, SEXES } from "../../../src/warcraft";
import { creerAventurier } from "../../actions";

export const dynamic = "force-dynamic";
export const metadata = { title: "Ta fiche d'aventurier · La Taverne des Souvenirs" };

const MESSAGES: Record<string, string> = {
  fiche: "Le patron n'a pas pu lire ta fiche : vérifie ton nom, ta race, ton sexe et ta classe, puis réessaie.",
  recit: "Ton histoire est à moitié écrite : donne-lui un titre et un texte, ou laisse les deux vides.",
};

export default async function NouvelAventurier({ searchParams }: { searchParams: Promise<{ erreur?: string }> }) {
  if (!(await aAcces())) redirect("/");
  const { erreur } = await searchParams;
  const message = erreur ? MESSAGES[erreur] : undefined;

  return (
    <main className="page">
      <header className="enseigne">
        <div className="foyer" aria-hidden="true" />
        <h1>Ta fiche d&apos;aventurier</h1>
        <p>
          Le patron tient un registre des héros qui ont marqué la salle. Dis-lui qui tu étais, et raconte ce dont tu te
          souviens. Compte un quart d&apos;heure ; tu pourras ajouter des histoires plus tard.
        </p>
      </header>

      {message && (
        <p role="alert" className="alerte">
          {message}
        </p>
      )}

      <form action={creerAventurier}>
        <section className="parchemin">
          <h2>Qui es-tu, voyageur ?</h2>
          <label htmlFor="joueur">
            Ton prénom ou ton pseudo
            <span className="champ-aide">Celui que ta bande utilise pour t&apos;appeler.</span>
          </label>
          <input id="joueur" name="joueur" type="text" required maxLength={60} autoComplete="off" />
        </section>

        <section className="parchemin">
          <h2>Ton héros</h2>
          <p className="aide">Le personnage que tu as joué sur Azeroth. Si tu en as eu plusieurs, commence par le plus marquant.</p>

          <label htmlFor="nom">Son nom</label>
          <input id="nom" name="nom" type="text" required maxLength={60} autoComplete="off" />

          <label htmlFor="race">Sa race</label>
          <select id="race" name="race" required defaultValue="">
            <option value="" disabled>
              Choisis une race
            </option>
            {CAMPS.map((camp) => (
              <optgroup key={camp} label={camp}>
                {RACES.filter((r) => r.camp === camp).map((r) => (
                  <option key={r.nom} value={r.nom}>
                    {r.nom}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>

          <fieldset>
            <legend>Son sexe</legend>
            <div className="choix">
              {SEXES.map((s) => (
                <label key={s} className="case">
                  <input type="radio" name="sexe" value={s} required />
                  {s}
                </label>
              ))}
            </div>
          </fieldset>

          <label htmlFor="classe">Sa classe</label>
          <select id="classe" name="classe" required defaultValue="">
            <option value="" disabled>
              Choisis une classe
            </option>
            {CLASSES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <label htmlFor="apparence">
            Son allure
            <span className="champ-aide">Taille, carrure, visage, cheveux, cicatrices, signe distinctif…</span>
          </label>
          <textarea id="apparence" name="apparence" maxLength={2000} />

          <label htmlFor="representation">
            Comment tu te vois dans la BD
            <span className="champ-aide">
              Ton personnage peut changer : un autre look, une autre allure, une autre race. Dis comment tu veux apparaître, ou laisse vide pour ne rien
              changer.
            </span>
          </label>
          <textarea id="representation" name="representation" maxLength={2000} />

          <label htmlFor="equipement">
            Son équipement
            <span className="champ-aide">Armure, arme, objet fétiche, monture, ce qu&apos;il gardait au fond de son sac…</span>
          </label>
          <textarea id="equipement" name="equipement" maxLength={2000} />

          <label htmlFor="caractere">
            Son caractère
            <span className="champ-aide">Ses qualités, ses défauts, ses manies. Sois honnête, la salle l&apos;est.</span>
          </label>
          <textarea id="caractere" name="caractere" maxLength={2000} />

          <label htmlFor="phraseCulte">Sa phrase culte</label>
          <input id="phraseCulte" name="phraseCulte" type="text" maxLength={300} autoComplete="off" />
        </section>

        <section className="parchemin">
          <h2>Son histoire</h2>
          <p className="aide">Facultatif. D&apos;où vient-il, qu&apos;est-ce qui l&apos;a mené sur les routes ? Invente ou raconte comme tu veux.</p>
          <label htmlFor="histoire" className="champ-aide">
            L&apos;histoire de ton héros
          </label>
          <textarea id="histoire" name="histoire" maxLength={8000} />
        </section>

        <section className="parchemin">
          <h2>Une histoire qui vous a marqués</h2>
          <p className="aide">
            Un souvenir vécu ensemble sur Azeroth : un donjon qui a mal tourné, un fou rire, un exploit, une honte. Raconte-le
            comme au coin du feu. Une seule ici ; tu pourras en ajouter autant que tu veux ensuite.
          </p>
          <label htmlFor="recitTitre">Titre de l&apos;histoire</label>
          <input id="recitTitre" name="recitTitre" type="text" maxLength={120} autoComplete="off" />
          <label htmlFor="recitTexte">Ton récit</label>
          <textarea id="recitTexte" name="recitTexte" maxLength={8000} />
        </section>

        <section className="parchemin">
          <h2>Entre nous</h2>
          <label htmlFor="limites">
            Ce qui ne doit pas apparaître
            <span className="champ-aide">Anecdotes, traits ou détails de ta vie réelle que tu veux garder pour toi.</span>
          </label>
          <textarea id="limites" name="limites" maxLength={2000} />

          <label className="case">
            <input type="checkbox" name="accordUsage" />
            <span>J&apos;accepte que mes réponses inspirent les personnages et les histoires de la BD.</span>
          </label>
          <label className="case">
            <input type="checkbox" name="relecture" />
            <span>Je veux relire ce qui me concerne avant toute diffusion.</span>
          </label>

          <button type="submit" className="bouton">
            Inscrire mon héros au registre
          </button>
        </section>
      </form>
    </main>
  );
}
