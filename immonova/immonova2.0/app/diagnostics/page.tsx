import Navigation from "../components/Navigation";

export default function Diagnostics() {
  const diagnostics = [
    {
      name: "Diagnostic de Performance Énergétique (DPE)",
      validity: "10 ans",
      cost: "150€ - 250€",
      description: "Évalue la consommation d'énergie et l'impact en termes d'émission de gaz à effet de serre.",
      required: "Obligatoire pour toute vente ou location."
    },
    {
      name: "Diagnostic Amiante",
      validity: "Illimitée si négatif, 3 ans si positif",
      cost: "100€ - 200€",
      description: "Détecte la présence d'amiante dans les matériaux de construction.",
      required: "Obligatoire pour les logements construits avant juillet 1997."
    },
    {
      name: "Diagnostic Plomb (CREP)",
      validity: "1 an si positif (vente), 6 ans si positif (location), illimitée si négatif",
      cost: "150€ - 300€",
      description: "Détecte la présence de plomb dans les peintures.",
      required: "Obligatoire pour les logements construits avant 1949."
    },
    {
      name: "Diagnostic Termites",
      validity: "6 mois",
      cost: "100€ - 200€",
      description: "Détecte la présence de termites et autres insectes xylophages.",
      required: "Obligatoire dans les zones définies par arrêté préfectoral."
    },
    {
      name: "Diagnostic Gaz",
      validity: "3 ans",
      cost: "100€ - 150€",
      description: "Évalue l'état des installations intérieures de gaz de plus de 15 ans.",
      required: "Obligatoire pour les logements dont l'installation a plus de 15 ans."
    },
    {
      name: "Diagnostic Électricité",
      validity: "3 ans",
      cost: "100€ - 150€",
      description: "Évalue l'état des installations électriques de plus de 15 ans.",
      required: "Obligatoire pour les logements dont l'installation a plus de 15 ans."
    },
    {
      name: "État des Risques et Pollutions (ERP)",
      validity: "6 mois",
      cost: "50€ - 100€",
      description: "Informe sur les risques naturels, miniers, technologiques, sismiques et radon.",
      required: "Obligatoire dans certaines zones définies par arrêté."
    }
  ];

  return (
    <div className="min-h-screen bg-[#131316] text-white">
      <Navigation />
      
      <div className="pt-20 p-8 sm:p-20">
        <section className="max-w-5xl mx-auto mt-10">
          <h1 className="text-4xl font-bold mb-6 text-center">Diagnostics Techniques Obligatoires</h1>
          <p className="text-xl text-gray-300 text-center mb-12">
            Découvrez les diagnostics obligatoires pour la vente de votre bien, leurs délais de validité et leurs coûts moyens.
          </p>
          
          <div className="space-y-6">
            {diagnostics.map((diagnostic, index) => (
              <div key={index} className="bg-[#1e1e24] p-6 rounded-lg">
                <h3 className="text-2xl font-bold mb-2 text-blue-400">{diagnostic.name}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  <div>
                    <p className="mb-1"><span className="font-bold text-gray-300">Validité:</span> {diagnostic.validity}</p>
                    <p className="mb-1"><span className="font-bold text-gray-300">Coût moyen:</span> {diagnostic.cost}</p>
                    <p className="mb-1"><span className="font-bold text-gray-300">Obligatoire:</span> {diagnostic.required}</p>
                  </div>
                  <div>
                    <p className="text-gray-300">{diagnostic.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 bg-blue-900 p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-4">Besoin d'aide pour vos diagnostics ?</h3>
            <p className="mb-4">
              Nous pouvons vous mettre en relation avec des diagnostiqueurs certifiés dans votre région.
            </p>
            <button className="bg-white text-blue-900 px-6 py-3 rounded-lg font-bold hover:bg-gray-200 transition">
              Demander un devis gratuit
            </button>
          </div>
        </section>
      </div>
    </div>
  );
} 