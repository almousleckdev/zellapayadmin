import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { admin } from "@/lib/api/admin";
import type { Current } from "@/lib/api/types";
import type { Locale } from "@/lib/i18n/locales";
import { route } from "@/lib/routes";
import { readSessionToken } from "./session";

export type SignedIn = { token: string; current: Current };

/**
 * The data access layer's entry point for signed-in pages. It checks the
 * session with the backend on every call, so a session ended elsewhere stops
 * working at once. The backend, not this app, decides who may do what.
 */
const load = cache(async (locale: Locale): Promise<SignedIn> => {
  const token = await readSessionToken();
  if (!token) redirect(route(locale, "signIn"));
  const res = await admin.current({ token });
  if (!res.ok && res.error.code === "unreachable") throw new Error("backend unreachable");
  if (!res.ok) redirect(route(locale, "signIn"));
  return { token, current: res.data };
});

/** A page for members who used a passkey in this session. */
export async function requireStaff(locale: Locale): Promise<SignedIn> {
  const signedIn = await load(locale);
  if (signedIn.current.mfa === "enrol_required") redirect(route(locale, "passkeySetup"));
  if (signedIn.current.mfa === "required") redirect(route(locale, "passkey"));
  return signedIn;
}

/** A page for a session that still has to take the given passkey step. */
export async function requirePending(
  locale: Locale,
  step: "required" | "enrol_required",
): Promise<SignedIn> {
  const signedIn = await load(locale);
  if (signedIn.current.mfa === "done") redirect(route(locale, "home"));
  if (signedIn.current.mfa !== step) {
    redirect(route(locale, signedIn.current.mfa === "required" ? "passkey" : "passkeySetup"));
  }
  return signedIn;
}

/** A page that needs only a signed-in member, passkey or not. */
export async function requireSession(locale: Locale): Promise<SignedIn> {
  return load(locale);
}
