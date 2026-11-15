"use server";

import { redirect } from "next/navigation";
import { admin } from "@/lib/api/admin";
import { clearSessionToken, readSessionToken } from "@/lib/auth/session";
import type { Locale } from "@/lib/i18n/locales";
import { route } from "@/lib/routes";

export async function signOutAction(locale: Locale): Promise<void> {
  const token = await readSessionToken();
  if (token) await admin.signOut({ token });
  await clearSessionToken();
  redirect(route(locale, "signIn"));
}
