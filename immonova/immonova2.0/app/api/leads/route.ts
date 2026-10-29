import { NextResponse } from 'next/server';
import { validateEmail } from '../../utils/validateEmail';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, calculatorType, acceptNewsletter } = body;

    // Valider l'email
    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      return NextResponse.json(
        { success: false, error: emailValidation.message || "Email invalide" },
        { status: 400 }
      );
    }

    // Ici, vous pourriez stocker l'email dans une base de données
    // Pour l'instant, nous allons simplement enregistrer dans la console pour le débogage
    console.log(`Nouvel email enregistré: ${email}, Type de calculette: ${calculatorType}, Newsletter: ${acceptNewsletter}`);

    // Simuler un délai pour une expérience plus réaliste
    await new Promise(resolve => setTimeout(resolve, 500));

    // Répondre avec succès
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement du lead:', error);
    
    return NextResponse.json(
      { success: false, error: "Une erreur est survenue lors de l'enregistrement" },
      { status: 500 }
    );
  }
} 