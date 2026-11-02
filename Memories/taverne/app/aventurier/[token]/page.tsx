import { notFound } from "next/navigation";
import { prisma } from "../../../src/prisma";
import { ajouterRecit } from "../../actions";

export const dynamic = "force-dynamic";
export const metadata = { title: "Ton héros · La Taverne des Souvenirs", robots: { index: false, follow: false } };

const CHAMPS: [string, "apparence" | "representation" | "equipement" | "caractere" | "phraseCulte" | "histoire"][] = [
  ["Son allure", "apparence"],
  ["Dans la BD", "representation"],
  ["Son équipement", "equipement"],
  ["Son caractère", "caractere"],
  ["Sa phrase culte", "phraseCulte"],
  ["Son histoire", "histoire"],
];

export default async function Aventurier({
  params,
  searchParams,
}: {
  params: Promise<{ token: string }>;
  searchParams: Promise<{ nouveau?: string; ajoute?: string; erreur?: string }>;
}) {
  const { token } = await params;
  const { nouveau, ajoute, erreur } = await searchParams;

  // Le lien privé est la clé : un token inconnu ressemble à une page inexistante.
  const aventurier = await prisma.aventurier.findUnique({
    where: { token },
    include: { recits: { orderBy: { createdAt: "asc" } } },
  });
  if (!aventurier) notFound();

  return (
    <main className="page">
      <header className="enseigne">
        <div className="foyer" aria-hidden="true" />
        <h1>{aventurier.nom}</h1>
        <p>
          {aventurier.classe} · {aventurier.race} · {aventurier.sexe}
        </p>
      </header>

      {nouveau && (
        <p role="status" className="confirmation">
          Ton héros est inscrit au registre. <strong>Garde cette page en favori</strong> : son adresse est ta clé privée, c&apos;est
          par elle que tu reviendras ajouter des histoires. Ne la partage pas.
        </p>
      )}
      {ajoute && (
        <p role="status" className="confirmation">
          Ton récit est ajouté au registre.
        </p>
      )}
      {erreur && (
        <p role="alert" className="alerte">
          Il faut un titre et un texte pour inscrire une histoire.
        </p>
      )}

      <section className="parchemin fiche">
        <h2>Fiche de {aventurier.joueur}</h2>
        <dl>
          {CHAMPS.filter(([, cle]) => aventurier[cle]).map(([libelle, cle]) => (
            <div key={cle}>
              <dt>{libelle}</dt>
              <dd>{aventurier[cle]}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="parchemin recit">
        <h2>Les histoires de la salle ({aventurier.recits.length})</h2>
        {aventurier.recits.length === 0 && <p className="aide">Aucune histoire pour l&apos;instant. Le feu attend la première.</p>}
        {aventurier.recits.map((r) => (
          <article key={r.id}>
            <h3>{r.titre}</h3>
            <p>{r.texte}</p>
          </article>
        ))}
      </section>

      <section className="parchemin">
        <h2>Raconter une autre histoire</h2>
        <form action={ajouterRecit}>
          <input type="hidden" name="token" value={token} />
          <label htmlFor="titre">Titre de l&apos;histoire</label>
          <input id="titre" name="titre" type="text" required maxLength={120} autoComplete="off" />
          <label htmlFor="texte">Ton récit</label>
          <textarea id="texte" name="texte" required maxLength={8000} />
          <button type="submit" className="bouton">
            Inscrire l&apos;histoire
          </button>
        </form>
      </section>
    </main>
  );
}
