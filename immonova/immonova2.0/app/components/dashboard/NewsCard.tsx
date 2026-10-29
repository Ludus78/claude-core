import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaCalendarAlt, FaTag } from 'react-icons/fa';
import { NewsArticle } from '@/app/hooks/useNews';

// Définition des couleurs de catégories
const categoryColors: Record<string, string> = {
  'marché': 'bg-blue-100 text-blue-800',
  'financement': 'bg-green-100 text-green-800',
  'législation': 'bg-purple-100 text-purple-800',
  'tendances': 'bg-orange-100 text-orange-800',
  'conseils': 'bg-teal-100 text-teal-800',
  'default': 'bg-gray-100 text-gray-800'
};

interface NewsCardProps {
  article: NewsArticle;
  isAdmin?: boolean;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export default function NewsCard({ article, isAdmin, onEdit, onDelete }: NewsCardProps) {
  const { id, title, excerpt, category, formattedDate, imageUrl } = article;
  
  const categoryColor = categoryColors[category.toLowerCase()] || categoryColors.default;
  
  // Assure-toi que formattedDate existe, sinon, crée une date formatée à partir de publishedAt
  const displayDate = formattedDate || (article.publishedAt ? new Date(article.publishedAt).toLocaleDateString('fr-FR') : 'Date inconnue');
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Image d'en-tête */}
      <div className="relative h-48 w-full">
        <Image
          src={imageUrl || '/images/default-news.jpg'}
          alt={title}
          fill
          className="object-cover"
        />
      </div>
      
      <div className="p-4">
        {/* Catégorie et date */}
        <div className="flex justify-between items-center mb-2">
          <span className={`${categoryColor} text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center`}>
            <FaTag className="mr-1" size={10} />
            {category}
          </span>
          <span className="text-xs text-gray-500 flex items-center">
            <FaCalendarAlt className="mr-1" size={10} />
            {displayDate}
          </span>
        </div>
        
        {/* Titre */}
        <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">{title}</h3>
        
        {/* Résumé */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-3">{excerpt}</p>
        
        {/* Actions */}
        <div className="flex justify-between items-center">
          <Link 
            href={`/actualites/${id}`}
            className="text-primary-600 hover:text-primary-800 text-sm font-medium"
          >
            Lire plus
          </Link>
          
          {isAdmin && (
            <div className="flex space-x-2">
              <button
                onClick={() => onEdit && onEdit(id)}
                className="text-xs bg-blue-50 text-blue-700 py-1 px-2 rounded hover:bg-blue-100"
              >
                Modifier
              </button>
              <button
                onClick={() => onDelete && onDelete(id)}
                className="text-xs bg-red-50 text-red-700 py-1 px-2 rounded hover:bg-red-100"
              >
                Supprimer
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 