'use client';

import { useState } from 'react';
import MainLayout from '../components/layout/MainLayout';
import { FaSearch } from 'react-icons/fa';

type GlossaryTerm = {
  id: string;
  term: string;
  definition: string;
  category: 'achat' | 'vente' | 'financement' | 'technique' | 'juridique';
};

export default function GlossaryPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const glossaryTerms: GlossaryTerm[] = [
    // Achat
    { 
      id: '1', 
      term: 'Compromis de vente', 
      definition: 'Contrat par lequel un vendeur s\'engage à vendre un bien immobilier à un acheteur qui s\'engage à l\'acheter. Il précède l\'acte authentique.', 
      category: 'achat' 
    },
    { 
      id: '2', 
      term: 'Acte authentique', 
      definition: 'Acte rédigé par un notaire qui officialise la vente d\'un bien immobilier. Il est signé par le vendeur et l\'acheteur.', 
      category: 'achat' 
    },
    { 
      id: '3', 
      term: 'Frais de notaire', 
      definition: 'Ensemble des frais liés à l\'acquisition d\'un bien immobilier, incluant les droits d\'enregistrement, les émoluments du notaire et les frais divers.', 
      category: 'achat' 
    },
    
    // Vente
    { 
      id: '4', 
      term: 'Mandat de vente', 
      definition: 'Contrat par lequel un propriétaire confie à un agent immobilier la mission de trouver un acquéreur pour son bien.', 
      category: 'vente' 
    },
    { 
      id: '5', 
      term: 'Acompte', 
      definition: 'Somme versée par l\'acheteur au moment de la signature du compromis de vente, généralement égale à 5 à 10% du prix de vente.', 
      category: 'vente' 
    },
    { 
      id: '6', 
      term: 'Plus-value immobilière', 
      definition: 'Profit réalisé lors de la revente d\'un bien immobilier à un prix supérieur à son prix d\'achat, potentiellement soumis à une taxation.', 
      category: 'vente' 
    },
    
    // Financement
    { 
      id: '7', 
      term: 'Taux d\'endettement', 
      definition: 'Rapport entre les charges de remboursement d\'un emprunt et les revenus de l\'emprunteur, généralement plafonné à 33% par les banques.', 
      category: 'financement' 
    },
    { 
      id: '8', 
      term: 'Prêt amortissable', 
      definition: 'Prêt dont le capital est remboursé progressivement par mensualités, comprenant également le versement des intérêts.', 
      category: 'financement' 
    },
    { 
      id: '9', 
      term: 'Prêt à taux fixe', 
      definition: 'Prêt dont le taux d\'intérêt reste constant pendant toute la durée du crédit.', 
      category: 'financement' 
    },
    
    // Technique
    { 
      id: '10', 
      term: 'DPE', 
      definition: 'Diagnostic de Performance Énergétique, document obligatoire qui évalue la consommation d\'énergie et l\'impact en termes d\'émissions de gaz à effet de serre d\'un logement.', 
      category: 'technique' 
    },
    { 
      id: '11', 
      term: 'Pleine propriété', 
      definition: 'Droit de propriété complet sur un bien immobilier, incluant l\'usufruit (droit d\'usage) et la nue-propriété.', 
      category: 'technique' 
    },
    { 
      id: '12', 
      term: 'Superficie Carrez', 
      definition: 'Surface privative d\'un lot de copropriété, calculée selon la loi Carrez, excluant les surfaces dont la hauteur est inférieure à 1,80m.', 
      category: 'technique' 
    },
    
    // Juridique
    { 
      id: '13', 
      term: 'Servitude', 
      definition: 'Charge imposée à une propriété pour l\'usage et l\'utilité d\'une autre propriété, comme un droit de passage.', 
      category: 'juridique' 
    },
    { 
      id: '14', 
      term: 'Copropriété', 
      definition: 'Régime juridique dans lequel chaque propriétaire possède un lot (appartement, cave, etc.) et une quote-part des parties communes.', 
      category: 'juridique' 
    },
    { 
      id: '15', 
      term: 'Droit de préemption', 
      definition: 'Droit légal permettant à certaines personnes ou entités d\'acheter un bien en priorité avant toute autre personne.', 
      category: 'juridique' 
    },
  ];

  const categories = [
    { id: 'achat', name: 'Achat' },
    { id: 'vente', name: 'Vente' },
    { id: 'financement', name: 'Financement' },
    { id: 'technique', name: 'Technique' },
    { id: 'juridique', name: 'Juridique' },
  ];

  const filteredTerms = glossaryTerms.filter(term => {
    const matchesSearch = term.term.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         term.definition.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory ? term.category === activeCategory : true;
    return matchesSearch && matchesCategory;
  });

  // Group terms alphabetically
  const groupedTerms = filteredTerms.reduce<Record<string, GlossaryTerm[]>>((acc, term) => {
    const firstLetter = term.term[0].toUpperCase();
    if (!acc[firstLetter]) {
      acc[firstLetter] = [];
    }
    acc[firstLetter].push(term);
    return acc;
  }, {});

  // Sort letters
  const sortedLetters = Object.keys(groupedTerms).sort();

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Glossaire Immobilier</h1>
            <p className="text-gray-600 mb-8">
              Ce lexique vous aide à comprendre les termes techniques utilisés dans le domaine immobilier.
            </p>

            <div className="mb-8">
              <div className="relative">
                <input
                  type="text"
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Rechercher un terme..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <FaSearch className="absolute left-3 top-3 text-gray-400" />
              </div>
            </div>

            <div className="mb-8 flex flex-wrap gap-2">
              <button
                onClick={() => setActiveCategory(null)}
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  activeCategory === null
                    ? 'bg-indigo-100 text-indigo-800'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                Tous
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium ${
                    activeCategory === category.id
                      ? 'bg-indigo-100 text-indigo-800'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>

            {filteredTerms.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-gray-500">Aucun terme trouvé pour cette recherche.</p>
              </div>
            ) : (
              <div>
                {sortedLetters.map((letter) => (
                  <div key={letter} className="mb-8">
                    <h2 className="text-xl font-bold text-indigo-700 mb-4 border-b border-indigo-200 pb-2">
                      {letter}
                    </h2>
                    <dl className="space-y-6">
                      {groupedTerms[letter].map((term) => (
                        <div key={term.id} className="bg-gray-50 p-4 rounded-lg">
                          <dt className="text-lg font-semibold text-gray-900 mb-1 flex items-center">
                            {term.term}
                            <span className="ml-2 text-xs font-normal px-2 py-1 rounded-full bg-indigo-100 text-indigo-800">
                              {categories.find(cat => cat.id === term.category)?.name}
                            </span>
                          </dt>
                          <dd className="text-gray-700">{term.definition}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mt-10 bg-indigo-50 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-indigo-900 mb-4">
            Ne restez pas dans le flou
          </h2>
          <p className="text-indigo-700 mb-4">
            N'hésitez pas à demander des éclaircissements à votre agent immobilier ou à votre notaire sur les termes que vous ne comprenez pas.
          </p>
          <p className="text-indigo-700">
            La compréhension des termes immobiliers est essentielle pour prendre des décisions éclairées lors de votre projet d'achat ou de vente.
          </p>
        </div>
      </div>
    </MainLayout>
  );
} 