import { Alert, Card, PageHeader, TextLink } from "@zellapay/ui";
import { admin, type MerchantQuery } from "@/lib/api/admin";
import { requireStaff } from "@/lib/auth/dal";
import type { Locale } from "@/lib/i18n/locales";
import { getTranslate } from "@/lib/i18n/server";
import type { Translate } from "@/lib/i18n/translate";
import { createMerchantAction } from "../actions/create";
import { merchantListHref, parseMerchantQuery } from "../query";
import { NewMerchantDialog } from "./NewMerchantDialog";
import { MerchantFilters } from "./MerchantFilters";
import { MerchantsTable } from "./MerchantsTable";

type Props = { locale: Locale; searchParams: Record<string, string | string[] | undefined> };

type PagerProps = { locale: Locale; t: Translate; query: MerchantQuery; next: string | null };

function Pager({ locale, t, query, next }: PagerProps) {
  if (!query.cursor && !next) return null;
  return (
    <div className="flex justify-between border-t border-border px-4 py-3 text-[13px]">
      {query.cursor ? (
        <TextLink href={merchantListHref(locale, query, {})}>
          {t("merchants.pagination.first")}
        </TextLink>
      ) : (
        <span />
      )}
      {next ? (
        <TextLink href={merchantListHref(locale, query, { cursor: next })}>
          {t("merchants.pagination.next")}
        </TextLink>
      ) : null}
    </div>
  );
}

export async function MerchantsOverview({ locale, searchParams }: Props) {
  const [{ token, current }, t] = await Promise.all([requireStaff(locale), getTranslate(locale)]);
  const canCreate = current.permissions.includes("merchants:create");
  const header = (
    <PageHeader
      title={t("merchants.title")}
      subtitle={t("merchants.subtitle")}
      actions={
        canCreate ? (
          <NewMerchantDialog action={createMerchantAction.bind(null, locale)} />
        ) : null
      }
    />
  );
  if (!current.permissions.includes("merchants:read")) {
    return (
      <>
        {header}
        <Alert tone="warning">{t("merchants.notAllowed")}</Alert>
      </>
    );
  }
  const query = parseMerchantQuery(searchParams);
  const res = await admin.listMerchants({ token }, query);
  if (!res.ok && res.error.code === "invalid_request") {
    return (
      <>
        {header}
        <Alert tone="warning">{t("merchants.badQuery")}</Alert>
      </>
    );
  }
  if (!res.ok) throw new Error(`could not list merchants: ${res.error.code}`);
  const next = res.data.next_cursor;
  return (
    <>
      {header}
      <Card>
        <MerchantFilters locale={locale} t={t} query={query} />
        <MerchantsTable locale={locale} t={t} merchants={res.data.data} />
        <Pager locale={locale} t={t} query={query} next={next} />
      </Card>
    </>
  );
}
