import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

const button = "inline-flex min-h-11 items-center rounded px-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

export default async function Home() {
  const signedIn = Boolean(await getKindeServerSession().isAuthenticated());

  return (
    <main className="mx-auto max-w-2xl p-8">
      <h1 className="text-5xl font-bold">
        SÉANCE <span className="text-2xl text-[#A09A92]">CLUB</span>
      </h1>
      <p className="mt-4 text-xl">Le club des cinéphiles : note tes films, découvre ton score, discute en direct.</p>
      <p className="mt-2 text-[#A09A92]">
        Chacun lance le film en même temps sur sa propre plateforme, puis on en parle dans un chat. Le site n'héberge aucun film.
      </p>

      <div className="mt-8 flex flex-wrap gap-3">
        {signedIn ? (
          <a href="/profil" className={`${button} bg-accent text-texte`}>
            Mon profil
          </a>
        ) : (
          <>
            <a href="/inscription" className={`${button} bg-accent text-texte`}>
              Créer mon compte
            </a>
            <a href="/api/auth/login" className={`${button} border border-[#26262B]`}>
              Me connecter
            </a>
          </>
        )}
      </div>
    </main>
  );
}
