import "server-only";
import type { Locale } from "@zellapay/app-kit";
import { loadMessages } from "./messages";
import { createTranslate, type Translate } from "./translate";

/** The translate function for server components and actions. */
export async function getTranslate(locale: Locale): Promise<Translate> {
  return createTranslate(await loadMessages(locale));
}
