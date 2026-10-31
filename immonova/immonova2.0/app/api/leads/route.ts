import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { validateEmail } from '../../utils/validateEmail';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, calculatorType, acceptNewsletter } = body;

    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      return NextResponse.json(
        { success: false, error: emailValidation.message || "Email invalide" },
        { status: 400 }
      );
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const calculator = typeof calculatorType === 'string' ? calculatorType.slice(0, 40) : 'inconnu';
    const wantsNewsletter = acceptNewsletter === true;

    // Un enregistrement par e-mail. Le consentement newsletter, une fois donné, n'est
    // jamais retiré par un nouveau passage sans la case cochée.
    await prisma.lead.upsert({
      where: { email: normalizedEmail },
      create: {
        email: normalizedEmail,
        acceptNewsletter: wantsNewsletter,
        newsletterConsentAt: wantsNewsletter ? new Date() : null,
        firstCalculator: calculator,
        lastCalculator: calculator,
      },
      update: {
        lastCalculator: calculator,
        submissions: { increment: 1 },
        ...(wantsNewsletter ? { acceptNewsletter: true, newsletterConsentAt: new Date() } : {}),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement du lead:', error);

    return NextResponse.json(
      { success: false, error: "Une erreur est survenue lors de l'enregistrement" },
      { status: 500 }
    );
  }
}
