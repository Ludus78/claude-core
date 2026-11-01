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
  piege: 'border-red-200 bg-red-50 text-red-900',
  astuce: 'border-primary-200 bg-primary-50 text-gray-900',
  verifier: 'border-amber-200 bg-amber-50 text-amber-900',
} as const;

function BlocView({ bloc }: { bloc: Bloc }) {
  switch (bloc.type) {
    case 'titre':
      return <h2 className="pt-4 text-xl font-semibold text-gray-900">{bloc.texte}</h2>;
    case 'texte':
      return <p className="leading-relaxed text-gray-700">{bloc.texte}</p>;
    case 'liste':
      return (
        <ul className="list-disc space-y-2 pl-6 text-gray-700">
          {bloc.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      );
    case 'encadre':
      return (
        <aside className={`rounded-lg border p-4 ${STYLES_ENCADRE[bloc.variante]}`}>
          <p className="font-semibold">{bloc.titre}</p>
          <p className="mt-1 text-sm leading-relaxed">{bloc.texte}</p>
        </aside>
      );
    case 'calculette':
      return (
        <Link
          href={bloc.href}
          className="inline-flex items-center rounded-lg bg-primary-600 px-5 py-3 font-medium text-white hover:bg-primary-700"
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
      <Link href="/achat" className="text-sm text-primary-700 hover:underline">← Toutes les étapes</Link>

      <header className="mt-4">
        <p className="text-sm font-medium text-primary-700">Étape {etape.numero} sur {ETAPES.length}</p>
        <h1 className="mt-1 text-3xl font-extrabold text-gray-900">{etape.titre}</h1>
        <p className="mt-3 text-lg text-gray-600">{etape.resume}</p>
        <p className="mt-2 text-sm text-gray-400">Durée habituelle : {etape.duree}</p>
      </header>

      <div className="mt-8 space-y-5">
        {etape.blocs.map((bloc, i) => (
          <BlocView key={i} bloc={bloc} />
        ))}
      </div>

      {etape.sources.length > 0 && (
        <section className="mt-10 border-t border-gray-200 pt-6">
          <h2 className="text-sm font-semibold text-gray-900">Pour vérifier et aller plus loin</h2>
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
          <Link href={`/achat/${precedente.slug}`} className="text-primary-700 hover:underline">
            ← {precedente.titre}
          </Link>
        ) : <span />}
        {suivante ? (
          <Link href={`/achat/${suivante.slug}`} className="text-right text-primary-700 hover:underline">
            {suivante.titre} →
          </Link>
        ) : <span />}
      </nav>
    </article>
  );
}
