import { notFound } from "next/navigation";
import { isLocale, type Locale } from "./locales";

/** The language of the current route. An unknown language is a 404. */
export async function resolveLocale(params: Promise<{ lang: string }>): Promise<Locale> {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return lang;
}
