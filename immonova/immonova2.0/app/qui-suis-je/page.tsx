import { Metadata } from 'next';
import Link from 'next/link';
import ProfileImage from '../components/ProfileImage';

export const metadata: Metadata = {
  title: 'Qui suis-je ? | Immonova',
  description: 'Expert immobilier avec plus de 10 ans d\'expérience dans le secteur',
};

export default function QuiSuisJe() {
  return (
    <div className="bg-gray-50 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête de la page */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Qui suis-je ?</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Expert immobilier avec plus de 10 ans d'expérience dans le secteur
          </p>
        </div>

        {/* Photo et introduction */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-12">
          <div className="md:flex">
            <div className="md:flex-shrink-0 flex items-center justify-center bg-primary-50 md:w-64 p-6">
              <ProfileImage />
            </div>
            <div className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Ludovic DENIS</h2>
              <p className="text-md text-gray-600 mb-4">
                Expert immobilier avec une solide expérience en conseil, transaction et financement
              </p>
              <p className="text-gray-700">
                Riche d'une expérience de plus de 10 ans dans différentes facettes du secteur immobilier, je mets mon expertise 
                au service de vos projets avec une approche personnalisée et pragmatique.
              </p>
            </div>
          </div>
        </div>

        {/* Parcours professionnel */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-2">Mon parcours professionnel</h2>
          
          {/* Résumé de l'expérience */}
          <div className="mb-8">
            <p className="text-gray-700 mb-6">
              Au cours de ma carrière, j'ai exercé différents métiers complémentaires dans l'immobilier :
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-primary-50 p-6 rounded-lg">
                <h3 className="font-semibold text-primary-700 mb-2">Financement immobilier</h3>
                <p className="text-gray-700">J'ai accompagné de nombreux clients dans leurs recherches de financement avec expertise en analyse financière et négociation des meilleures conditions de prêt.</p>
              </div>
              
              <div className="bg-primary-50 p-6 rounded-lg">
                <h3 className="font-semibold text-primary-700 mb-2">Transaction immobilière</h3>
                <p className="text-gray-700">Plusieurs années d'expérience en tant qu'agent immobilier m'ont permis de développer une connaissance approfondie du marché et des techniques de négociation performantes.</p>
              </div>
              
              <div className="bg-primary-50 p-6 rounded-lg">
                <h3 className="font-semibold text-primary-700 mb-2">Gestion locative</h3>
                <p className="text-gray-700">Au fil des années, j'ai développé une expertise pratique dans le domaine immobilier en achetant et rénovant entièrement deux biens de A à Z. De la recherche du bien idéal aux travaux de rénovation en passant par la gestion des coûts et des prestataires, j'ai acquis une solide expérience sur chaque étape du processus. J'ai appris à évaluer le potentiel d'un bien, à optimiser son aménagement et à gérer les imprévus liés aux chantiers.</p>
              </div>
            </div>
          </div>

          {/* Expérience familiale */}
          <div className="mb-8 mt-10">
            <div className="flex flex-wrap justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-primary-700">Tradition et innovation</h3>
            </div>
            <p className="text-gray-700 mb-4">
              Issu d'une famille active dans l'immobilier, j'ai travaillé pendant plusieurs années avec mon père qui gère un patrimoine 
              immobilier familial et exerce en tant que courtier en travaux. Cette collaboration m'a permis d'acquérir une 
              vision globale et pratique du secteur, alliant tradition familiale et approches modernes. Cette double 
              perspective nourrit aujourd'hui ma pratique professionnelle et les conseils que je prodigue.
            </p>
          </div>
          
          {/* Réussites */}
          <div className="mt-8 p-6 bg-gray-50 rounded-lg">
            <h3 className="text-xl font-semibold text-primary-700 mb-4">Quelques réalisations</h3>
            <ul className="list-disc pl-5 text-gray-700 space-y-2">
              <li>Accompagnement de plus de 200 clients dans leurs projets immobiliers</li>
              <li>Développement d'une méthode personnalisée d'analyse et de conseil</li>
              <li>Plusieurs records de performance commerciale dans mes fonctions précédentes</li>
            </ul>
          </div>
        </div>

        {/* Valeurs et approche */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-2">Ma philosophie</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-primary-50 p-6 rounded-lg">
              <h3 className="font-semibold text-primary-700 mb-2">Accompagnement personnalisé</h3>
              <p className="text-gray-700">Chaque client est unique avec ses propres besoins et contraintes. Je m'adapte à chaque situation pour proposer les solutions les plus pertinentes.</p>
            </div>
            <div className="bg-primary-50 p-6 rounded-lg">
              <h3 className="font-semibold text-primary-700 mb-2">Transparence</h3>
              <p className="text-gray-700">Je m'engage à fournir des informations claires et complètes pour permettre à mes clients de prendre des décisions éclairées.</p>
            </div>
            <div className="bg-primary-50 p-6 rounded-lg">
              <h3 className="font-semibold text-primary-700 mb-2">Expertise globale</h3>
              <p className="text-gray-700">Ma polyvalence dans différents métiers de l'immobilier me permet d'offrir une vision complète et des conseils pertinents sur l'ensemble du processus d'acquisition.</p>
            </div>
          </div>
        </div>

        {/* Appel à l'action */}
        <div className="text-center">
          <p className="text-gray-700 mb-6">
            Vous avez un projet immobilier ? Je serais ravi de mettre mon expérience à votre service.
          </p>
          <Link 
            href="/contact" 
            className="inline-block bg-primary-600 text-white px-8 py-4 rounded-md font-medium hover:bg-primary-700 transition-colors"
          >
            Me contacter
          </Link>
        </div>
      </div>
    </div>
  );
} 