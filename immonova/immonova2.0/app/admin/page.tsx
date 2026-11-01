import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import { getAdminUser } from '@/lib/admin';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Administration', robots: { index: false, follow: false } };

const dateFr = (d: Date | null) => (d ? d.toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' }) : '-');

export default async function AdminPage() {
  if (!(await getAdminUser())) notFound();

  const [leads, users, simulationCount, newsletterCount] = await Promise.all([
    prisma.lead.findMany({ orderBy: { createdAt: 'desc' }, take: 200 }),
    prisma.user.findMany({ orderBy: { lastLoginAt: { sort: 'desc', nulls: 'last' } }, take: 200 }),
    prisma.simulation.count(),
    prisma.lead.count({ where: { acceptNewsletter: true } }),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-10">
      <h1 className="text-3xl font-extrabold text-forest-800">Administration</h1>

      <div className="grid gap-4 sm:grid-cols-4">
        {[
          ['E-mails récoltés', leads.length],
          ['Inscrits newsletter', newsletterCount],
          ['Comptes connectés', users.length],
          ['Simulations sauvegardées', simulationCount],
        ].map(([label, value]) => (
          <div key={label as string} className="bg-white rounded-3xl p-4">
            <div className="text-sm text-gray-500">{label}</div>
            <div className="text-2xl font-semibold">{value}</div>
          </div>
        ))}
      </div>

      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-extrabold">E-mails du popup</h2>
          <a href="/api/admin/newsletter" className="text-primary-600 hover:text-primary-800 text-sm">
            Exporter les inscrits newsletter (CSV)
          </a>
        </div>
        <div className="overflow-x-auto bg-white rounded-3xl">
          <table className="min-w-full text-sm">
            <thead className="bg-cream-200 text-left">
              <tr>
                <th className="p-3">E-mail</th>
                <th className="p-3">Newsletter</th>
                <th className="p-3">Première calculette</th>
                <th className="p-3">Dernière calculette</th>
                <th className="p-3">Passages</th>
                <th className="p-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((l) => (
                <tr key={l.id} className="border-t">
                  <td className="p-3">{l.email}</td>
                  <td className="p-3">{l.acceptNewsletter ? 'Oui' : 'Non'}</td>
                  <td className="p-3">{l.firstCalculator}</td>
                  <td className="p-3">{l.lastCalculator}</td>
                  <td className="p-3">{l.submissions}</td>
                  <td className="p-3">{dateFr(l.createdAt)}</td>
                </tr>
              ))}
              {leads.length === 0 && (
                <tr><td className="p-3 text-gray-500" colSpan={6}>Aucun e-mail pour l&apos;instant.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-extrabold mb-3">Utilisateurs connectés</h2>
        <div className="overflow-x-auto bg-white rounded-3xl">
          <table className="min-w-full text-sm">
            <thead className="bg-cream-200 text-left">
              <tr>
                <th className="p-3">E-mail</th>
                <th className="p-3">Nom</th>
                <th className="p-3">Inscription</th>
                <th className="p-3">Dernière connexion</th>
                <th className="p-3">Connexions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-t">
                  <td className="p-3">{u.email}</td>
                  <td className="p-3">{u.name || '-'}</td>
                  <td className="p-3">{dateFr(u.createdAt)}</td>
                  <td className="p-3">{dateFr(u.lastLoginAt)}</td>
                  <td className="p-3">{u.loginCount}</td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr><td className="p-3 text-gray-500" colSpan={5}>Aucune connexion enregistrée pour l&apos;instant.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
