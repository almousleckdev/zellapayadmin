"use server";

import { revalidatePath } from "next/cache";
import { done, failure, readForm, type FormState } from "@zellapay/app-kit";
import { admin } from "@/lib/api/admin";
import type { Merchant } from "@/lib/api/types";
import { requireToken } from "@/lib/auth/action-token";
import { orSignIn } from "@/lib/forms/api-errors";
import type { Locale } from "@/lib/i18n/locales";
import { merchantRoute, route } from "@/lib/routes";
import { merchantIdSchema, reasonSchema } from "../schemas";

type Change = "suspend" | "restore";

async function change(
  locale: Locale,
  id: string,
  kind: Change,
  data: FormData,
): Promise<FormState<Merchant>> {
  if (!merchantIdSchema.safeParse(id).success) return failure("not_found");
  const form = readForm(reasonSchema, data);
  if (!form.ok) return form.state;
  const s = { token: await requireToken(locale) };
  const res =
    kind === "suspend"
      ? await admin.suspendMerchant(s, id, form.values.reason)
      : await admin.restoreMerchant(s, id, form.values.reason);
  if (!res.ok) return orSignIn(locale, res.error);
  revalidatePath(merchantRoute(locale, id));
  revalidatePath(route(locale, "merchants"));
  return done(res.data);
}

export async function suspendMerchantAction(
  locale: Locale,
  id: string,
  _previous: FormState<Merchant>,
  data: FormData,
): Promise<FormState<Merchant>> {
  return change(locale, id, "suspend", data);
}

export async function restoreMerchantAction(
  locale: Locale,
  id: string,
  _previous: FormState<Merchant>,
  data: FormData,
): Promise<FormState<Merchant>> {
  return change(locale, id, "restore", data);
}
