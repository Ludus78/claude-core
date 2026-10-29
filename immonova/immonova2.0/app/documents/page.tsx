"use client";

import { useState } from 'react';
import { Tab } from '@headlessui/react';
import { DocumentTextIcon, DocumentCheckIcon, DocumentDuplicateIcon } from '@heroicons/react/24/outline';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

interface Document {
  id: string;
  name: string;
  description: string;
  category: string;
  forBuyer: boolean;
  forSeller: boolean;
}

const documents: Document[] = [
  // Documents d'identité
  {
    id: 'id-card',
    name: 'Pièce d\'identité',
    description: 'Carte d\'identité ou passeport en cours de validité',
    category: 'Identité',
    forBuyer: true,
    forSeller: true,
  },
  {
    id: 'family-book',
    name: 'Livret de famille',
    description: 'Si marié ou avec enfants',
    category: 'Identité',
    forBuyer: true,
    forSeller: true,
  },
  {
    id: 'marriage-contract',
    name: 'Contrat de mariage',
    description: 'Si applicable',
    category: 'Identité',
    forBuyer: true,
    forSeller: true,
  },

  // Documents financiers
  {
    id: 'payslips',
    name: 'Bulletins de salaire',
    description: 'Les 3 derniers mois',
    category: 'Finance',
    forBuyer: true,
    forSeller: false,
  },
  {
    id: 'tax-notice',
    name: 'Avis d\'imposition',
    description: 'Les 2 derniers avis',
    category: 'Finance',
    forBuyer: true,
    forSeller: false,
  },
  {
    id: 'bank-statements',
    name: 'Relevés bancaires',
    description: 'Les 3 derniers mois',
    category: 'Finance',
    forBuyer: true,
    forSeller: false,
  },

  // Documents du bien
  {
    id: 'property-title',
    name: 'Titre de propriété',
    description: 'Acte de propriété complet',
    category: 'Bien immobilier',
    forBuyer: false,
    forSeller: true,
  },
  {
    id: 'property-tax',
    name: 'Taxe foncière',
    description: 'Dernier avis de taxe foncière',
    category: 'Bien immobilier',
    forBuyer: false,
    forSeller: true,
  },
  {
    id: 'energy-audit',
    name: 'Diagnostic énergétique',
    description: 'DPE et audit énergétique si applicable',
    category: 'Bien immobilier',
    forBuyer: false,
    forSeller: true,
  },
  {
    id: 'condo-docs',
    name: 'Documents de copropriété',
    description: 'Règlement, PV d\'AG, appels de fonds',
    category: 'Bien immobilier',
    forBuyer: false,
    forSeller: true,
  },

  // Documents de prêt
  {
    id: 'loan-offer',
    name: 'Offre de prêt',
    description: 'Proposition de financement de la banque',
    category: 'Financement',
    forBuyer: true,
    forSeller: false,
  },
  {
    id: 'insurance-quote',
    name: 'Devis assurance',
    description: 'Devis d\'assurance emprunteur',
    category: 'Financement',
    forBuyer: true,
    forSeller: false,
  }
];

export default function Documents() {
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  const [projectType, setProjectType] = useState<'buy' | 'sell'>('buy');

  const categories = Array.from(new Set(documents.map(doc => doc.category)));

  const toggleDocument = (docId: string) => {
    setSelectedDocuments(prev =>
      prev.includes(docId)
        ? prev.filter(id => id !== docId)
        : [...prev, docId]
    );
  };

  const filteredDocuments = documents.filter(doc =>
    projectType === 'buy' ? doc.forBuyer : doc.forSeller
  );

  const documentsByCategory = categories.map(category => ({
    category,
    documents: filteredDocuments.filter(doc => doc.category === category)
  }));

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Documents essentiels</h1>
          <p className="mt-2 text-gray-600">
            Sélectionnez les documents nécessaires pour votre projet immobilier
          </p>
        </div>

        {/* Sélection du type de projet */}
        <div className="mb-8">
          <Tab.Group>
            <Tab.List className="flex space-x-1 rounded-xl bg-primary-900/20 p-1">
              <Tab
                className={({ selected }) =>
                  classNames(
                    'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                    'ring-white ring-opacity-60 ring-offset-2 ring-offset-primary-400 focus:outline-none focus:ring-2',
                    selected
                      ? 'bg-white text-primary-700 shadow'
                      : 'text-gray-600 hover:bg-white/[0.12] hover:text-primary-600'
                  )
                }
                onClick={() => setProjectType('buy')}
              >
                Achat immobilier
              </Tab>
              <Tab
                className={({ selected }) =>
                  classNames(
                    'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                    'ring-white ring-opacity-60 ring-offset-2 ring-offset-primary-400 focus:outline-none focus:ring-2',
                    selected
                      ? 'bg-white text-primary-700 shadow'
                      : 'text-gray-600 hover:bg-white/[0.12] hover:text-primary-600'
                  )
                }
                onClick={() => setProjectType('sell')}
              >
                Vente immobilière
              </Tab>
            </Tab.List>
          </Tab.Group>
        </div>

        {/* Liste des documents par catégorie */}
        <div className="space-y-6">
          {documentsByCategory.map(({ category, documents }) => documents.length > 0 && (
            <div key={category} className="bg-white shadow rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b">
                <h2 className="text-lg font-semibold text-gray-900">{category}</h2>
              </div>
              <div className="divide-y divide-gray-200">
                {documents.map((doc) => (
                  <div key={doc.id} className="p-6">
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id={doc.id}
                          type="checkbox"
                          checked={selectedDocuments.includes(doc.id)}
                          onChange={() => toggleDocument(doc.id)}
                          className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                        />
                      </div>
                      <div className="ml-3">
                        <label htmlFor={doc.id} className="text-sm font-medium text-gray-700">
                          {doc.name}
                        </label>
                        <p className="text-sm text-gray-500">{doc.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Résumé des documents sélectionnés */}
        {selectedDocuments.length > 0 && (
          <div className="mt-8 bg-primary-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-primary-900 mb-4">
              Documents sélectionnés ({selectedDocuments.length})
            </h3>
            <ul className="space-y-2">
              {selectedDocuments.map(docId => {
                const doc = documents.find(d => d.id === docId);
                return doc && (
                  <li key={docId} className="flex items-center text-primary-700">
                    <DocumentCheckIcon className="h-5 w-5 mr-2" />
                    {doc.name}
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
} 