import "server-only";
import { mergeMessages, type Locale } from "@zellapay/app-kit";
import type { Messages } from "./translate";

/** The shared catalogue, this app's, and the approvals section's, merged. */
const catalogues: Record<Locale, () => Promise<Messages>> = {
  fr: async () =>
    mergeMessages(
      mergeMessages(
        (await import("@zellapay/app-kit/messages/fr.json")).default,
        (await import("@/messages/fr.json")).default,
      ),
      (await import("@/messages/approvals.fr.json")).default,
    ),
  en: async () =>
    mergeMessages(
      mergeMessages(
        (await import("@zellapay/app-kit/messages/en.json")).default,
        (await import("@/messages/en.json")).default,
      ),
      (await import("@/messages/approvals.en.json")).default,
    ),
};

export async function loadMessages(locale: Locale): Promise<Messages> {
  return catalogues[locale]();
}
