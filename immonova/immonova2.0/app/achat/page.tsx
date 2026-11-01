import type { Metadata } from 'next';
import Link from 'next/link';
import { ETAPES } from './etapes';

export const metadata: Metadata = {
  title: 'Acheter son premier bien : le guide pas à pas',
  description:
    'Budget, financement, recherche, compromis, prêt, notaire : le parcours complet d\'un premier achat immobilier, expliqué simplement, étape par étape.',
};

export default function AchatPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <Link href="/" className="text-sm font-bold text-primary-700 hover:underline">← Retour à l&apos;accueil</Link>

      <header className="mt-4">
        <h1 className="text-3xl sm:text-5xl font-extrabold leading-tight text-forest-800">Acheter son premier bien, pas à pas</h1>
        <p className="mt-3 max-w-2xl text-lg text-gray-600">
          Huit étapes pour comprendre ce qui vous attend, dans l&apos;ordre, avec les pièges à éviter et les outils pour chiffrer votre projet.
        </p>
      </header>

      <ol className="mt-8 grid gap-4">
        {ETAPES.map((etape) => {
          const contenu = (
            <div className="flex items-start gap-4">
              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-lg font-extrabold ${
                  etape.publiee ? 'bg-primary-500 text-white' : 'bg-cream-200 text-gray-500'
                }`}
              >
                {etape.numero}
              </div>
              <div className="min-w-0">
                <h2 className="text-lg font-extrabold text-forest-800">
                  {etape.titre}
                  {!etape.publiee && (
                    <span className="ml-2 align-middle rounded-full bg-sun-100 px-2.5 py-0.5 text-xs font-extrabold text-sun-700">
                      Bientôt
                    </span>
                  )}
                </h2>
                <p className="mt-1 text-gray-600">{etape.resume}</p>
                <p className="mt-2 text-sm text-gray-400">Durée habituelle : {etape.duree}</p>
              </div>
            </div>
          );

          return (
            <li key={etape.slug}>
              {etape.publiee ? (
                <Link
                  href={`/achat/${etape.slug}`}
                  className="block rounded-3xl bg-white p-5 transition-shadow hover:shadow-lg"
                >
                  {contenu}
                </Link>
              ) : (
                <div className="rounded-3xl bg-white/60 p-5">{contenu}</div>
              )}
            </li>
          );
        })}
      </ol>

      <p className="mt-8 text-sm text-gray-500">
        Ce guide est une aide à la compréhension, pas un conseil personnalisé. Les règles, les taux et les aides évoluent : chaque
        étape indique ce qu&apos;il faut vérifier à la source.
      </p>
    </div>
  );
}
