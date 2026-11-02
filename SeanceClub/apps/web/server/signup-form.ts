import { z } from "zod";
import type { CreateUserFailure } from "./users";

const signupFormSchema = z.object({
  pseudo: z.string().trim(),
  birthDate: z.string().trim(),
  consent: z.literal("on"),
});

export type SignupForm = { pseudo: string; birthDate: string; consent: boolean };

// Reads the signup form. The e-mail is never read from the form: it comes from the signed-in session.
export function parseSignupForm(formData: FormData): SignupForm | { error: "consent_required" | "invalid_form" } {
  const consent = formData.get("consent") === "on";
  if (!consent) return { error: "consent_required" };

  const parsed = signupFormSchema.safeParse({
    pseudo: formData.get("pseudo"),
    birthDate: formData.get("birthDate"),
    consent: formData.get("consent"),
  });
  if (!parsed.success) return { error: "invalid_form" };

  return { pseudo: parsed.data.pseudo, birthDate: parsed.data.birthDate, consent: true };
}

const MESSAGES: Record<CreateUserFailure | "invalid_form" | "invalid_parent_email" | "not_eligible", string> = {
  invalid_pseudo: "Le pseudo doit faire de 3 à 20 caractères : lettres, chiffres, point, tiret ou tiret bas.",
  invalid_email: "L'adresse e-mail de ton compte n'est pas valide.",
  invalid_birth_date: "La date de naissance n'est pas valide.",
  consent_required: "Il faut accepter les conditions pour créer un compte.",
  too_young: "SéanceClub est réservé aux personnes de 13 ans et plus.",
  pseudo_taken: "Ce pseudo est déjà pris.",
  email_taken: "Un compte existe déjà avec cette adresse e-mail.",
  invalid_form: "Le formulaire est incomplet.",
  invalid_parent_email: "L'adresse e-mail du parent n'est pas valide.",
  not_eligible: "Cette demande n'est pas possible : l'adresse du parent doit être différente de la tienne.",
};

// Only known codes are turned into text, so a crafted `?erreur=` cannot display arbitrary content.
export function signupMessage(code: string | undefined): string | null {
  if (!code || !Object.hasOwn(MESSAGES, code)) return null;
  return MESSAGES[code as keyof typeof MESSAGES];
}
