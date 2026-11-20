"use server";

import { redirect } from "next/navigation";
import { readForm, type FormState } from "@zellapay/app-kit";
import { admin } from "@/lib/api/admin";
import { requireToken } from "@/lib/auth/action-token";
import { orSignIn } from "@/lib/forms/api-errors";
import type { Locale } from "@/lib/i18n/locales";
import { merchantRoute } from "@/lib/routes";
import { newMerchantSchema } from "../schemas";

/**
 * Creates the merchant, then, if an owner's email was given, invites them.
 * The merchant exists even when the invitation fails, so the next page says
 * which of the two happened and the invitation can be sent again from there.
 */
export async function createMerchantAction(
  locale: Locale,
  _previous: FormState,
  data: FormData,
): Promise<FormState> {
  const form = readForm(newMerchantSchema, data);
  if (!form.ok) return form.state;
  const { name, currency, ownerEmail, reason } = form.values;
  const s = { token: await requireToken(locale) };
  const created = await admin.createMerchant(s, { name, currency, reason });
  if (!created.ok) return orSignIn(locale, created.error);
  const id = created.data.id;
  if (!ownerEmail) redirect(`${merchantRoute(locale, id)}?notice=created`);
  const invited = await admin.inviteMerchantUser(s, id, {
    email: ownerEmail,
    role: "owner",
    locale,
    reason,
  });
  const notice = invited.ok ? "invited" : "inviteFailed";
  redirect(`${merchantRoute(locale, id)}?notice=${notice}`);
}
