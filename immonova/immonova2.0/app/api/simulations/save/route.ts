import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export async function POST(request: Request) {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user || !user.id) {
      return new NextResponse('Unauthorized - User not authenticated', { 
        status: 401,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    // Vérifier si l'utilisateur existe dans la base de données
    let dbUser = await prisma.user.findUnique({
      where: { id: user.id }
    });

    // Si l'utilisateur n'existe pas, le créer
    if (!dbUser) {
      try {
        dbUser = await prisma.user.create({
          data: {
            id: user.id,
            email: user.email || '',
            name: user.given_name || user.family_name ? `${user.given_name || ''} ${user.family_name || ''}`.trim() : undefined
          }
        });
      } catch (userError) {
        console.error('Erreur lors de la création de l\'utilisateur:', userError);
        return new NextResponse(JSON.stringify({
          error: 'Failed to create user',
          details: userError instanceof Error ? userError.message : 'Unknown error'
        }), { 
          status: 500,
          headers: {
            'Content-Type': 'application/json'
          }
        });
      }
    }

    let data;
    try {
      data = await request.json();
    } catch (error) {
      console.error('Erreur lors du parsing JSON:', error);
      return new NextResponse('Invalid JSON data', { status: 400 });
    }
    
    const { type, url } = data;

    if (!type || !url) {
      return new NextResponse(JSON.stringify({
        error: 'Missing required fields',
        received: { type, url }
      }), { 
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    try {
      const simulation = await prisma.simulation.create({
        data: {
          type,
          url,
          date: new Date(),
          userId: user.id
        }
      });

      return NextResponse.json(simulation);
    } catch (dbError) {
      console.error('Erreur Prisma:', dbError);
      return new NextResponse(JSON.stringify({
        error: 'Database error',
        details: dbError instanceof Error ? dbError.message : 'Unknown error'
      }), { 
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
  } catch (error) {
    console.error('Erreur détaillée lors de la sauvegarde:', {
      error,
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    return new NextResponse(JSON.stringify({
      error: 'Internal Server Error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), { 
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
} 