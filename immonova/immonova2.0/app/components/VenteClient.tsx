'use client';

import { useState } from "react";
import Link from "next/link";
import { FaHome, FaChartLine, FaTools, FaClipboardCheck, FaMoneyBillWave } from "react-icons/fa";


const VenteClient = () => {


  const articles = [
    {
      id: "preparation-vente",
      title: "Préparation de votre bien à la vente",
      description: "Découvrez les étapes clés pour mettre en valeur votre bien et maximiser son prix de vente.",
      icon: <FaHome className="w-6 h-6" />,
      color: "bg-blue-500",
      content: (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="space-y-4 text-gray-600">
              <div>
                <h4 className="font-medium mb-2">1. Mise en valeur du bien</h4>
                <p>Pour attirer les acheteurs, il est essentiel de :</p>
                <ul className="ml-6 mt-2 space-y-1">
                  <li>• Nettoyer et désencombrer les pièces</li>
                  <li>• Effectuer les petits travaux de rafraîchissement</li>
                  <li>• Optimiser la luminosité</li>
                  <li>• Dépersonnaliser les espaces</li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium mb-2">2. Préparation des documents</h4>
                <p>Rassemblez tous les documents nécessaires :</p>
                <ul className="ml-6 mt-2 space-y-1">
                  <li>• Diagnostics obligatoires</li>
                  <li>• Factures énergétiques</li>
                  <li>• Documents de copropriété</li>
                  <li>• Photos professionnelles</li>
                </ul>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Conseil d'expert :</strong> Un bien bien présenté se vend plus rapidement et à un meilleur prix. N'hésitez pas à investir dans le home staging si nécessaire.
                </p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "estimation",
      title: "Estimation de votre bien",
      description: "Comprenez les facteurs qui influencent la valeur de votre bien et les méthodes d'estimation.",
      icon: <FaMoneyBillWave className="w-6 h-6" />,
      color: "bg-green-500",
      content: (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="space-y-4 text-gray-600">
              <div>
                <h4 className="font-medium mb-2">Facteurs clés de l'estimation</h4>
                <ul className="ml-6 mt-2 space-y-1">
                  <li>• Localisation et accessibilité</li>
                  <li>• Surface et configuration</li>
                  <li>• État général du bien</li>
                  <li>• Performance énergétique</li>
                  <li>• Tendances du marché local</li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium mb-2">Méthodes d'estimation</h4>
                <ul className="ml-6 mt-2 space-y-1">
                  <li>• Analyse comparative</li>
                  <li>• Méthode du revenu</li>
                  <li>• Méthode du coût</li>
                  <li>• Analyse prospective</li>
                </ul>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-green-800">
                  <strong>À savoir :</strong> Depuis les réformes du DPE, la performance énergétique est devenue un facteur déterminant dans la valeur d'un bien. Les "passoires thermiques" subissent une décote importante.
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
            <h1 className="text-3xl font-bold text-gray-800">Guide de la vente immobilière</h1>
          </div>
          <p className="text-gray-600 mt-2">Découvrez nos conseils et guides pour réussir votre projet de vente immobilière</p>
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

export default VenteClient; 