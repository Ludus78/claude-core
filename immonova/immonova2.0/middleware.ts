import { withAuth } from "@kinde-oss/kinde-auth-nextjs/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Protéger les routes avec l'authentification Kinde
export default withAuth(
  function middleware(request: NextRequest) {
    // Autoriser les requêtes OPTIONS pour le CORS
    if (request.method === "OPTIONS") {
      return NextResponse.next();
    }

    // Vérifier si la requête est pour l'API de simulations
    if (request.nextUrl.pathname.startsWith('/api/simulations')) {
      console.log('Middleware - Requête API simulations détectée');
      return NextResponse.next();
    }

    // Pour toutes les autres routes protégées
    return NextResponse.next();
  },
  {
    // Configuration de l'authentification
    callbacks: {
      authorized: async ({ token }: { token: any }) => {
        console.log('Middleware - Token vérifié:', !!token);
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/api/simulations/:path*"
  ]
}; 