import type { Locale } from "./locales";

/** Dates are shown in Gabon's time zone, whatever the member's device says. */
export function dateFormatter(locale: Locale): Intl.DateTimeFormat {
  return new Intl.DateTimeFormat(locale === "fr" ? "fr-GA" : "en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Africa/Libreville",
  });
}
