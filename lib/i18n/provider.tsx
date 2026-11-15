"use client";

import { useTranslate } from "@zellapay/app-kit";
import type { Translate } from "./translate";

export { I18nProvider, useLocale } from "@zellapay/app-kit";

/** The translate function, with this app's message keys checked. */
export function useT(): Translate {
  return useTranslate() as unknown as Translate;
}
