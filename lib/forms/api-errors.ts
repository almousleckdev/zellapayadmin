import "server-only";
import { redirect } from "next/navigation";
import { fromApi, type ApiError } from "@zellapay/app-kit/server";
import type { FormError } from "@zellapay/app-kit";
import type { Locale } from "@/lib/i18n/locales";
import { route } from "@/lib/routes";

export { fromApi };

/** A dead session sends the member back to sign in, not to an error page. */
export function orSignIn(locale: Locale, error: ApiError): FormError {
  if (error.code === "invalid_session") redirect(route(locale, "signIn"));
  return fromApi(error);
}
