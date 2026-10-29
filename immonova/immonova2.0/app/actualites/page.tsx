"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { NewspaperIcon, HomeIcon, BanknotesIcon, CalendarIcon } from '@heroicons/react/24/outline';

// Types pour les articles
interface Article {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  author: string;
  category: 'tendances' | 'financement' | 'conseils';
  image: string;
  source?: string;
}

export default function ActualitesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);

  // Simuler le chargement d'articles depuis une API
  useEffect(() => {
    // Données d'actualités (simulant une API)
    const actualites: Article[] = [
      {
        id: 1,
        title: "Marché immobilier 2025 : Une baisse des prix qui s'atténue",
        excerpt: "Les prix des logements anciens baissent pour le quatrième trimestre consécutif mais la tendance s'atténue progressivement.",
        content: "En France métropolitaine, les prix des logements anciens baissent pour le quatrième trimestre consécutif sur un an, à -5 % au 2e trimestre 2025. Les prix diminuent au même rythme pour les appartements et les maisons. D'après les projections sur les avant-contrats, la baisse annuelle des prix des logements anciens en France métropolitaine devrait s'atténuer progressivement de manière significative avec -2,6 % à fin novembre 2025. Ce ralentissement serait plus rapide pour les appartements (-2,2 %) que pour les maisons (-2,9 %). \n\nEn province, les prix des logements anciens reculent sur un an de -4,3 % au 2e trimestre 2025. La baisse des prix se maintient au même rythme pour les maisons (-4,4 % après -4,4 %) que pour les appartements (-3,8 % après -3,9 %). Les projections prévoient un ralentissement de la baisse annuelle 2025, avec -1,9 % à fin novembre 2025. Elle serait d'environ -1 % pour les appartements et -2 % pour les maisons.",
        date: "30 janvier 2025",
        author: "Notaires de France",
        category: "tendances",
        image: "/images/news-prices.svg"
      },
      {
        id: 2,
        title: "Volume des transactions : Vers une reprise du marché",
        excerpt: "Le marché immobilier semble entamer sa fin de cycle baissier après deux années de chute brutale.",
        content: "Le volume de transactions de logements anciens en cumul sur les douze derniers mois en France (hors Mayotte) atteint 780000 transactions à fin janvier 2025. La baisse annuelle est désormais de 18,1 % et, pour le deuxième mois consécutif, sous les 20 %. Les ventes représentent 2,1 % du stock de logements, une part en baisse depuis le point haut du 3e trimestre 2021 (3,2 %) et désormais inférieure au niveau du début des années 2000, avant la crise économique de 2008. Au rythme actuel et prenant en compte que la baisse ralentit, l'année devrait se terminer au-dessus des 700000 transactions, ce qui reste un point bas jamais atteint depuis mai 2015.\n\nLe marché immobilier semble enfin entamer sa fin de cycle baissier après deux années de chute brutale et vertigineuse du haut des 1,2 million de transactions atteint en août 2021. Un optimisme, certes mesuré, est désormais de rigueur dans l'approche d'un marché qui reste malgré tout gouverné par les taux de crédit.",
        date: "20 janvier 2025",
        author: "ImmoNova Analyses",
        category: "tendances",
        image: "/images/news-transactions.svg"
      },
      {
        id: 3,
        title: "Crédit immobilier : Baisse des taux et hausse des approbations",
        excerpt: "La production de crédits à l'habitat montre une nette tendance de reprise depuis décembre 2024.",
        content: "La production CVS de crédits à l'habitat (hors renégociations) s'établit à 9,3 Mds€ en janvier, s'inscrivant toujours dans une nette tendance de reprise depuis le creux de 6,9 Mds€ en décembre 2024 (8,6 Mds€ en novembre et 11,3 Mds€ en octobre). Le taux d'intérêt moyen des nouveaux crédits à l'habitat poursuit son repli, 3,59 % en janvier après 3,64 % en décembre pour les opérations hors renégociations, et revient légèrement en dessous de son niveau d'il y a un an (3,62 % en janvier 2024).\n\nLe recours quasi-systématique à des taux immobiliers fixes non révisables continue de sécuriser les emprunteurs français ainsi que les créances et les gages des banques de réseau nationales. L'utilisation de la marge de flexibilité des banques vis-à-vis de la norme HCSF reste à 15 %, sensiblement inférieure à l'enveloppe globale de 20 % laissée aux banques pour y déroger.",
        date: "15 février 2025",
        author: "Banque de France",
        category: "financement",
        image: "/images/news-credit.svg"
      },
      {
        id: 4,
        title: "Extension du PTZ à tout le territoire : Une opportunité pour les primo-accédants",
        excerpt: "Le Premier ministre annonce l'extension du Prêt à Taux Zéro à l'ensemble du territoire français.",
        content: "L'extension, annoncée par le Premier ministre, du PTZ à tout le territoire pourrait permettre d'aider un grand nombre de primo-accédants, en zones tendues et détendues. Mais, dans un contexte budgétaire contraint, l'extension de ce prêt aidé aura un coût non négligeable. Par ailleurs, la maison individuelle devrait rester exclue dans un mouvement de densification entamé depuis 20 ans.\n\nIl conviendra d'attendre de connaître les conditions d'octroi, mais l'extension de ce prêt ne pourrait in fine ne bénéficier qu'aux promoteurs sur les petites copropriétés en périurbain, ce qui est également de nature à freiner l'accès à la propriété des jeunes familles. Cette mesure s'inscrit dans une volonté de relancer le marché immobilier, particulièrement pour aider les jeunes ménages à devenir propriétaires.",
        date: "10 janvier 2025",
        author: "ImmoNova Analyses",
        category: "financement",
        image: "/images/news-ptz.svg"
      },
      {
        id: 5,
        title: "Disparités régionales : l'Île-de-France plus touchée que la province",
        excerpt: "Les prix en Île-de-France continuent de baisser plus fortement que dans les régions provinciales.",
        content: "En Île-de-France, les prix des logements anciens continuent de baisser fortement pour atteindre -7,2 % au 2e trimestre 2025. Ils baissent plus pour les maisons (-8 % après -8,3 %) que pour les appartements (-6,7 % après -7,9 %). Les prix des appartements continuent de baisser nettement sur un an à Paris (-6,7 %), en petite couronne (-7,4 %) et en grande couronne (-5,5 %). À fin novembre 2025, les prix des appartements devraient encore baisser de 3,9 % en Île-de-France.\n\nOn attend des évolutions annuelles de prix très proches entre Paris et la petite couronne (respectivement -4,5 % et -4,3 %). La baisse ne serait plus que de 1,8 % pour les appartements en grande couronne en novembre. À Paris, le prix des appartements anciens devrait stagner à 9 430 €/m² en novembre. Cette différence marquée entre l'Île-de-France et la province illustre les dynamiques spécifiques des marchés régionaux.",
        date: "5 février 2025",
        author: "Notaires de France",
        category: "tendances",
        image: "/images/news-regions.svg"
      },
      {
        id: 6,
        title: "Performance énergétique : Un critère de plus en plus déterminant",
        excerpt: "Les biens éco-performants conservent leur valeur tandis que les passoires thermiques subissent une décote importante.",
        content: "L'efficacité énergétique est devenue un facteur déterminant dans les décisions d'achat immobilier en 2025. Les propriétés avec des ratings énergétiques élevés (A ou B) commandent désormais une prime sur le marché, avec des prix supérieurs de 5 à 7% par rapport aux biens similaires moins performants énergétiquement.\n\nÀ l'inverse, les logements classés F ou G, souvent appelés 'passoires thermiques', subissent une décote significative et connaissent des délais de vente nettement plus longs. Cette tendance s'explique par les nouvelles réglementations limitant progressivement la location des biens les moins performants et par la prise de conscience accrue des acheteurs concernant les coûts énergétiques et l'impact environnemental de leur logement.\n\nPour les propriétaires, investir dans la rénovation énergétique n'est plus seulement une question écologique mais également financière, avec un retour sur investissement de plus en plus rapide grâce à la valorisation du bien.",
        date: "28 janvier 2025",
        author: "ImmoNova Analyses",
        category: "conseils",
        image: "/images/news-energy.svg"
      },
      {
        id: 7,
        title: "BCE : Nouvelle baisse des taux directeurs favorable au marché immobilier",
        excerpt: "La Banque centrale européenne réduit ses taux directeurs pour la première fois en 2025.",
        content: "La Banque centrale européenne (BCE) a annoncé le 17 janvier 2025 une nouvelle baisse de ses taux directeurs, la première cette année. Les taux d'intérêt de la facilité de dépôt, des opérations principales de refinancement et de la facilité de prêt marginal sont ramenés à respectivement 3,25 %, 3,40 % et 3,65 % à compter du 23 janvier 2025.\n\nCette décision est favorable au marché immobilier car elle contribue à la baisse des taux de crédit immobilier proposés par les banques. L'inflation globale s'établirait en moyenne à 2,5 % en 2025 selon les prévisions. Les décisions successives de la Banque centrale européenne de baisser ses taux directeurs ainsi que la remise sous tension des organismes bancaires sont porteuses d'espoir, permettant à un nombre toujours plus grand de Français de retourner sur le marché.",
        date: "18 janvier 2025",
        author: "Banque Centrale Européenne",
        category: "financement",
        image: "/images/news-bce.svg"
      }
    ];

    setArticles(actualites);
    setIsLoading(false);
  }, []);

  // Filtrer les articles en fonction de l'onglet actif
  const filteredArticles = activeTab === 'all' 
    ? articles 
    : articles.filter(article => article.category === activeTab);

  // Gérer le changement d'onglet
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Actualités immobilières</h1>
        <p className="text-lg text-gray-600">Restez informé des dernières tendances du marché immobilier et des conseils d'experts.</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <>
          {/* Filtres par catégorie */}
          <Tabs defaultValue="all" onValueChange={handleTabChange} className="mb-8">
            <TabsList className="flex space-x-2 mb-6 bg-gray-100 p-1 rounded-lg overflow-x-auto">
              <TabsTrigger value="all" className="flex-1 py-2 px-4 rounded-md">
                <span className="flex items-center justify-center">
                  <NewspaperIcon className="h-5 w-5 mr-2" />
                  Toutes les actualités
                </span>
              </TabsTrigger>
              <TabsTrigger value="tendances" className="flex-1 py-2 px-4 rounded-md">
                <span className="flex items-center justify-center">
                  <HomeIcon className="h-5 w-5 mr-2" />
                  Tendances du marché
                </span>
              </TabsTrigger>
              <TabsTrigger value="financement" className="flex-1 py-2 px-4 rounded-md">
                <span className="flex items-center justify-center">
                  <BanknotesIcon className="h-5 w-5 mr-2" />
                  Financement
                </span>
              </TabsTrigger>
              <TabsTrigger value="conseils" className="flex-1 py-2 px-4 rounded-md">
                <span className="flex items-center justify-center">
                  <HomeIcon className="h-5 w-5 mr-2" />
                  Conseils pratiques
                </span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredArticles.map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            </TabsContent>
            <TabsContent value="tendances" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredArticles.map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            </TabsContent>
            <TabsContent value="financement" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredArticles.map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            </TabsContent>
            <TabsContent value="conseils" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredArticles.map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
}

// Composant pour afficher un article
function ArticleCard({ article }: { article: Article }) {
  return (
    <Link href={`/actualites/${article.id}`}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
        <div className="relative h-48 overflow-hidden">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
          <div className="absolute top-4 right-4 bg-primary-600 text-white text-xs font-semibold py-1 px-2 rounded">
            {article.category === 'tendances' ? 'Tendances marché' : 
             article.category === 'financement' ? 'Financement' : 'Conseils pratiques'}
          </div>
        </div>
        <div className="p-5 flex-grow flex flex-col">
          <div className="flex items-center text-gray-500 text-sm mb-3">
            <CalendarIcon className="h-4 w-4 mr-1" />
            <span>{article.date}</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{article.title}</h3>
          <p className="text-gray-600 text-sm mb-4 flex-grow">{article.excerpt}</p>
          <div className="flex justify-between items-center mt-auto">
            <span className="text-xs text-gray-500">Par {article.author}</span>
            <span className="text-primary-600 text-sm font-medium">Lire la suite →</span>
          </div>
        </div>
      </div>
    </Link>
  );
} 