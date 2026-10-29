import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Route pour initialiser la base de données avec un article d'actualité par défaut
export async function GET(request: NextRequest) {
  try {
    // Vérifier si des articles existent déjà
    const existingArticles = await prisma.newsArticle.findMany({
      take: 1
    });
    
    // Si des articles existent déjà, ne rien faire
    if (existingArticles.length > 0) {
      return NextResponse.json({
        message: 'Des articles existent déjà dans la base de données',
        count: existingArticles.length
      });
    }
    
    // Créer un article par défaut
    const defaultArticle = await prisma.newsArticle.create({
      data: {
        title: 'Bienvenue sur le système d\'actualités immobilières',
        excerpt: 'Ce premier article a été créé automatiquement pour illustrer le système d\'actualités du site ImmoNova.',
        content: 'Grâce à notre système d\'actualités, vous serez informé des dernières tendances du marché immobilier, des changements législatifs importants et des conseils pour optimiser vos investissements.\n\nLes administrateurs peuvent ajouter, modifier et supprimer des articles depuis le tableau de bord.',
        category: 'Actualités',
        authorName: 'Système ImmoNova',
        publishedAt: new Date(),
        imageUrl: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?q=80&w=2596&auto=format&fit=crop',
        isPublished: true
      }
    });
    
    return NextResponse.json({
      message: 'Article par défaut créé avec succès',
      article: defaultArticle
    });
  } catch (error) {
    console.error('Erreur lors de l\'initialisation des actualités:', error);
    return NextResponse.json({ error: 'Erreur lors de l\'initialisation des actualités' }, { status: 500 });
  }
} 