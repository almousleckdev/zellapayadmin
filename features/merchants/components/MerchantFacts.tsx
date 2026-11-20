import { Card } from "@zellapay/ui";
import type { ReactNode } from "react";
import type { MerchantDetail } from "@/lib/api/types";
import { dateFormatter } from "@/lib/i18n/date";
import type { Locale } from "@/lib/i18n/locales";
import type { Translate } from "@/lib/i18n/translate";

type Props = { m: MerchantDetail; locale: Locale; t: Translate };

/** The merchant's identity: ID, identity check, currency and creation date. */
export function MerchantFacts({ m, locale, t }: Props) {
  const rows: [string, ReactNode][] = [
    [t("merchants.detail.id"), <span key="id" className="font-mono text-xs">{m.id}</span>],
    [t("merchants.detail.kyc"), m.kyc_status],
    [t("merchants.columns.currency"), m.default_currency],
    [t("merchants.columns.created"), dateFormatter(locale).format(new Date(m.created_at))],
  ];
  return (
    <Card>
      <h2 className="border-b border-border px-5 py-3.5 text-sm font-semibold">
        {t("merchants.detail.title")}
      </h2>
      <dl className="divide-y divide-border">
        {rows.map(([label, value]) => (
          <div key={label} className="grid grid-cols-[10rem_1fr] gap-4 px-5 py-2.5 text-[13px]">
            <dt className="text-muted">{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
      <p className="border-t border-border px-5 py-3 text-xs text-muted">
        {t("merchants.detail.subtitle")}
      </p>
    </Card>
  );
}
