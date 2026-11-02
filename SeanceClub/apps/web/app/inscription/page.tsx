import { redirect } from "next/navigation";
import { requireSessionEmail } from "../../server/session";
import { signupMessage } from "../../server/signup-form";
import { findUserByEmail } from "../../server/users";
import { inscrire } from "./actions";

export const metadata = { title: "Inscription · SéanceClub" };

const field = "mt-1 block min-h-11 w-full rounded border border-[#26262B] bg-[#17171A] px-3 text-texte focus-visible:outline-2 focus-visible:outline-accent";

export default async function Inscription({ searchParams }: { searchParams: Promise<{ erreur?: string }> }) {
  const email = await requireSessionEmail("/inscription");

  const existing = await findUserByEmail(email);
  if (existing) redirect(existing.accountStatus === "pending_parental" ? "/inscription/parent" : "/");

  const message = signupMessage((await searchParams).erreur);

  return (
    <main className="mx-auto max-w-md p-8">
      <h1 className="text-3xl font-bold">Créer mon compte</h1>
      <p className="mt-2 text-[#A09A92]">Connecté avec {email}.</p>

      {message && (
        <p role="alert" className="mt-4 rounded border border-accent p-3">
          {message}
        </p>
      )}

      <form action={inscrire} className="mt-6 space-y-4">
        <label className="block">
          Pseudo
          <input name="pseudo" required minLength={3} maxLength={20} pattern="[A-Za-z0-9_.\-]{3,20}" autoComplete="username" className={field} />
        </label>
        <label className="block">
          Date de naissance
          <input name="birthDate" type="date" required autoComplete="bday" className={field} />
          <span className="mt-1 block text-sm text-[#A09A92]">Elle ne peut plus être modifiée et n'est jamais affichée.</span>
        </label>
        <label className="flex min-h-11 items-start gap-3">
          <input name="consent" type="checkbox" required className="mt-1 size-5" />
          <span>J'accepte les conditions d'utilisation et la politique de confidentialité.</span>
        </label>
        <button type="submit" className="min-h-11 rounded bg-accent px-4 text-texte">
          Créer mon compte
        </button>
      </form>
    </main>
  );
}
