import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";

// E-mail of the signed-in member, or a redirect to the Kinde login.
export async function requireSessionEmail(returnTo: string): Promise<string> {
  const user = await getKindeServerSession().getUser();
  if (!user?.email) redirect(`/api/auth/login?post_login_redirect_url=${encodeURIComponent(returnTo)}`);
  return user.email;
}
