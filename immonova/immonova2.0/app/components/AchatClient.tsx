'use client';

import Link from 'next/link';
import { useState } from 'react';

import { FaHome, FaChartLine, FaTools, FaClipboardCheck, FaMoneyBillWave } from 'react-icons/fa';

const AchatClient = () => {


  const articles = [
    {
      id: "preparation-achat",
      title: "Préparation de votre projet d'achat",
      description: "Découvrez les étapes clés pour bien préparer votre projet d'achat immobilier.",
      icon: <FaHome className="w-6 h-6" />,
      color: "bg-blue-500",
      content: (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="space-y-4 text-gray-600">
              <div>
                <h4 className="font-medium mb-2">1. Définir votre budget</h4>
                <p>Avant de commencer vos recherches, il est essentiel de :</p>
                <ul className="ml-6 mt-2 space-y-1">
                  <li>• Évaluer votre capacité d'emprunt</li>
                  <li>• Prendre en compte les frais de notaire et de dossier</li>
                  <li>• Prévoir un budget pour les travaux éventuels</li>
                  <li>• Considérer les charges de copropriété</li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium mb-2">2. Choisir votre localisation</h4>
                <p>La localisation est un critère essentiel :</p>
                <ul className="ml-6 mt-2 space-y-1">
                  <li>• Proximité des transports et commerces</li>
                  <li>• Qualité des écoles et services</li>
                  <li>• Dynamisme du quartier</li>
                  <li>• Perspectives d'évolution</li>
                </ul>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Conseil d'expert :</strong> N'hésitez pas à visiter plusieurs fois le quartier à différents moments de la journée pour vous faire une idée précise de l'ambiance et de la qualité de vie.
                </p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "financement",
      title: "Le financement de votre projet",
      description: "Comprenez les différentes options de financement et les aides disponibles.",
      icon: <FaMoneyBillWave className="w-6 h-6" />,
      color: "bg-green-500",
      content: (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="space-y-4 text-gray-600">
              <div>
                <h4 className="font-medium mb-2">Les différentes options de financement</h4>
                <ul className="ml-6 mt-2 space-y-1">
                  <li>• Prêt immobilier classique</li>
                  <li>• Prêt à taux zéro (PTZ)</li>
                  <li>• Prêt action logement</li>
                  <li>• Prêt relais (si vous vendez un bien)</li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium mb-2">Les aides disponibles</h4>
                <ul className="ml-6 mt-2 space-y-1">
                  <li>• Aides locales (selon les régions)</li>
                  <li>• Aides pour les primo-accédants</li>
                  <li>• Aides pour les travaux de rénovation</li>
                  <li>• Réductions fiscales</li>
                </ul>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-green-800">
                  <strong>À savoir :</strong> Le taux d'endettement maximum est généralement de 35% de vos revenus. N'oubliez pas de prendre en compte les charges de copropriété et les impôts locaux dans votre calcul.
                </p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-12">
        <div className="mb-8">
          <Link href="/" className="flex items-center text-indigo-700 hover:underline mb-4">
            <span className="mr-1">←</span> Retour à l'accueil
          </Link>
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-800">Guide de l'achat immobilier</h1>
          </div>
          <p className="text-gray-600 mt-2">Découvrez nos conseils et guides pour réussir votre projet d'achat immobilier</p>
        </div>

        <div className="grid gap-6">
          {articles.map((article) => (
            <div 
              key={article.id}

              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
            >
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 ${article.color} rounded-full flex items-center justify-center text-white`}>
                    {article.icon}
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">{article.title}</h2>
                    <p className="text-gray-600 mb-4">{article.description}</p>
                  </div>
                </div>
                <div className="mt-4">
                  {article.content}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </main>
  );
};

export default AchatClient; 