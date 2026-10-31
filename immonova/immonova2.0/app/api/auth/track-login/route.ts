import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';

// Appelé une fois par session de navigation depuis le navigateur d'un utilisateur connecté.
export async function POST() {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user || !user.id) {
      return new NextResponse(null, { status: 401 });
    }

    const name = `${user.given_name || ''} ${user.family_name || ''}`.trim() || undefined;

    await prisma.user.upsert({
      where: { id: user.id },
      create: {
        id: user.id,
        email: user.email || '',
        name,
        lastLoginAt: new Date(),
        loginCount: 1,
      },
      update: {
        lastLoginAt: new Date(),
        loginCount: { increment: 1 },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur lors du suivi de connexion:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
