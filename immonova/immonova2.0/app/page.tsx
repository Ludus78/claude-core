"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CalculatorIcon, ChartBarIcon, BanknotesIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import EmailPopup from './components/EmailPopup';
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import CalculatorPopup from './components/CalculatorPopup';
import HeroPhoto from './components/HeroPhoto';
import { ETAPES } from './achat/etapes';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated } = useKindeBrowserClient();
  const [showEmailPopup, setShowEmailPopup] = useState(false);
  const [targetCalculator, setTargetCalculator] = useState<{
    name: string;
    path: string;
  }>({ name: '', path: '' });

  const handleCalculatorClick = (calculatorName: string, path: string) => {
    // Si l'utilisateur est connecté, rediriger directement
    if (isAuthenticated) {
      router.push(path);
      return;
    }

    // Sinon, afficher le popup d'email
    setTargetCalculator({ name: calculatorName, path });
    setShowEmailPopup(true);
  };

  const handleEmailSubmit = async (email: string, acceptNewsletter: boolean) => {
    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          calculatorType: targetCalculator.name,
          acceptNewsletter,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save email');
      }

      // Rediriger vers la calculette après la sauvegarde de l'email
      router.push(targetCalculator.path);
    } catch (error) {
      console.error('Error saving email:', error);
      throw error;
    }
  };

  return (
    <>
      <CalculatorPopup />

      {/* Bannière */}
      <section className="relative isolate overflow-hidden">
        <HeroPhoto />
        <div className="relative mx-auto flex min-h-[420px] max-w-7xl items-center px-4 py-14 sm:min-h-[520px] sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="inline-block rounded-full bg-white/90 px-4 py-1.5 text-sm font-extrabold text-forest-700">
              Pour les futurs propriétaires
            </span>
            <h1 className="mt-5 text-4xl font-extrabold leading-tight text-white sm:text-5xl lg:text-6xl">
              Immobilier sans prise de tête,
              <span className="block text-sun-200">votre projet en toute sérénité</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/90 sm:text-xl">
              Un guide pas à pas pour votre premier achat et des calculettes gratuites pour chiffrer votre projet.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/achat" className="btn btn-primary">Je commence mon parcours</Link>
              <button type="button" onClick={() => handleCalculatorClick("Achat", "/calculateurs")} className="btn bg-white text-forest-700 hover:bg-primary-50">
                Simuler mon prêt
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Calculettes */}
      <section className="mx-auto max-w-7xl px-4 pb-6 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-extrabold text-forest-800 sm:text-3xl">Chiffrez votre projet</h2>
        <p className="mt-1 text-gray-600">Gratuit, sans engagement, résultat en quelques secondes.</p>

        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <article className="rounded-3xl bg-white p-6 transition-shadow hover:shadow-lg">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-100 text-forest-700">
              <CalculatorIcon className="h-6 w-6" aria-hidden="true" />
            </span>
            <h3 className="mt-4 text-xl font-extrabold text-forest-800">Acheter : combien puis-je emprunter ?</h3>
            <p className="mt-2 text-gray-600">
              Votre capacité d&apos;emprunt, vos mensualités et le prix maximum d&apos;un bien. Idéal pour un premier achat.
            </p>
            <button
              type="button"
              onClick={() => handleCalculatorClick("Achat", "/calculateurs")}
              className="mt-5 inline-flex items-center gap-2 font-extrabold text-primary-700 hover:text-primary-800"
            >
              Ouvrir la calculette <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
            </button>
          </article>

          <article className="rounded-3xl bg-white p-6 transition-shadow hover:shadow-lg">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-sun-100 text-sun-700">
              <ChartBarIcon className="h-6 w-6" aria-hidden="true" />
            </span>
            <h3 className="mt-4 text-xl font-extrabold text-forest-800">Investir : quelle rentabilité ?</h3>
            <p className="mt-2 text-gray-600">
              Rentabilité brute et nette, cash-flow mensuel et impact des impôts sur un investissement locatif.
            </p>
            <button
              type="button"
              onClick={() => handleCalculatorClick("Locatif", "/calculette-locative")}
              className="mt-5 inline-flex items-center gap-2 font-extrabold text-primary-700 hover:text-primary-800"
            >
              Ouvrir la calculette <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
            </button>
          </article>

          <article className="rounded-3xl bg-white/70 p-6 transition-shadow hover:shadow-lg sm:col-span-2 lg:col-span-1">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-cream-200 text-forest-800">
              <BanknotesIcon className="h-6 w-6" aria-hidden="true" />
            </span>
            <h3 className="mt-4 text-xl font-extrabold text-forest-800">Pour aller plus loin : le viager</h3>
            <p className="mt-2 text-gray-600">Estimez la rentabilité d&apos;un investissement en viager.</p>
            <button
              type="button"
              onClick={() => handleCalculatorClick("Viager", "/calculette-viager")}
              className="mt-5 inline-flex items-center gap-2 font-extrabold text-primary-700 hover:text-primary-800"
            >
              Ouvrir la calculette <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
            </button>
          </article>
        </div>
      </section>

      {/* Le parcours */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-extrabold text-forest-800 sm:text-3xl">Votre parcours en huit étapes</h2>
        <p className="mt-1 text-gray-600">De votre budget aux clés, avec les pièges à éviter à chaque étape.</p>

        <ol className="mt-6 flex flex-wrap gap-3">
          {ETAPES.map((etape) => (
            <li key={etape.slug}>
              <Link
                href={`/achat/${etape.slug}`}
                className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2.5 font-bold text-forest-800 transition-colors hover:bg-primary-100"
              >
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary-500 text-sm font-extrabold text-white">
                  {etape.numero}
                </span>
                {etape.titre}
              </Link>
            </li>
          ))}
        </ol>

        <div className="mt-8">
          <Link href="/achat" className="btn btn-primary">Lire le guide complet</Link>
        </div>
      </section>

      {/* Email Popup */}
      <EmailPopup
        isOpen={showEmailPopup}
        onClose={() => setShowEmailPopup(false)}
        onSubmit={handleEmailSubmit}
        targetCalculator={targetCalculator.name}
      />
    </>
  );
}
