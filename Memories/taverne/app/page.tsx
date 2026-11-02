import Link from "next/link";
import { aAcces } from "../src/acces";
import { entrer } from "./actions";

export const dynamic = "force-dynamic";

export default async function Porte({ searchParams }: { searchParams: Promise<{ erreur?: string }> }) {
  const { erreur } = await searchParams;
  const dejaEntre = await aAcces();

  return (
    <main className="page">
      <header className="enseigne">
        <div className="foyer" aria-hidden="true" />
        <h1>La Taverne des Souvenirs</h1>
        <p>
          Assieds-toi près du feu. Les chopes sont pleines, les bancs sont usés, et les histoires ne demandent qu&apos;à
          sortir.
        </p>
      </header>

      {erreur && (
        <p role="alert" className="alerte">
          La porte reste close : ce n&apos;est pas le bon mot de passe.
        </p>
      )}

      <section className="parchemin">
        <h2>{dejaEntre ? "Te revoilà, voyageur" : "Le mot de passe de la porte"}</h2>
        {dejaEntre ? (
          <>
            <p className="aide">Le patron te garde une place près de l&apos;âtre.</p>
            <Link href="/aventurier/nouveau" className="bouton">
              Entrer dans l&apos;auberge
            </Link>
          </>
        ) : (
          <>
            <p className="aide">Je t&apos;ai envoyé le mot de passe en privé. Chuchote-le au portier.</p>
            <form action={entrer}>
              <label htmlFor="motDePasse">Mot de passe</label>
              <input id="motDePasse" name="motDePasse" type="password" required autoComplete="off" />
              <button type="submit" className="bouton">
                Frapper à la porte
              </button>
            </form>
          </>
        )}
      </section>
    </main>
  );
}
