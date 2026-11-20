"use server";

import { revalidatePath } from "next/cache";
import { done, failure, readForm, type FormState } from "@zellapay/app-kit";
import { admin } from "@/lib/api/admin";
import type { ChangeRequest } from "@/lib/api/types";
import { requireToken } from "@/lib/auth/action-token";
import { orSignIn } from "@/lib/forms/api-errors";
import type { Locale } from "@/lib/i18n/locales";
import { merchantRoute, route } from "@/lib/routes";
import { feeChangeSchema, merchantIdSchema, reasonSchema } from "@/features/merchants/schemas";

type State = FormState<ChangeRequest>;

function refresh(locale: Locale, merchantId?: string) {
  revalidatePath(route(locale, "approvals"));
  revalidatePath(route(locale, "home"));
  if (merchantId) revalidatePath(merchantRoute(locale, merchantId));
}

/** Asks for a pending merchant to go live. A second person decides. */
export async function requestActivationAction(
  locale: Locale,
  id: string,
  _previous: State,
  data: FormData,
): Promise<State> {
  if (!merchantIdSchema.safeParse(id).success) return failure("not_found");
  const form = readForm(reasonSchema, data);
  if (!form.ok) return form.state;
  const res = await admin.requestActivation(
    { token: await requireToken(locale) },
    id,
    form.values.reason,
  );
  if (!res.ok) return orSignIn(locale, res.error);
  refresh(locale, id);
  return done(res.data);
}

/** Asks for new fees. Nothing changes until a second person approves. */
export async function requestFeesAction(
  locale: Locale,
  id: string,
  _previous: State,
  data: FormData,
): Promise<State> {
  if (!merchantIdSchema.safeParse(id).success) return failure("not_found");
  const form = readForm(feeChangeSchema, data);
  if (!form.ok) return form.state;
  const { fee, payoutFee, reason } = form.values;
  const res = await admin.requestFees(
    { token: await requireToken(locale) },
    id,
    { fee_bps: fee, payout_fee_bps: payoutFee, reason },
  );
  if (!res.ok) return orSignIn(locale, res.error);
  refresh(locale, id);
  return done(res.data);
}

/** Approves or rejects a request. The person who asked cannot approve it. */
export async function decideAction(
  locale: Locale,
  request: { id: string; merchantId: string; verb: "approve" | "reject" },
  _previous: State,
  data: FormData,
): Promise<State> {
  const form = readForm(reasonSchema, data);
  if (!form.ok) return form.state;
  const res = await admin.decide(
    { token: await requireToken(locale) },
    request.id,
    request.verb,
    form.values.reason,
  );
  if (!res.ok) return orSignIn(locale, res.error);
  refresh(locale, request.merchantId);
  return done(res.data);
}
