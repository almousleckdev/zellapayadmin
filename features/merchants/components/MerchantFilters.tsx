import { TextField, Button } from "@zellapay/ui";
import type { MerchantQuery } from "@/lib/api/admin";
import type { Locale } from "@/lib/i18n/locales";
import type { Translate } from "@/lib/i18n/translate";
import { route } from "@/lib/routes";
import { merchantListHref, merchantStatuses } from "../query";

type Props = { locale: Locale; t: Translate; query: MerchantQuery };

const linkClass = "rounded-control px-3 py-1.5 text-sm font-medium";
const currentClass = "bg-surface-muted text-foreground";

/** Status links and a name search. Plain links and a GET form: no script. */
export function MerchantFilters({ locale, t, query }: Props) {
  const tabs = [undefined, ...merchantStatuses] as const;
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <nav aria-label={t("merchants.filter.status")} className="flex flex-wrap gap-1">
        {tabs.map((status) => {
          const current = query.status === status;
          const href = merchantListHref(locale, query, { status });
          return (
            <a
              key={status ?? "all"}
              href={href}
              aria-current={current ? "page" : undefined}
              className={`${linkClass} ${current ? currentClass : "text-muted"}`}
            >
              {status ? t(`merchants.status.${status}`) : t("merchants.filter.all")}
            </a>
          );
        })}
      </nav>
      <form
        action={route(locale, "merchants")}
        method="get"
        role="search"
        className="flex items-end gap-2"
      >
        {query.status ? <input type="hidden" name="status" value={query.status} /> : null}
        <TextField
          name="q"
          type="search"
          label={t("merchants.filter.search")}
          defaultValue={query.q}
          maxLength={64}
        />
        <Button type="submit" variant="secondary">
          {t("merchants.filter.apply")}
        </Button>
      </form>
    </div>
  );
}
