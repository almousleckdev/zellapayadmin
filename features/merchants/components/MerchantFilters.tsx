import { Button, Icon, controlClasses } from "@zellapay/ui";
import type { MerchantQuery } from "@/lib/api/admin";
import type { Locale } from "@/lib/i18n/locales";
import type { Translate } from "@/lib/i18n/translate";
import { route } from "@/lib/routes";
import { merchantListHref, merchantStatuses } from "../query";

type Props = { locale: Locale; t: Translate; query: MerchantQuery };

const tab = "rounded-[5px] px-3 py-1 text-[13px] font-medium transition-colors";
const tabOn = "bg-surface text-foreground shadow-xs";
const tabOff = "text-muted hover:text-foreground";

/** Status tabs and a name search. Plain links and a GET form: no script. */
export function MerchantFilters({ locale, t, query }: Props) {
  const tabs = [undefined, ...merchantStatuses] as const;
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-3">
      <nav
        aria-label={t("merchants.filter.status")}
        className="flex gap-0.5 rounded-control bg-surface-muted p-0.5"
      >
        {tabs.map((status) => {
          const current = query.status === status;
          return (
            <a
              key={status ?? "all"}
              href={merchantListHref(locale, query, { status })}
              aria-current={current ? "page" : undefined}
              className={`${tab} ${current ? tabOn : tabOff}`}
            >
              {status ? t(`merchants.status.${status}`) : t("merchants.filter.all")}
            </a>
          );
        })}
      </nav>
      <form action={route(locale, "merchants")} role="search" className="flex items-center gap-2">
        {query.status ? <input type="hidden" name="status" value={query.status} /> : null}
        <div className="relative">
          <Icon name="search" className="absolute start-2.5 top-2.5 size-3.5 text-muted" />
          <input
            name="q"
            type="search"
            aria-label={t("merchants.filter.search")}
            placeholder={t("merchants.filter.search")}
            defaultValue={query.q}
            maxLength={64}
            className={controlClasses(false, "h-8 w-56 ps-8")}
          />
        </div>
        <Button type="submit" variant="secondary" size="sm">
          {t("merchants.filter.apply")}
        </Button>
      </form>
    </div>
  );
}
