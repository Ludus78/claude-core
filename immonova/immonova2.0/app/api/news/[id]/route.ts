import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';

// Récupérer une actualité par son ID
export async function GET(
  request: NextRequest,
  { params }: any
) {
  try {
    const id = params.id;
    
    const article = await prisma.newsArticle.findUnique({
      where: { id }
    });
    
    if (!article) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }
    
    // Formatter la date pour l'affichage
    const publishedDate = new Date(article.publishedAt);
    const formattedArticle = {
      ...article,
      formattedDate: `${publishedDate.getDate().toString().padStart(2, '0')}/${(publishedDate.getMonth() + 1).toString().padStart(2, '0')}/${publishedDate.getFullYear()}`
    };
    
    return NextResponse.json(formattedArticle);
  } catch (error) {
    console.error('Error fetching news article:', error);
    return NextResponse.json({ error: 'Failed to fetch news article' }, { status: 500 });
  }
}

// Mettre à jour une actualité
export async function PUT(
  request: NextRequest,
  { params }: any
) {
  try {
    // Vérifier si l'utilisateur est authentifié et est administrateur
    const { getUser } = getKindeServerSession();
    const user = await getUser();
    
    if (!user || user.email !== 'admin@immonova.fr') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const id = params.id;
    const { title, excerpt, content, category, imageUrl, isPublished } = await request.json();
    
    // Vérifier si l'article existe
    const existingArticle = await prisma.newsArticle.findUnique({
      where: { id }
    });
    
    if (!existingArticle) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }
    
    // Valider les données requises
    if (!title || !excerpt || !category) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    // Mettre à jour l'article
    const updatedArticle = await prisma.newsArticle.update({
      where: { id },
      data: {
        title,
        excerpt,
        content,
        category,
        imageUrl,
        isPublished: isPublished === undefined ? existingArticle.isPublished : isPublished,
        updatedAt: new Date()
      }
    });
    
    return NextResponse.json(updatedArticle);
  } catch (error) {
    console.error('Error updating news article:', error);
    return NextResponse.json({ error: 'Failed to update news article' }, { status: 500 });
  }
}

// Supprimer une actualité
export async function DELETE(
  request: NextRequest,
  { params }: any
) {
  try {
    // Vérifier si l'utilisateur est authentifié et est administrateur
    const { getUser } = getKindeServerSession();
    const user = await getUser();
    
    if (!user || user.email !== 'admin@immonova.fr') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const id = params.id;
    
    // Vérifier si l'article existe
    const existingArticle = await prisma.newsArticle.findUnique({
      where: { id }
    });
    
    if (!existingArticle) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }
    
    // Supprimer l'article
    await prisma.newsArticle.delete({
      where: { id }
    });
    
    return NextResponse.json({ message: 'Article deleted successfully' });
  } catch (error) {
    console.error('Error deleting news article:', error);
    return NextResponse.json({ error: 'Failed to delete news article' }, { status: 500 });
  }
} 