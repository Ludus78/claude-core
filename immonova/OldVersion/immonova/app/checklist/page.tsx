'use client';

import { useState } from 'react';
import Link from 'next/link';
import MainLayout from '../components/layout/MainLayout';
import { FaCheckCircle, FaRegCircle, FaArrowRight, FaFileDownload, FaUser } from 'react-icons/fa';

// Define types for our checklist items
type ChecklistItem = {
  id: string;
  text: string;
  completed: boolean;
};

type ChecklistState = {
  buyer: ChecklistItem[];
  seller: ChecklistItem[];
};

export default function ChecklistPage() {
  const [activeTab, setActiveTab] = useState<'buyer' | 'seller'>('buyer');
  const [checklistItems, setChecklistItems] = useState<ChecklistState>({
    buyer: [
      { id: 'b1', text: 'Définir mon budget maximum', completed: false },
      { id: 'b2', text: 'Contacter ma banque pour une simulation de prêt', completed: false },
      { id: 'b3', text: 'Préparer les documents nécessaires pour un prêt immobilier', completed: false },
      { id: 'b4', text: 'Lister mes critères de recherche (localisation, surface, etc.)', completed: false },
      { id: 'b5', text: 'Rechercher les annonces immobilières correspondant à mes critères', completed: false },
      { id: 'b6', text: 'Planifier des visites de biens', completed: false },
      { id: 'b7', text: 'Vérifier les diagnostics techniques des biens visités', completed: false },
      { id: 'b8', text: 'Se renseigner sur le quartier (écoles, transports, services)', completed: false },
      { id: 'b9', text: 'Faire une offre d\'achat', completed: false },
      { id: 'b10', text: 'Signer un compromis de vente', completed: false },
      { id: 'b11', text: 'Finaliser mon dossier de prêt immobilier', completed: false },
      { id: 'b12', text: 'Souscrire une assurance habitation', completed: false },
      { id: 'b13', text: 'Signer l\'acte authentique chez le notaire', completed: false },
      { id: 'b14', text: 'Effectuer l\'état des lieux', completed: false },
      { id: 'b15', text: 'Mettre en place les contrats (électricité, eau, internet)', completed: false },
    ],
    seller: [
      { id: 's1', text: 'Estimer la valeur de mon bien', completed: false },
      { id: 's2', text: 'Faire réaliser les diagnostics techniques obligatoires', completed: false },
      { id: 's3', text: 'Préparer mon bien pour les visites (rangement, petites réparations)', completed: false },
      { id: 's4', text: 'Rassembler les documents nécessaires à la vente', completed: false },
      { id: 's5', text: 'Définir ma stratégie de vente (particulier ou agence)', completed: false },
      { id: 's6', text: 'Prendre des photos de qualité de mon bien', completed: false },
      { id: 's7', text: 'Rédiger une annonce attractive', completed: false },
      { id: 's8', text: 'Diffuser l\'annonce sur les plateformes immobilières', completed: false },
      { id: 's9', text: 'Organiser et effectuer les visites', completed: false },
      { id: 's10', text: 'Négocier avec les acheteurs potentiels', completed: false },
      { id: 's11', text: 'Accepter une offre d\'achat', completed: false },
      { id: 's12', text: 'Signer un compromis de vente', completed: false },
      { id: 's13', text: 'Préparer les documents pour le notaire', completed: false },
      { id: 's14', text: 'Signer l\'acte authentique chez le notaire', completed: false },
      { id: 's15', text: 'Effectuer l\'état des lieux de sortie', completed: false },
    ],
  });

  const handleCheckItem = (listType: 'buyer' | 'seller', itemId: string) => {
    setChecklistItems({
      ...checklistItems,
      [listType]: checklistItems[listType].map(item => 
        item.id === itemId ? { ...item, completed: !item.completed } : item
      )
    });
  };

  const getProgress = (listType: 'buyer' | 'seller'): number => {
    const completedItems = checklistItems[listType].filter(item => item.completed).length;
    const totalItems = checklistItems[listType].length;
    return Math.round((completedItems / totalItems) * 100);
  };

  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Checklists Immobilières</h1>
            <p className="text-gray-600 mb-8">
              Suivez les étapes importantes de votre projet immobilier et ne laissez rien au hasard. Ces checklists vous aideront à organiser votre parcours d'achat ou de vente.
            </p>

            {/* Tabs */}
            <div className="border-b border-gray-200 mb-8">
              <nav className="flex -mb-px space-x-8">
                <button
                  onClick={() => setActiveTab('buyer')}
                  className={`pb-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                    activeTab === 'buyer'
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <FaUser className="mr-2" />
                  Je suis Acheteur
                </button>
                <button
                  onClick={() => setActiveTab('seller')}
                  className={`pb-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                    activeTab === 'seller'
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <FaUser className="mr-2" />
                  Je suis Vendeur
                </button>
              </nav>
            </div>

            {/* Progress indicator */}
            <div className="mb-8">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Votre progression</span>
                <span className="text-sm font-medium text-indigo-600">{getProgress(activeTab)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-indigo-600 h-2.5 rounded-full" 
                  style={{ width: `${getProgress(activeTab)}%` }}
                ></div>
              </div>
            </div>

            {/* Checklist */}
            <div className="space-y-4">
              {checklistItems[activeTab].map((item) => (
                <div 
                  key={item.id}
                  className={`flex items-start p-4 rounded-lg ${
                    item.completed ? 'bg-green-50' : 'bg-gray-50'
                  }`}
                >
                  <button 
                    onClick={() => handleCheckItem(activeTab, item.id)}
                    className="flex-shrink-0 mt-0.5"
                  >
                    {item.completed ? (
                      <FaCheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <FaRegCircle className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                  <div className="ml-3">
                    <p className={`text-sm font-medium ${
                      item.completed ? 'text-green-800 line-through' : 'text-gray-700'
                    }`}>
                      {item.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-col sm:flex-row justify-between gap-4">
              <Link
                href="#" 
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <FaFileDownload className="mr-2" />
                Télécharger la checklist complète
              </Link>

              <Link
                href={activeTab === 'buyer' ? '/loan-calculator' : '/property-estimate'}
                className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {activeTab === 'buyer' ? 'Simuler mon prêt' : 'Estimer mon bien'}
                <FaArrowRight className="ml-2" />
              </Link>
            </div>
          </div>
        </div>

        {/* Tips Section */}
        <div className="mt-10 bg-indigo-50 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-indigo-900 mb-4">
            Conseils pour {activeTab === 'buyer' ? 'les acheteurs' : 'les vendeurs'}
          </h2>
          <div className="space-y-4">
            {activeTab === 'buyer' ? (
              <>
                <p className="text-indigo-700">
                  ✓ Faites une liste précise de vos critères non négociables avant de commencer vos recherches
                </p>
                <p className="text-indigo-700">
                  ✓ Visitez le quartier à différentes heures de la journée pour mieux l'appréhender
                </p>
                <p className="text-indigo-700">
                  ✓ N'hésitez pas à demander les factures énergétiques pour estimer les coûts réels
                </p>
              </>
            ) : (
              <>
                <p className="text-indigo-700">
                  ✓ Désencombrez et dépersonnalisez votre intérieur pour les visites
                </p>
                <p className="text-indigo-700">
                  ✓ Prenez des photos en journée avec beaucoup de lumière naturelle
                </p>
                <p className="text-indigo-700">
                  ✓ Préparez un dossier complet avec tous les documents techniques pour rassurer les acheteurs
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
} 