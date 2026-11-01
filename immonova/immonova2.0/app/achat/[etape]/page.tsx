import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ETAPES, trouverEtape, type Bloc } from '../etapes';

type Props = { params: Promise<{ etape: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return ETAPES.filter((e) => e.publiee).map((e) => ({ etape: e.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { etape: slug } = await params;
  const etape = trouverEtape(slug);
  if (!etape || !etape.publiee) return {};
  return { title: `${etape.titre} | Acheter son premier bien`, description: etape.resume };
}

const STYLES_ENCADRE = {
  piege: 'bg-red-50 text-red-900',
  astuce: 'bg-primary-50 text-forest-800',
  verifier: 'bg-sun-100 text-sun-700',
} as const;

function BlocView({ bloc }: { bloc: Bloc }) {
  switch (bloc.type) {
    case 'titre':
      return <h2 className="pt-4 text-2xl font-extrabold text-forest-800">{bloc.texte}</h2>;
    case 'texte':
      return <p className="text-lg leading-relaxed text-gray-700">{bloc.texte}</p>;
    case 'liste':
      return (
        <ul className="list-disc space-y-2 pl-6 text-lg text-gray-700 marker:text-primary-500">
          {bloc.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      );
    case 'encadre':
      return (
        <aside className={`rounded-3xl p-5 ${STYLES_ENCADRE[bloc.variante]}`}>
          <p className="font-extrabold">{bloc.titre}</p>
          <p className="mt-1 text-sm leading-relaxed">{bloc.texte}</p>
        </aside>
      );
    case 'calculette':
      return (
        <Link
          href={bloc.href}
          className="btn btn-primary"
        >
          {bloc.label}
        </Link>
      );
  }
}

export default async function EtapePage({ params }: Props) {
  const { etape: slug } = await params;
  const etape = trouverEtape(slug);
  if (!etape || !etape.publiee) notFound();

  const precedente = ETAPES.find((e) => e.numero === etape.numero - 1 && e.publiee);
  const suivante = ETAPES.find((e) => e.numero === etape.numero + 1 && e.publiee);

  return (
    <article className="max-w-3xl mx-auto px-4 py-10">
      <Link href="/achat" className="text-sm font-bold text-primary-700 hover:underline">← Toutes les étapes</Link>

      <header className="mt-4">
        <p className="inline-block rounded-full bg-primary-100 px-3 py-1 text-sm font-extrabold text-forest-700">Étape {etape.numero} sur {ETAPES.length}</p>
        <h1 className="mt-3 text-3xl font-extrabold leading-tight text-forest-800 sm:text-4xl">{etape.titre}</h1>
        <p className="mt-3 text-xl text-gray-600">{etape.resume}</p>
        <p className="mt-2 text-sm text-gray-400">Durée habituelle : {etape.duree}</p>
      </header>

      <div className="mt-8 space-y-5">
        {etape.blocs.map((bloc, i) => (
          <BlocView key={i} bloc={bloc} />
        ))}
      </div>

      {etape.sources.length > 0 && (
        <section className="mt-10 rounded-3xl bg-white p-6">
          <h2 className="text-sm font-extrabold text-forest-800">Pour vérifier et aller plus loin</h2>
          <ul className="mt-2 space-y-1 text-sm">
            {etape.sources.map((s) => (
              <li key={s.label}>
                <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-primary-700 underline">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
          {etape.misAJour && <p className="mt-3 text-xs text-gray-400">Dernière mise à jour : {etape.misAJour}. Information générale, pas un conseil personnalisé.</p>}
        </section>
      )}

      <nav className="mt-10 flex justify-between gap-4">
        {precedente ? (
          <Link href={`/achat/${precedente.slug}`} className="font-bold text-primary-700 hover:underline">
            ← {precedente.titre}
          </Link>
        ) : <span />}
        {suivante ? (
          <Link href={`/achat/${suivante.slug}`} className="text-right font-bold text-primary-700 hover:underline">
            {suivante.titre} →
          </Link>
        ) : <span />}
      </nav>
    </article>
  );
}
