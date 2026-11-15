import "server-only";
import { mergeMessages, type Locale } from "@zellapay/app-kit";
import type { Messages } from "./translate";

/** The shared catalogue and this app's, merged. */
const catalogues: Record<Locale, () => Promise<Messages>> = {
  fr: async () => mergeMessages(
    (await import("@zellapay/app-kit/messages/fr.json")).default,
    (await import("@/messages/fr.json")).default,
  ),
  en: async () => mergeMessages(
    (await import("@zellapay/app-kit/messages/en.json")).default,
    (await import("@/messages/en.json")).default,
  ),
};

export async function loadMessages(locale: Locale): Promise<Messages> {
  return catalogues[locale]();
}
