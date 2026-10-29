import Image from "next/image";
import Link from "next/link";
import MainLayout from "./components/layout/MainLayout";
import { FaHome, FaListAlt, FaBookOpen, FaCalculator, FaMapMarkedAlt, FaUsers, FaChartLine } from 'react-icons/fa';

export default function Home() {
  // Features based on user stories
  const features = [
    {
      icon: FaListAlt,
      title: "Checklists personnalisées",
      description: "Des checklists interactives pour vendeurs et acheteurs pour ne rien oublier dans votre projet immobilier",
      link: "/checklist"
    },
    {
      icon: FaBookOpen,
      title: "Glossaire immobilier",
      description: "Un lexique complet des termes immobiliers pour comprendre le jargon utilisé",
      link: "/glossary"
    },
    {
      icon: FaChartLine,
      title: "Estimation de biens",
      description: "Obtenez une estimation détaillée de votre bien basée sur des comparables récents",
      link: "/property-estimate"
    },
    {
      icon: FaCalculator,
      title: "Simulation de prêt",
      description: "Simulez votre capacité d'emprunt avec des explications claires pour définir votre budget",
      link: "/loan-calculator"
    },
    {
      icon: FaMapMarkedAlt,
      title: "Information quartiers",
      description: "Visualisez les espaces verts, écoles et services à proximité de votre futur logement",
      link: "/neighborhood-info"
    },
    {
      icon: FaUsers,
      title: "Annuaire de professionnels",
      description: "Une liste de professionnels recommandés dans votre quartier pour faciliter votre installation",
      link: "/professional-directory"
    }
  ];

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8 items-center">
            <div className="mb-12 lg:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Votre projet immobilier simplifié
              </h1>
              <p className="text-xl mb-6">
                ImmoNova vous accompagne à chaque étape de votre parcours immobilier, que vous soyez vendeur ou acquéreur.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Link href="/checklist" className="bg-white text-indigo-600 px-6 py-3 rounded-lg font-medium hover:bg-indigo-50 transition duration-300">
                  Je suis acheteur
                </Link>
                <Link href="/property-estimate" className="border border-white text-white px-6 py-3 rounded-lg font-medium hover:bg-white/10 transition duration-300">
                  Je suis vendeur
                </Link>
              </div>
            </div>
            <div className="hidden lg:block relative h-64 lg:h-96">
              <div className="absolute inset-0 bg-white/10 rounded-xl backdrop-blur-sm shadow-lg">
                <div className="p-6">
                  <div className="bg-white/20 w-full h-12 rounded-lg mb-4"></div>
                  <div className="bg-white/20 w-3/4 h-12 rounded-lg mb-4"></div>
                  <div className="bg-white/20 w-full h-32 rounded-lg mb-4"></div>
                  <div className="flex space-x-4">
                    <div className="bg-white/20 w-1/2 h-12 rounded-lg"></div>
                    <div className="bg-white/20 w-1/2 h-12 rounded-lg"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent"></div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Des outils adaptés à vos besoins
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              Découvrez comment ImmoNova peut vous aider dans votre projet immobilier
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <div key={index} className="bg-gray-50 rounded-lg shadow-sm p-6 hover:shadow-md transition duration-300">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 mb-4">
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 mb-4">{feature.description}</p>
                <Link href={feature.link} className="text-indigo-600 font-medium hover:text-indigo-700 flex items-center">
                  Découvrir
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Ils nous font confiance</h2>
            <p className="mt-4 text-xl text-gray-600">Découvrez les témoignages de nos utilisateurs</p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center">
                  <span className="text-indigo-800 font-bold">M</span>
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold">Marie L.</h4>
                  <p className="text-gray-600 text-sm">Primo-accédante</p>
                </div>
              </div>
              <p className="text-gray-600">
                "Le questionnaire personnalisé m'a vraiment aidée à comprendre ce dont j'avais besoin. Le parcours guidé était parfait pour une première acquisition."
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center">
                  <span className="text-indigo-800 font-bold">P</span>
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold">Pierre D.</h4>
                  <p className="text-gray-600 text-sm">Vendeur</p>
                </div>
              </div>
              <p className="text-gray-600">
                "La checklist des documents obligatoires m'a permis de gagner un temps précieux et d'être sûr de ne rien oublier. Je recommande !"
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center">
                  <span className="text-indigo-800 font-bold">S</span>
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold">Sophie et Jean M.</h4>
                  <p className="text-gray-600 text-sm">Famille avec enfants</p>
                </div>
              </div>
              <p className="text-gray-600">
                "L'outil de visualisation des écoles et espaces verts nous a convaincus. Nous avons trouvé le quartier idéal pour notre famille !"
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-indigo-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Prêt à démarrer votre projet immobilier ?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Que vous soyez à la recherche de votre premier logement, ou que vous souhaitiez vendre votre bien, nous sommes là pour vous accompagner à chaque étape.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link href="/dashboard" className="bg-white text-indigo-600 px-8 py-4 rounded-lg font-medium hover:bg-indigo-50 transition duration-300">
              Commencer maintenant
            </Link>
            <Link href="#" className="border border-white text-white px-8 py-4 rounded-lg font-medium hover:bg-white/10 transition duration-300">
              En savoir plus
            </Link>
          </div>
    </div>
      </section>
    </MainLayout>
  );
}
