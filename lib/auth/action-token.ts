import "server-only";
import { redirect } from "next/navigation";
import type { Locale } from "@/lib/i18n/locales";
import { route } from "@/lib/routes";
import { readSessionToken } from "./session";

/** The session token for a Server Action, or a redirect to sign in. */
export async function requireToken(locale: Locale): Promise<string> {
  const token = await readSessionToken();
  if (!token) redirect(route(locale, "signIn"));
  return token;
}
