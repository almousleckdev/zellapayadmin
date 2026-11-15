import { Alert, PageHeader, SectionCard } from "@zellapay/ui";
import { notFound } from "next/navigation";
import { admin } from "@/lib/api/admin";
import { requireStaff } from "@/lib/auth/dal";
import { dateFormatter } from "@/lib/i18n/date";
import type { Locale } from "@/lib/i18n/locales";
import { getTranslate } from "@/lib/i18n/server";
import { restoreMerchantAction, suspendMerchantAction } from "../actions/standing";
import { StandingCard } from "./StandingCard";
import { StatusBadge } from "./StatusBadge";

type Props = { locale: Locale; id: string };

/** Basis points as a percentage, such as 150 -> "1.50 %". */
function percent(bps: number): string {
  return `${(bps / 100).toFixed(2)} %`;
}

export async function MerchantDetail({ locale, id }: Props) {
  const [{ token, current }, t] = await Promise.all([requireStaff(locale), getTranslate(locale)]);
  if (!current.permissions.includes("merchants:read")) {
    return <Alert tone="warning">{t("merchants.notAllowed")}</Alert>;
  }
  const res = await admin.getMerchant({ token }, id);
  if (!res.ok && res.error.code === "not_found") notFound();
  if (!res.ok) throw new Error(`could not load the merchant: ${res.error.code}`);
  const m = res.data;
  const can = (p: (typeof current.permissions)[number]) => current.permissions.includes(p);
  const rows: [string, React.ReactNode][] = [
    [t("merchants.detail.id"), m.id],
    [t("merchants.columns.status"), <StatusBadge key="s" status={m.status} t={t} />],
    [t("merchants.detail.kyc"), m.kyc_status],
    [t("merchants.columns.currency"), m.default_currency],
    [t("merchants.detail.fee"), percent(m.fee_bps)],
    [t("merchants.detail.payoutFee"), percent(m.payout_fee_bps)],
    [t("merchants.columns.created"), dateFormatter(locale).format(new Date(m.created_at))],
  ];
  return (
    <>
      <PageHeader title={m.name} subtitle={t("merchants.detail.subtitle")} />
      <SectionCard title={t("merchants.detail.title")}>
        <dl className="grid gap-x-6 gap-y-3 text-sm sm:grid-cols-[12rem_1fr]">
          {rows.map(([label, value]) => (
            <div key={label} className="contents">
              <dt className="text-muted">{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      </SectionCard>
      {m.status === "active" && can("merchants:suspend") ? (
        <StandingCard kind="suspend" action={suspendMerchantAction.bind(null, locale, m.id)} />
      ) : null}
      {m.status === "suspended" && can("merchants:restore") ? (
        <StandingCard kind="restore" action={restoreMerchantAction.bind(null, locale, m.id)} />
      ) : null}
    </>
  );
}
