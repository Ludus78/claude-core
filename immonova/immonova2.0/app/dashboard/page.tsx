"use client";

import { useState } from 'react';
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import Image from 'next/image';
import Link from 'next/link';
import SavedSimulations from '../components/dashboard/SavedSimulations';
import { 
  HomeIcon, 
  UserIcon, 
  CalculatorIcon, 
  ChartBarIcon,
  NewspaperIcon,
  DocumentTextIcon,
  BookmarkIcon
} from '@heroicons/react/24/outline';

export default function Dashboard() {
  const { user } = useKindeBrowserClient();

  // Outils disponibles sur le site
  const availableTools = [
    { id: 1, title: 'Calculer achat', href: '/calculette', icon: <CalculatorIcon className="h-6 w-6 text-white" />, color: 'bg-primary-600', description: 'Calculez votre capacité d\'emprunt et simulez votre achat immobilier' },
    { id: 2, title: 'Simuler locatif', href: '/calculette-locative', icon: <ChartBarIcon className="h-6 w-6 text-white" />, color: 'bg-green-600', description: 'Évaluez la rentabilité de votre investissement locatif' },
    { id: 3, title: 'Calculer viager', href: '/calculette-viager', icon: <CalculatorIcon className="h-6 w-6 text-white" />, color: 'bg-amber-600', description: 'Estimez les modalités de votre investissement en viager' },
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header du dashboard - Réduction du padding vertical */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 bg-gradient-to-r from-primary-600 to-primary-500 p-4 rounded-lg shadow-lg text-white">
          <div>
            <h1 className="text-3xl font-bold">
              Bienvenue, {user?.given_name || 'utilisateur'}
            </h1>
            <p className="mt-2 text-primary-100">
              Votre espace personnel ImmoNova
            </p>
          </div>
          <div className="flex items-center gap-4 mt-4 sm:mt-0">
            <div className="w-16 h-16 rounded-full bg-white p-1 shadow-md flex items-center justify-center">
              {user?.picture ? (
                <Image
                  src={user.picture}
                  alt="Avatar"
                  width={60}
                  height={60}
                  className="rounded-full"
                />
              ) : (
                <UserIcon className="h-8 w-8 text-primary-600" />
              )}
            </div>
          </div>
        </div>

        {/* Actualités immobilières - Réduction de la marge inférieure, padding, hauteur image et gaps */}
        <div className="bg-white shadow rounded-lg mb-6 p-4 border-t-4 border-primary-600">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Actualités immobilières</h2>
          <div className="flex flex-col md:flex-row items-center gap-4 mb-2">
            {/* Image Section - Hauteur réduite davantage */}
            <div className="w-full md:w-1/3 h-32 relative rounded-lg overflow-hidden shadow-md">
              <Image 
                src="/images/news-prices.svg" 
                alt="Tendances des prix" 
                fill 
                style={{objectFit: 'cover'}} 
                className="transform hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                <div className="p-3 text-white">
                  <h3 className="font-bold text-md">Marché immobilier 2025</h3>
                  <p className="text-xs">Une baisse des prix qui s'atténue</p>
                </div>
              </div>
            </div>
            <div className="w-full md:w-2/3 flex flex-col gap-3">
              <p className="text-gray-600 text-sm">
                Restez informé des dernières tendances du marché immobilier avec nos analyses détaillées. Nos experts décryptent pour vous l'évolution des prix, les nouvelles mesures gouvernementales et les prévisions du secteur.
              </p>
              <Link
                href="/actualites"
                className="inline-flex items-center self-start px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Consulter les actualités
                <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        {/* Calculatrices */}
        <div className="bg-white shadow rounded-lg mb-6 p-6 border-t-4 border-primary-600">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Calculettes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableTools.map((tool) => (
              <div key={tool.id} className="bg-gradient-to-br from-gray-50 to-white rounded-lg p-6 hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-primary-300 transform hover:-translate-y-1">
                <div className="flex items-center mb-4">
                  <div className={`w-12 h-12 ${tool.color} rounded-lg flex items-center justify-center mr-4 shadow-md`}>
                    {tool.icon}
                  </div>
                  <h3 className="font-semibold text-gray-900">{tool.title}</h3>
                </div>
                <p className="text-gray-600 text-sm mb-4">{tool.description}</p>
                <Link
                  href={tool.href}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Utiliser maintenant
                  <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Simulations sauvegardées */}
        <div className="bg-white shadow rounded-lg mb-6 p-6 border-t-4 border-primary-600">
          <div className="flex items-center mb-4">
            <BookmarkIcon className="h-6 w-6 text-primary-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-800">Simulations sauvegardées</h2>
          </div>
          <SavedSimulations />
        </div>

        {/* Documents essentiels - Section en bas */}
        <div className="bg-white shadow rounded-lg p-6 border-t-4 border-primary-600">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Documents essentiels</h2>
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="bg-gradient-to-br from-gray-50 to-white rounded-lg p-6 hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-primary-300 transform hover:-translate-y-1 w-full">
              <div className="flex items-center mb-4">
                <div className="p-3 bg-primary-100 rounded-lg mr-3 shadow-sm">
                  <DocumentTextIcon className="h-6 w-6 text-primary-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Documents essentiels</h3>
              </div>
              <p className="text-gray-600 text-sm mb-4">Accédez aux documents nécessaires pour vos démarches immobilières, incluant modèles de contrats, guides juridiques et fiches pratiques.</p>
              <Link
                href="/documents"
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-primary-700 bg-primary-100 rounded-md hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Consulter
                <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}