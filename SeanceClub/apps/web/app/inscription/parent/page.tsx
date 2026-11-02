import { redirect } from "next/navigation";
import { requireSessionEmail } from "../../../server/session";
import { signupMessage } from "../../../server/signup-form";
import { findUserByEmail } from "../../../server/users";
import { demanderAccordParent } from "../actions";

export const metadata = { title: "Accord d'un parent · SéanceClub" };

export default async function AccordParent({
  searchParams,
}: {
  searchParams: Promise<{ erreur?: string; enregistre?: string }>;
}) {
  const email = await requireSessionEmail("/inscription/parent");

  const user = await findUserByEmail(email);
  if (!user) redirect("/inscription");
  if (user.accountStatus !== "pending_parental") redirect("/");

  const { erreur, enregistre } = await searchParams;
  const message = signupMessage(erreur);

  return (
    <main className="mx-auto max-w-md p-8">
      <h1 className="text-3xl font-bold">L'accord d'un parent est nécessaire</h1>
      <p className="mt-2 text-[#A09A92]">
        À ton âge, ton compte reste en attente tant qu'un parent ou responsable légal n'a pas donné son accord.
        Indique son adresse e-mail : elle doit être différente de la tienne.
      </p>

      {message && (
        <p role="alert" className="mt-4 rounded border border-accent p-3">
          {message}
        </p>
      )}
      {enregistre && (
        <p role="status" className="mt-4 rounded border border-[#26262B] p-3">
          Demande enregistrée. L'envoi du message à ton parent n'est pas encore en service : ton compte reste en attente.
        </p>
      )}

      <form action={demanderAccordParent} className="mt-6 space-y-4">
        <label className="block">
          E-mail du parent
          <input
            name="parentEmail"
            type="email"
            required
            autoComplete="off"
            className="mt-1 block min-h-11 w-full rounded border border-[#26262B] bg-[#17171A] px-3 text-texte focus-visible:outline-2 focus-visible:outline-accent"
          />
        </label>
        <button type="submit" className="min-h-11 rounded bg-accent px-4 text-texte">
          Demander l'accord
        </button>
      </form>
    </main>
  );
}
