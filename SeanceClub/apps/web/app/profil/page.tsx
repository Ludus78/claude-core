import { redirect } from "next/navigation";
import { requireSessionEmail } from "../../server/session";
import { findProfileByEmail } from "../../server/users";

export const metadata = { title: "Mon profil · SéanceClub" };

const dateFormat = new Intl.DateTimeFormat("fr-FR", { dateStyle: "long", timeZone: "UTC" });

export default async function Profil() {
  const email = await requireSessionEmail("/profil");

  const profile = await findProfileByEmail(email);
  if (!profile) redirect("/inscription");
  if (profile.accountStatus === "pending_parental") redirect("/inscription/parent");

  return (
    <main className="mx-auto max-w-md p-8">
      <h1 className="text-3xl font-bold">{profile.pseudo}</h1>
      <p className="mt-2 text-[#A09A92]">Membre depuis le {dateFormat.format(profile.createdAt)}</p>

      <dl className="mt-6 space-y-3 rounded border border-[#26262B] bg-[#17171A] p-4">
        <div>
          <dt className="text-sm text-[#A09A92]">E-mail</dt>
          <dd>{email}</dd>
        </div>
        <div>
          <dt className="text-sm text-[#A09A92]">Formule</dt>
          <dd>{profile.plan === "premium" ? "Premium" : "Gratuite"}</dd>
        </div>
        {profile.accountStatus === "suspended" && (
          <div>
            <dt className="text-sm text-[#A09A92]">Statut</dt>
            <dd role="status">Compte suspendu</dd>
          </div>
        )}
      </dl>

      <p className="mt-6 text-[#A09A92]">Ton score cinéphile apparaîtra ici avec les films vus et les notes.</p>

      <a href="/api/auth/logout" className="mt-6 inline-flex min-h-11 items-center rounded border border-[#26262B] px-4 focus-visible:outline-2 focus-visible:outline-accent">
        Se déconnecter
      </a>
    </main>
  );
}
