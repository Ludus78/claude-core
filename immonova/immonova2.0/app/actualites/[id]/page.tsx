"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaCalendarAlt, FaTag, FaArrowLeft, FaUser } from 'react-icons/fa';
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { ArrowLeftIcon, CalendarIcon, ShareIcon } from '@heroicons/react/24/outline';

type NewsArticle = {
  id: string;
  title: string;
  excerpt: string;
  content?: string;
  category: string;
  publishedAt?: Date | string;
  formattedDate?: string;
  authorName?: string;
  imageUrl?: string;
};

export default function ArticleDetail() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useKindeBrowserClient();
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<NewsArticle[]>([]);
  
  // Vérifier si l'utilisateur est admin
  const isAdmin = user?.email === "admin@immonova.fr";
  
  useEffect(() => {
    const fetchArticle = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Simuler le chargement d'articles depuis une API
        const actualites = [
          {
            id: "1",
            title: "Marché immobilier 2025 : Une baisse des prix qui s'atténue",
            excerpt: "Les prix des logements anciens baissent pour le quatrième trimestre consécutif mais la tendance s'atténue progressivement.",
            content: "En France métropolitaine, les prix des logements anciens baissent pour le quatrième trimestre consécutif sur un an, à -5 % au 2e trimestre 2025. Les prix diminuent au même rythme pour les appartements et les maisons. D'après les projections sur les avant-contrats, la baisse annuelle des prix des logements anciens en France métropolitaine devrait s'atténuer progressivement de manière significative avec -2,6 % à fin novembre 2025. Ce ralentissement serait plus rapide pour les appartements (-2,2 %) que pour les maisons (-2,9 %). \n\nEn province, les prix des logements anciens reculent sur un an de -4,3 % au 2e trimestre 2025. La baisse des prix se maintient au même rythme pour les maisons (-4,4 % après -4,4 %) que pour les appartements (-3,8 % après -3,9 %). Les projections prévoient un ralentissement de la baisse annuelle 2025, avec -1,9 % à fin novembre 2025. Elle serait d'environ -1 % pour les appartements et -2 % pour les maisons.",
            category: "tendances",
            publishedAt: "2025-01-30",
            formattedDate: "30 janvier 2025",
            authorName: "Notaires de France",
            imageUrl: "/images/news-prices.svg",
          },
          {
            id: "2",
            title: "Volume des transactions : Vers une reprise du marché",
            excerpt: "Le marché immobilier semble entamer sa fin de cycle baissier après deux années de chute brutale.",
            content: "Le volume de transactions de logements anciens en cumul sur les douze derniers mois en France (hors Mayotte) atteint 780000 transactions à fin janvier 2025. La baisse annuelle est désormais de 18,1 % et, pour le deuxième mois consécutif, sous les 20 %. Les ventes représentent 2,1 % du stock de logements, une part en baisse depuis le point haut du 3e trimestre 2021 (3,2 %) et désormais inférieure au niveau du début des années 2000, avant la crise économique de 2008. Au rythme actuel et prenant en compte que la baisse ralentit, l'année devrait se terminer au-dessus des 700000 transactions, ce qui reste un point bas jamais atteint depuis mai 2015.\n\nLe marché immobilier semble enfin entamer sa fin de cycle baissier après deux années de chute brutale et vertigineuse du haut des 1,2 million de transactions atteint en août 2021. Un optimisme, certes mesuré, est désormais de rigueur dans l'approche d'un marché qui reste malgré tout gouverné par les taux de crédit.",
            category: "tendances",
            publishedAt: "2025-01-20",
            formattedDate: "20 janvier 2025",
            authorName: "ImmoNova Analyses",
            imageUrl: "/images/news-transactions.svg",
          },
          {
            id: "3",
            title: "Crédit immobilier : Baisse des taux et hausse des approbations",
            excerpt: "La production de crédits à l'habitat montre une nette tendance de reprise depuis décembre 2024.",
            content: "La production CVS de crédits à l'habitat (hors renégociations) s'établit à 9,3 Mds€ en janvier, s'inscrivant toujours dans une nette tendance de reprise depuis le creux de 6,9 Mds€ en décembre 2024 (8,6 Mds€ en novembre et 11,3 Mds€ en octobre). Le taux d'intérêt moyen des nouveaux crédits à l'habitat poursuit son repli, 3,59 % en janvier après 3,64 % en décembre pour les opérations hors renégociations, et revient légèrement en dessous de son niveau d'il y a un an (3,62 % en janvier 2024).\n\nLe recours quasi-systématique à des taux immobiliers fixes non révisables continue de sécuriser les emprunteurs français ainsi que les créances et les gages des banques de réseau nationales. L'utilisation de la marge de flexibilité des banques vis-à-vis de la norme HCSF reste à 15 %, sensiblement inférieure à l'enveloppe globale de 20 % laissée aux banques pour y déroger.",
            category: "financement",
            publishedAt: "2025-02-15",
            formattedDate: "15 février 2025",
            authorName: "Banque de France",
            imageUrl: "/images/news-credit.svg",
          },
          {
            id: "4",
            title: "Extension du PTZ à tout le territoire : Une opportunité pour les primo-accédants",
            excerpt: "Le Premier ministre annonce l'extension du Prêt à Taux Zéro à l'ensemble du territoire français.",
            content: "L'extension, annoncée par le Premier ministre, du PTZ à tout le territoire pourrait permettre d'aider un grand nombre de primo-accédants, en zones tendues et détendues. Mais, dans un contexte budgétaire contraint, l'extension de ce prêt aidé aura un coût non négligeable. Par ailleurs, la maison individuelle devrait rester exclue dans un mouvement de densification entamé depuis 20 ans.\n\nIl conviendra d'attendre de connaître les conditions d'octroi, mais l'extension de ce prêt ne pourrait in fine ne bénéficier qu'aux promoteurs sur les petites copropriétés en périurbain, ce qui est également de nature à freiner l'accès à la propriété des jeunes familles. Cette mesure s'inscrit dans une volonté de relancer le marché immobilier, particulièrement pour aider les jeunes ménages à devenir propriétaires.",
            category: "financement",
            publishedAt: "2025-01-10",
            formattedDate: "10 janvier 2025",
            authorName: "ImmoNova Analyses",
            imageUrl: "/images/news-ptz.svg",
          },
          {
            id: "5",
            title: "Disparités régionales : l'Île-de-France plus touchée que la province",
            excerpt: "Les prix en Île-de-France continuent de baisser plus fortement que dans les régions provinciales.",
            content: "En Île-de-France, les prix des logements anciens continuent de baisser fortement pour atteindre -7,2 % au 2e trimestre 2025. Ils baissent plus pour les maisons (-8 % après -8,3 %) que pour les appartements (-6,7 % après -7,9 %). Les prix des appartements continuent de baisser nettement sur un an à Paris (-6,7 %), en petite couronne (-7,4 %) et en grande couronne (-5,5 %). À fin novembre 2025, les prix des appartements devraient encore baisser de 3,9 % en Île-de-France.\n\nOn attend des évolutions annuelles de prix très proches entre Paris et la petite couronne (respectivement -4,5 % et -4,3 %). La baisse ne serait plus que de 1,8 % pour les appartements en grande couronne en novembre. À Paris, le prix des appartements anciens devrait stagner à 9 430 €/m² en novembre. Cette différence marquée entre l'Île-de-France et la province illustre les dynamiques spécifiques des marchés régionaux.",
            category: "tendances",
            publishedAt: "2025-02-05",
            formattedDate: "5 février 2025",
            authorName: "Notaires de France",
            imageUrl: "/images/news-regions.svg",
          },
          {
            id: "6",
            title: "Performance énergétique : Un critère de plus en plus déterminant",
            excerpt: "Les biens éco-performants conservent leur valeur tandis que les passoires thermiques subissent une décote importante.",
            content: "L'efficacité énergétique est devenue un facteur déterminant dans les décisions d'achat immobilier en 2025. Les propriétés avec des ratings énergétiques élevés (A ou B) commandent désormais une prime sur le marché, avec des prix supérieurs de 5 à 7% par rapport aux biens similaires moins performants énergétiquement.\n\nÀ l'inverse, les logements classés F ou G, souvent appelés 'passoires thermiques', subissent une décote significative et connaissent des délais de vente nettement plus longs. Cette tendance s'explique par les nouvelles réglementations limitant progressivement la location des biens les moins performants et par la prise de conscience accrue des acheteurs concernant les coûts énergétiques et l'impact environnemental de leur logement.\n\nPour les propriétaires, investir dans la rénovation énergétique n'est plus seulement une question écologique mais également financière, avec un retour sur investissement de plus en plus rapide grâce à la valorisation du bien.",
            category: "conseils",
            publishedAt: "2025-01-28",
            formattedDate: "28 janvier 2025",
            authorName: "ImmoNova Analyses",
            imageUrl: "/images/news-energy.svg",
          },
          {
            id: "7",
            title: "BCE : Nouvelle baisse des taux directeurs favorable au marché immobilier",
            excerpt: "La Banque centrale européenne réduit ses taux directeurs pour la première fois en 2025.",
            content: "La Banque centrale européenne (BCE) a annoncé le 17 janvier 2025 une nouvelle baisse de ses taux directeurs, la première cette année. Les taux d'intérêt de la facilité de dépôt, des opérations principales de refinancement et de la facilité de prêt marginal sont ramenés à respectivement 3,25 %, 3,40 % et 3,65 % à compter du 23 janvier 2025.\n\nCette décision est favorable au marché immobilier car elle contribue à la baisse des taux de crédit immobilier proposés par les banques. L'inflation globale s'établirait en moyenne à 2,5 % en 2025 selon les prévisions. Les décisions successives de la Banque centrale européenne de baisser ses taux directeurs ainsi que la remise sous tension des organismes bancaires sont porteuses d'espoir, permettant à un nombre toujours plus grand de Français de retourner sur le marché.",
            category: "financement",
            publishedAt: "2025-01-18",
            formattedDate: "18 janvier 2025",
            authorName: "Banque Centrale Européenne",
            imageUrl: "/images/news-bce.svg",
          }
        ];

        const foundArticle = actualites.find(a => a.id === id);
        
        if (!foundArticle) {
          throw new Error("Article non trouvé");
        }
        
        setArticle(foundArticle);
        
        // Filtrer les articles connexes
        const relatedArticles = actualites.filter(a => 
          a.category === foundArticle.category && a.id !== foundArticle.id
        ).slice(0, 3);
        
        setRelatedArticles(relatedArticles);
      } catch (err) {
        console.error("Erreur lors de la récupération de l'article:", err);
        setError("Nous n'avons pas pu charger l'article demandé. Veuillez réessayer plus tard.");
      } finally {
        setIsLoading(false);
      }
    };
    
    if (id) {
      fetchArticle();
    }
  }, [id]);
  
  const handleDelete = async () => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cet article ?")) return;
    
    try {
      const response = await fetch(`/api/news/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error("Impossible de supprimer l'article");
      }
      
      // Rediriger vers le dashboard après la suppression
      router.push('/dashboard?tab=actualites');
    } catch (err) {
      console.error("Erreur lors de la suppression:", err);
      alert("Une erreur est survenue lors de la suppression de l'article");
    }
  };
  
  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-500">Chargement de l'article...</p>
        </div>
      </div>
    );
  }
  
  if (error || !article) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Article introuvable</h1>
          <p className="text-gray-600 mb-6">{error || "L'article que vous recherchez n'existe pas ou a été supprimé."}</p>
          <Link 
            href="/dashboard?tab=actualites" 
            className="inline-flex items-center text-primary-600 hover:text-primary-800"
          >
            <FaArrowLeft className="mr-2" />
            Retour aux actualités
          </Link>
        </div>
      </div>
    );
  }
  
  // Définition des couleurs de catégories
  const categoryColors: Record<string, string> = {
    'marché': 'bg-blue-100 text-blue-800',
    'financement': 'bg-green-100 text-green-800',
    'législation': 'bg-purple-100 text-purple-800',
    'réglementation': 'bg-purple-100 text-purple-800',
    'tendances': 'bg-orange-100 text-orange-800',
    'investissement': 'bg-amber-100 text-amber-800', 
    'conseils': 'bg-teal-100 text-teal-800',
    'default': 'bg-gray-100 text-gray-800'
  };
  
  const categoryColor = categoryColors[article.category.toLowerCase()] || categoryColors.default;
  
  return (
    <div className="max-w-5xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      {/* Lien de retour */}
      <div className="mb-8">
        <Link 
          href="/actualites" 
          className="inline-flex items-center text-primary-600 hover:text-primary-700"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Retour aux actualités
        </Link>
      </div>
      
      <article className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Image d'en-tête */}
        <div className="relative h-64 w-full overflow-hidden">
          <img
            src={article.imageUrl || '/images/default-news.jpg'}
            alt={article.title}
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="p-6 md:p-8">
          {/* Méta-informations */}
          <div className="flex flex-wrap items-center justify-between mb-4">
            <span className={`${categoryColor} text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center mb-2 md:mb-0`}>
              <FaTag className="mr-1" size={10} />
              {article.category}
            </span>
            
            <div className="flex items-center space-x-4">
              {article.authorName && (
                <span className="text-sm text-gray-600 flex items-center">
                  <FaUser className="mr-1" size={12} />
                  {article.authorName}
                </span>
              )}
              
              <span className="text-sm text-gray-600 flex items-center">
                <FaCalendarAlt className="mr-1" size={12} />
                {article.formattedDate || 
                 (typeof article.publishedAt === 'string' 
                  ? new Date(article.publishedAt).toLocaleDateString('fr-FR') 
                  : article.publishedAt instanceof Date 
                  ? article.publishedAt.toLocaleDateString('fr-FR') 
                  : 'Date inconnue')}
              </span>
            </div>
          </div>
          
          {/* Titre */}
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">{article.title}</h1>
          
          {/* Résumé */}
          <div className="text-lg text-gray-700 font-medium mb-6 italic">
            {article.excerpt}
          </div>
          
          {/* Contenu */}
          <div className="prose prose-lg max-w-none text-gray-700">
            {article.content ? (
              <div dangerouslySetInnerHTML={{ __html: article.content.replace(/\n/g, '<br />') }} />
            ) : (
              <p>{article.excerpt}</p>
            )}
          </div>
          
          {/* Actions admin */}
          {isAdmin && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex justify-end space-x-4">
                <Link
                  href={`/dashboard?tab=actualites&edit=${article.id}`}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Modifier l'article
                </Link>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Supprimer
                </button>
              </div>
            </div>
          )}
        </div>
      </article>

      {/* Articles connexes */}
      {relatedArticles.length > 0 && (
        <div className="border-t border-gray-200 pt-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Articles connexes</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedArticles.map((relatedArticle) => (
              <Link key={relatedArticle.id} href={`/actualites/${relatedArticle.id}`}>
                <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
                  <div className="relative h-40 overflow-hidden">
                    <img
                      src={relatedArticle.imageUrl || '/images/default-news.jpg'}
                      alt={relatedArticle.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4 flex-grow">
                    <h3 className="text-md font-semibold text-gray-900 mb-2">{relatedArticle.title}</h3>
                    <p className="text-gray-500 text-xs">{relatedArticle.formattedDate || 
                     (typeof relatedArticle.publishedAt === 'string' 
                      ? new Date(relatedArticle.publishedAt).toLocaleDateString('fr-FR') 
                      : relatedArticle.publishedAt instanceof Date 
                      ? relatedArticle.publishedAt.toLocaleDateString('fr-FR') 
                      : 'Date inconnue')}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 