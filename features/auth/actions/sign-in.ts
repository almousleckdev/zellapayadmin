"use server";

import { redirect } from "next/navigation";
import { readForm, type FormState } from "@zellapay/app-kit";
import { fromApi } from "@zellapay/app-kit/server";
import { admin } from "@/lib/api/admin";
import type { MfaState } from "@/lib/api/types";
import { saveSessionToken } from "@/lib/auth/session";
import type { Locale } from "@/lib/i18n/locales";
import { route, type RouteName } from "@/lib/routes";
import { signInSchema } from "../schemas";

const nextStep: Record<MfaState, RouteName> = {
  enrol_required: "passkeySetup",
  required: "passkey",
  done: "home",
};

export async function signInAction(
  locale: Locale,
  _previous: FormState,
  data: FormData,
): Promise<FormState> {
  const form = readForm(signInSchema, data);
  if (!form.ok) return form.state;
  const res = await admin.signIn(form.values);
  if (!res.ok) return fromApi(res.error);
  await saveSessionToken(res.data.session_token);
  redirect(route(locale, nextStep[res.data.mfa]));
}
