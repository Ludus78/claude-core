import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import crypto from 'crypto';
import { validateEmail } from '@/app/utils/validateEmail';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email requis' },
        { status: 400 }
      );
    }

    // Validation de l'email côté serveur
    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      return NextResponse.json(
        { error: emailValidation.message || 'Adresse email invalide' },
        { status: 400 }
      );
    }

    // Vérifier si l'utilisateur existe
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // Pour des raisons de sécurité, nous ne révélons pas si l'email existe ou non
    // Nous simulons simplement un succès même si l'utilisateur n'existe pas
    if (user) {
      // Générer un token de réinitialisation (valide pour 1 heure)
      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetTokenExpiry = new Date(Date.now() + 3600000); // +1 heure

      // Stocker le token dans la base de données
      await prisma.user.update({
        where: { id: user.id },
        data: {
          resetToken,
          resetTokenExp: resetTokenExpiry,
        },
      });

      // Dans une implémentation réelle, envoyez un email avec le lien de réinitialisation
      // Par exemple: `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password?token=${resetToken}`
      
      // Pour cet exemple, nous simulons simplement l'envoi de l'email
      console.log(`[RESET PASSWORD] Token généré pour ${email}: ${resetToken}`);
    }

    // Toujours renvoyer un succès, que l'utilisateur existe ou non
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending reset password email:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'envoi de l\'email de réinitialisation' },
      { status: 500 }
    );
  }
}