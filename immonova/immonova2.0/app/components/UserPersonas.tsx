import React from 'react';

interface PersonaProps {
  role: string;
  description: string;
}

const PersonaCard = ({ role, description }: PersonaProps) => {
  return (
    <div className="bg-[#1e1e24] p-5 rounded-lg text-white mb-5 max-w-md w-full shadow-lg hover:bg-[#24242c] transition-colors duration-200">
      <p className="text-sm leading-relaxed font-medium">{description}</p>
    </div>
  );
};

export default function UserPersonas() {
  const personas = [
    {
      role: "Senior",
      description: "En tant que senior peu à l'aise avec la technologie, je veux accéder à une interface simplifiée avec une police lisible et des instructions claires, afin de naviguer facilement."
    },
    {
      role: "Vendeur novice",
      description: "En tant que vendeur novice, je veux comprendre les diagnostics techniques obligatoires avec leurs délais et coûts moyens, afin de m'organiser."
    },
    {
      role: "Vendeur",
      description: "En tant que vendeur, je veux générer une checklist personnalisée des documents obligatoires à fournir, afin de me conformer à la législation."
    },
    {
      role: "Propriétaire",
      description: "En tant que propriétaire, je veux recevoir des conseils de mise en valeur spécifiques à mon bien, afin d'optimiser son attractivité."
    },
    {
      role: "Vendeur débutant",
      description: "En tant que vendeur débutant, je veux une estimation détaillée de mon bien basée sur des comparables récents, afin de fixer un prix juste."
    }
  ];

  return (
    <div className="flex flex-col items-center w-full max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-8 text-center">Besoins utilisateurs</h2>
      <div className="grid gap-4 w-full">
        {personas.map((persona, index) => (
          <PersonaCard key={index} role={persona.role} description={persona.description} />
        ))}
      </div>
    </div>
  );
} 