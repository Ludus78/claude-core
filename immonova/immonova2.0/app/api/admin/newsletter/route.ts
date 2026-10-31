import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAdminUser } from '@/lib/admin';

export const dynamic = 'force-dynamic';

// Export CSV des e-mails ayant accepté la newsletter, pour l'importer dans l'outil d'envoi.
export async function GET() {
  if (!(await getAdminUser())) {
    return new NextResponse(null, { status: 404 });
  }

  const leads = await prisma.lead.findMany({
    where: { acceptNewsletter: true },
    orderBy: { createdAt: 'asc' },
  });

  const lines = ['email,consent_date,first_calculator'];
  for (const lead of leads) {
    lines.push(
      [lead.email, lead.newsletterConsentAt?.toISOString().slice(0, 10) ?? '', lead.firstCalculator]
        .map((v) => `"${String(v).replace(/"/g, '""')}"`)
        .join(',')
    );
  }

  return new NextResponse(lines.join('\n'), {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="newsletter.csv"',
      'Cache-Control': 'no-store',
    },
  });
}
