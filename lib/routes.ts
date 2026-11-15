import type { Locale } from "@/lib/i18n/locales";

export type RouteName =
  | "home"
  | "signIn"
  | "passkey"
  | "passkeySetup"
  | "security"
  | "merchants";

const paths: Record<RouteName, string> = {
  home: "",
  signIn: "/sign-in",
  passkey: "/passkey",
  passkeySetup: "/passkey/setup",
  security: "/security",
  merchants: "/merchants",
};

/** The URL of a page in a language. Every link and redirect goes through it. */
export function route(locale: Locale, name: RouteName, query?: Record<string, string>): string {
  const base = `/${locale}${paths[name]}`;
  return query ? `${base}?${new URLSearchParams(query)}` : base;
}

/** The URL of one merchant's page. */
export function merchantRoute(locale: Locale, id: string): string {
  return `${route(locale, "merchants")}/${encodeURIComponent(id)}`;
}
