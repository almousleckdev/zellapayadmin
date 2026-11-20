"use server";

import { revalidatePath } from "next/cache";
import { done, failure, readForm, type FormState } from "@zellapay/app-kit";
import { admin } from "@/lib/api/admin";
import type { Invitation } from "@/lib/api/types";
import { requireToken } from "@/lib/auth/action-token";
import { orSignIn } from "@/lib/forms/api-errors";
import type { Locale } from "@/lib/i18n/locales";
import { merchantRoute } from "@/lib/routes";
import { inviteSchema, merchantIdSchema } from "../schemas";

/** Emails a merchant's person a link to join. The reason is audited. */
export async function inviteAction(
  locale: Locale,
  id: string,
  _previous: FormState<Invitation>,
  data: FormData,
): Promise<FormState<Invitation>> {
  if (!merchantIdSchema.safeParse(id).success) return failure("not_found");
  const form = readForm(inviteSchema, data);
  if (!form.ok) return form.state;
  const res = await admin.inviteMerchantUser({ token: await requireToken(locale) }, id, {
    ...form.values,
    locale,
  });
  if (!res.ok) return orSignIn(locale, res.error);
  revalidatePath(merchantRoute(locale, id));
  return done(res.data);
}
