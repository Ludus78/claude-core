"use server";

import { redirect } from "next/navigation";
import { requireSessionEmail } from "../../server/session";
import { parseSignupForm } from "../../server/signup-form";
import { createUser, findUserByEmail } from "../../server/users";
import { requestParentalConsent } from "../../server/parental";

export async function inscrire(formData: FormData) {
  const email = await requireSessionEmail("/inscription");

  const form = parseSignupForm(formData);
  if ("error" in form) redirect(`/inscription?erreur=${form.error}`);

  const result = await createUser({ email, ...form });
  if (!result.ok) redirect(`/inscription?erreur=${result.reason}`);

  redirect(result.accountStatus === "pending_parental" ? "/inscription/parent" : "/");
}

export async function demanderAccordParent(formData: FormData) {
  const email = await requireSessionEmail("/inscription/parent");

  const user = await findUserByEmail(email);
  if (!user || user.accountStatus !== "pending_parental") redirect("/inscription");

  const parentEmail = String(formData.get("parentEmail") ?? "").trim();
  const result = await requestParentalConsent(user.id, parentEmail);
  if (!result.ok) redirect(`/inscription/parent?erreur=${result.reason}`);

  // The token is deliberately dropped: the e-mail service is not chosen yet (ROADMAP.md),
  // so nothing is sent. It must never reach the browser.
  redirect("/inscription/parent?enregistre=1");
}
