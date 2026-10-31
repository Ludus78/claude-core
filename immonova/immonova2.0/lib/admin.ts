import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';

// Les administrateurs sont listés dans la variable d'environnement ADMIN_EMAILS
// (adresses séparées par des virgules). Vide ou absente : personne n'a accès.
export async function getAdminUser() {
  const allowed = (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  if (allowed.length === 0) return null;

  const { getUser } = getKindeServerSession();
  const user = await getUser();
  if (!user?.email || !allowed.includes(user.email.toLowerCase())) return null;
  return user;
}
