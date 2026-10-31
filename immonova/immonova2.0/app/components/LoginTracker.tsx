"use client";

import { useEffect } from "react";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";

const SESSION_KEY = "immonova-login-tracked";

// Enregistre en base la connexion d'un utilisateur, une fois par session de navigation.
export default function LoginTracker() {
  const { isAuthenticated } = useKindeBrowserClient();

  useEffect(() => {
    if (!isAuthenticated) return;
    try {
      if (window.sessionStorage.getItem(SESSION_KEY)) return;
      window.sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      // stockage indisponible : on enregistre quand même, une seule fois par chargement
    }
    fetch("/api/auth/track-login", { method: "POST" }).catch(() => {});
  }, [isAuthenticated]);

  return null;
}
