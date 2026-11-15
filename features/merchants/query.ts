import type { MerchantQuery } from "@/lib/api/admin";
import type { MerchantStatus } from "@/lib/api/types";
import type { Locale } from "@/lib/i18n/locales";
import { route } from "@/lib/routes";

export const merchantStatuses: readonly MerchantStatus[] = ["pending", "active", "suspended"];

const maxSearch = 64;

type Raw = Record<string, string | string[] | undefined>;

function one(value: string | string[] | undefined): string {
  return (Array.isArray(value) ? value[0] : value) ?? "";
}

/**
 * Reads the list page's address into a backend query. Anything unknown is
 * dropped, so a mangled link shows the plain list, not an error.
 */
export function parseMerchantQuery(raw: Raw): MerchantQuery {
  const status = one(raw.status);
  const q = one(raw.q).trim().slice(0, maxSearch);
  const cursor = one(raw.cursor);
  return {
    status: merchantStatuses.find((s) => s === status),
    q: q || undefined,
    cursor: cursor || undefined,
  };
}

/** The address of a list page: only what is set, never a cursor by default. */
export function merchantListParams(query: MerchantQuery): Record<string, string> {
  const params: Record<string, string> = {};
  if (query.status) params.status = query.status;
  if (query.q) params.q = query.q;
  if (query.cursor) params.cursor = query.cursor;
  return params;
}

/** The link to a list page, with the query changed by `change`. */
export function merchantListHref(
  locale: Locale,
  query: MerchantQuery,
  change: Partial<MerchantQuery>,
): string {
  return route(locale, "merchants", merchantListParams({ ...query, cursor: undefined, ...change }));
}
