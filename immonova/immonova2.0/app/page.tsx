"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import EmailPopup from './components/EmailPopup';
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import CalculatorPopup from './components/CalculatorPopup';

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
      {/* Hero Section */}
      <div className="relative h-[300px] bg-gray-900">
        {/* Image de fond avec un overlay sombre */}
        <div className="absolute inset-0">
          <Image
            src="/images/hero-real-estate.jpg"
            alt="Image immobilier de luxe"
            fill
            style={{ objectFit: 'cover' }}
            quality={100}
            priority
          />
          <div className="absolute inset-0 bg-black opacity-40"></div>
        </div>

        {/* Contenu du hero */}
        <div className="relative max-w-7xl mx-auto py-12 px-4 sm:py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-white sm:text-5xl md:text-6xl">
              <span className="block">ImmoNova</span>
              <span className="block text-primary-300">Votre partenaire immobilier</span>
            </h1>
            <p className="mt-6 max-w-md mx-auto text-base text-gray-200 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            "Immobilier sans prise de tête, votre projet en toute sérénité"
            </p>
          </div>
        </div>
      </div>

      {/* Calculettes Section */}
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Nos calculettes immobilières
          </h2>
          <p className="mt-4 text-lg text-gray-500">
            Des outils gratuits pour estimer vos projets immobiliers
          </p>
        </div>

        <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {/* Calculette d'achat */}
          <div className="bg-white overflow-hidden shadow rounded-lg hover:shadow-xl transition-shadow duration-300">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl p-3">
                  <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-5">
                  <h3 className="text-lg font-medium text-gray-900">Calculette d'achat immobilier</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Estimez votre capacité d'emprunt et le prix maximum d'un bien immobilier
                  </p>
                </div>
              </div>
              <div className="mt-6">
                <button
                  onClick={() => handleCalculatorClick("Achat", "/calculateurs")}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Utiliser la calculette
                </button>
              </div>
            </div>
          </div>

          {/* Calculette locative */}
          <div className="bg-white overflow-hidden shadow rounded-lg hover:shadow-xl transition-shadow duration-300">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl p-3">
                  <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                  </svg>
                </div>
                <div className="ml-5">
                  <h3 className="text-lg font-medium text-gray-900">Calculette d'investissement locatif</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Calculez la rentabilité de votre investissement locatif
                  </p>
                </div>
              </div>
              <div className="mt-6">
                <button
                  onClick={() => handleCalculatorClick("Locatif", "/calculette-locative")}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Utiliser la calculette
                </button>
              </div>
            </div>
          </div>

          {/* Calculette viager */}
          <div className="bg-white overflow-hidden shadow rounded-lg hover:shadow-xl transition-shadow duration-300">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl p-3">
                  <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="ml-5">
                  <h3 className="text-lg font-medium text-gray-900">Calculette d'investissement en viager</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Estimez la rentabilité de votre investissement en viager
                  </p>
                </div>
              </div>
              <div className="mt-6">
                <button
                  onClick={() => handleCalculatorClick("Viager", "/calculette-viager")}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Utiliser la calculette
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Votre projet immobilier, étape par étape
          </h2>
          <p className="mt-4 text-lg text-gray-500">
            Des solutions adaptées à vos besoins
          </p>
        </div>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {/* Achat */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-primary-500 rounded-md p-3">
                  <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div className="ml-5">
                  <h3 className="text-lg font-medium text-gray-900">Acheter un bien</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Guide complet pour l'achat de votre bien immobilier
                  </p>
                </div>
              </div>
              <div className="mt-6">
                <Link href="/achat" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                  En savoir plus
                </Link>
              </div>
            </div>
          </div>

          {/* Vente */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-primary-500 rounded-md p-3">
                  <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div className="ml-5">
                  <h3 className="text-lg font-medium text-gray-900">Vendre un bien</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Conseils et étapes pour vendre votre bien immobilier
                  </p>
                </div>
              </div>
              <div className="mt-6">
                <Link href="/vente" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                  En savoir plus
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

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