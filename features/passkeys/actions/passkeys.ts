"use server";

import { revalidatePath } from "next/cache";
import { done, failure, type FormState } from "@zellapay/app-kit";
import { admin, type WebAuthnOptions } from "@/lib/api/admin";
import { requireToken } from "@/lib/auth/action-token";
import { orSignIn } from "@/lib/forms/api-errors";
import type { Locale } from "@/lib/i18n/locales";
import { route } from "@/lib/routes";

/** What the browser needs to run a passkey ceremony. */
export type CeremonyOptions = { options: WebAuthnOptions };

const maxLabel = 64;

export async function beginRegistrationAction(
  locale: Locale,
): Promise<FormState<CeremonyOptions>> {
  const res = await admin.beginRegistration({ token: await requireToken(locale) });
  return res.ok ? done({ options: res.data }) : orSignIn(locale, res.error);
}

/** Stores the passkey the browser created. */
export async function finishRegistrationAction(
  locale: Locale,
  label: string,
  credential: unknown,
): Promise<FormState<true>> {
  const name = label.trim().slice(0, maxLabel);
  if (!name) return failure("invalid_form", { fieldErrors: { label: "required" } });
  const res = await admin.finishRegistration(
    { token: await requireToken(locale) },
    { label: name, credential },
  );
  if (!res.ok) return orSignIn(locale, res.error);
  revalidatePath(route(locale, "security"));
  return done(true);
}

export async function beginLoginAction(locale: Locale): Promise<FormState<CeremonyOptions>> {
  const res = await admin.beginLogin({ token: await requireToken(locale) });
  return res.ok ? done({ options: res.data }) : orSignIn(locale, res.error);
}

/** Checks the passkey's signed answer. */
export async function finishLoginAction(
  locale: Locale,
  credential: unknown,
): Promise<FormState<true>> {
  const res = await admin.finishLogin({ token: await requireToken(locale) }, credential);
  return res.ok ? done(true) : orSignIn(locale, res.error);
}
