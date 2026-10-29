import { useState, useEffect } from 'react';

export type NewsArticle = {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  publishedAt?: Date;
  formattedDate?: string;
  content?: string;
  authorName?: string;
  imageUrl?: string;
  isPublished?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};

export default function useNews() {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Récupérer les actualités
  const fetchNews = async (limit?: number, category?: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Construire les paramètres de requête
      const params = new URLSearchParams();
      if (limit) params.append('limit', limit.toString());
      if (category) params.append('category', category);
      
      console.log('Requête API:', `/api/news?${params.toString()}`);
      const response = await fetch(`/api/news?${params.toString()}`);
      console.log('Statut de la réponse:', response.status, response.statusText);
      
      if (!response.ok) {
        console.error('Réponse non-OK:', response.status, response.statusText);
        const errorText = await response.text();
        console.error('Contenu de la réponse d\'erreur:', errorText);
        throw new Error(`Erreur lors de la récupération des actualités: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Données reçues:', data);
      setNews(data);
      return data;
    } catch (err) {
      console.error('Erreur dans useNews:', err);
      setError(err instanceof Error ? err.message : 'Impossible de charger les actualités');
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  // Récupérer une actualité par son ID
  const fetchNewsById = async (id: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Requête API pour article individuel:', `/api/news/${id}`);
      const response = await fetch(`/api/news/${id}`);
      console.log('Statut de la réponse:', response.status, response.statusText);
      
      if (!response.ok) {
        console.error('Réponse non-OK:', response.status, response.statusText);
        const errorText = await response.text();
        console.error('Contenu de la réponse d\'erreur:', errorText);
        throw new Error(`Erreur lors de la récupération de l'actualité: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Données article reçues:', data);
      return data;
    } catch (err) {
      console.error('Erreur dans fetchNewsById:', err);
      setError(err instanceof Error ? err.message : 'Impossible de charger l\'actualité');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Ajouter une nouvelle actualité
  const addNews = async (article: Omit<NewsArticle, 'id' | 'createdAt' | 'updatedAt' | 'publishedAt' | 'formattedDate'>) => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Ajout d\'article - données envoyées:', article);
      const response = await fetch('/api/news', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(article),
      });
      console.log('Statut de la réponse d\'ajout:', response.status, response.statusText);
      
      if (!response.ok) {
        console.error('Réponse non-OK lors de l\'ajout:', response.status, response.statusText);
        const errorData = await response.json().catch(() => ({}));
        console.error('Données d\'erreur:', errorData);
        throw new Error(errorData.error || `Erreur lors de l'ajout de l'actualité: ${response.status}`);
      }
      
      const newArticle = await response.json();
      console.log('Article ajouté:', newArticle);
      setNews(prev => [newArticle, ...prev]);
      return newArticle;
    } catch (err: any) {
      console.error('Erreur dans addNews:', err);
      setError(err.message || 'Impossible d\'ajouter l\'actualité');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Mettre à jour une actualité
  const updateNews = async (id: string, article: Partial<NewsArticle>) => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Mise à jour d\'article - ID:', id, 'données:', article);
      const response = await fetch(`/api/news/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(article),
      });
      console.log('Statut de la réponse de mise à jour:', response.status, response.statusText);
      
      if (!response.ok) {
        console.error('Réponse non-OK lors de la mise à jour:', response.status, response.statusText);
        const errorData = await response.json().catch(() => ({}));
        console.error('Données d\'erreur:', errorData);
        throw new Error(errorData.error || `Erreur lors de la mise à jour de l'actualité: ${response.status}`);
      }
      
      const updatedArticle = await response.json();
      console.log('Article mis à jour:', updatedArticle);
      setNews(prev => prev.map(item => item.id === id ? updatedArticle : item));
      return updatedArticle;
    } catch (err: any) {
      console.error('Erreur dans updateNews:', err);
      setError(err.message || 'Impossible de mettre à jour l\'actualité');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Supprimer une actualité
  const deleteNews = async (id: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Suppression d\'article - ID:', id);
      const response = await fetch(`/api/news/${id}`, {
        method: 'DELETE',
      });
      console.log('Statut de la réponse de suppression:', response.status, response.statusText);
      
      if (!response.ok) {
        console.error('Réponse non-OK lors de la suppression:', response.status, response.statusText);
        const errorData = await response.json().catch(() => ({}));
        console.error('Données d\'erreur:', errorData);
        throw new Error(errorData.error || `Erreur lors de la suppression de l'actualité: ${response.status}`);
      }
      
      console.log('Article supprimé avec succès');
      setNews(prev => prev.filter(item => item.id !== id));
      return true;
    } catch (err: any) {
      console.error('Erreur dans deleteNews:', err);
      setError(err.message || 'Impossible de supprimer l\'actualité');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Charger les actualités au montage du composant
  useEffect(() => {
    fetchNews();
  }, []);

  return {
    news,
    isLoading,
    error,
    fetchNews,
    fetchNewsById,
    addNews,
    updateNews,
    deleteNews
  };
} 