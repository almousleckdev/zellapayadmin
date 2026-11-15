import { Alert, PageHeader, SectionCard, TextLink } from "@zellapay/ui";
import { admin } from "@/lib/api/admin";
import { requireStaff } from "@/lib/auth/dal";
import type { Locale } from "@/lib/i18n/locales";
import { getTranslate } from "@/lib/i18n/server";
import { merchantListHref, parseMerchantQuery } from "../query";
import { MerchantFilters } from "./MerchantFilters";
import { MerchantsTable } from "./MerchantsTable";

type Props = { locale: Locale; searchParams: Record<string, string | string[] | undefined> };

export async function MerchantsOverview({ locale, searchParams }: Props) {
  const [{ token, current }, t] = await Promise.all([requireStaff(locale), getTranslate(locale)]);
  const header = <PageHeader title={t("merchants.title")} subtitle={t("merchants.subtitle")} />;
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
      <SectionCard title={t("merchants.title")}>
        <div className="space-y-4">
          <MerchantFilters locale={locale} t={t} query={query} />
          <MerchantsTable locale={locale} t={t} merchants={res.data.data} />
          <div className="flex justify-between text-sm">
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
        </div>
      </SectionCard>
    </>
  );
}
