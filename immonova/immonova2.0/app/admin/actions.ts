'use server';

import { revalidatePath } from 'next/cache';
import prisma from '@/lib/prisma';
import { getAdminUser } from '@/lib/admin';

// Publie un brouillon d'actualité : il apparaît sur /actualites avec la date du jour
export async function publierBrouillon(formData: FormData) {
  if (!(await getAdminUser())) throw new Error('Accès refusé');
  const id = String(formData.get('id') || '');
  if (!id) return;
  await prisma.newsArticle.update({
    where: { id },
    data: { isPublished: true, publishedAt: new Date() },
  });
  revalidatePath('/admin');
  revalidatePath('/actualites');
}

// Supprime un brouillon (jamais un article déjà publié)
export async function supprimerBrouillon(formData: FormData) {
  if (!(await getAdminUser())) throw new Error('Accès refusé');
  const id = String(formData.get('id') || '');
  if (!id) return;
  await prisma.newsArticle.deleteMany({ where: { id, isPublished: false } });
  revalidatePath('/admin');
}
