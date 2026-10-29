import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';

// Récupérer toutes les actualités immobilières
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const category = searchParams.get('category');
    
    // Construire la requête avec des filtres optionnels
    const query: any = {
      where: {
        isPublished: true,
      },
      orderBy: {
        publishedAt: 'desc'
      },
      take: limit
    };
    
    // Ajouter un filtre par catégorie si spécifié
    if (category) {
      query.where.category = category;
    }
    
    const articles = await prisma.newsArticle.findMany(query);
    
    // Formatter la date pour l'affichage
    const formattedArticles = articles.map(article => {
      const publishedDate = new Date(article.publishedAt);
      return {
        ...article,
        formattedDate: `${publishedDate.getDate().toString().padStart(2, '0')}/${(publishedDate.getMonth() + 1).toString().padStart(2, '0')}/${publishedDate.getFullYear()}`
      };
    });
    
    return NextResponse.json(formattedArticles);
  } catch (error) {
    console.error('Error fetching news articles:', error);
    return NextResponse.json({ error: 'Failed to fetch news articles' }, { status: 500 });
  }
}

// Ajouter une nouvelle actualité immobilière
export async function POST(request: NextRequest) {
  try {
    // Vérifier si l'utilisateur est authentifié et est administrateur
    const { getUser } = getKindeServerSession();
    const user = await getUser();
    
    if (!user || user.email !== 'admin@immonova.fr') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { title, excerpt, content, category, imageUrl } = await request.json();
    
    // Valider les données requises
    if (!title || !excerpt || !category) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    const article = await prisma.newsArticle.create({
      data: {
        title,
        excerpt,
        content,
        category,
        authorName: user.given_name ? `${user.given_name} ${user.family_name || ''}` : 'Admin ImmoNova',
        imageUrl,
        publishedAt: new Date()
      }
    });
    
    return NextResponse.json(article, { status: 201 });
  } catch (error) {
    console.error('Error creating news article:', error);
    return NextResponse.json({ error: 'Failed to create news article' }, { status: 500 });
  }
} 