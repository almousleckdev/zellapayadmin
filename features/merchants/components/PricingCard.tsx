import { Badge, Card, SettingRow } from "@zellapay/ui";
import { requestFeesAction } from "@/features/approvals/actions/requests";
import { FeeChangeDialog } from "@/features/approvals/components/FeeChangeDialog";
import type { MerchantDetail } from "@/lib/api/types";
import { formatBps } from "@/lib/format/percent";
import type { Locale } from "@/lib/i18n/locales";
import type { Translate } from "@/lib/i18n/translate";

function Figure({ children }: { children: string }) {
  return <span className="text-sm font-semibold tabular-nums">{children}</span>;
}

type Props = {
  m: MerchantDetail;
  locale: Locale;
  t: Translate;
  canRequest: boolean;
  /** A fee change is already waiting for a second person. */
  changePending: boolean;
};

/** What ZellaPay charges this merchant. Changing it needs a second person. */
export function PricingCard({ m, locale, t, canRequest, changePending }: Props) {
  const action = changePending ? (
    <Badge tone="warning">{t("approvals.fees.pending")}</Badge>
  ) : canRequest ? (
    <FeeChangeDialog
      action={requestFeesAction.bind(null, locale, m.id)}
      feeBps={m.fee_bps}
      payoutFeeBps={m.payout_fee_bps}
    />
  ) : null;
  return (
    <Card>
      <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
        <h2 className="text-sm font-semibold">{t("merchants.pricing.title")}</h2>
        {action}
      </div>
      <div className="px-5 py-1">
        <SettingRow
          title={t("merchants.pricing.collection")}
          description={t("merchants.pricing.collectionHint")}
          action={<Figure>{formatBps(m.fee_bps)}</Figure>}
        />
        <SettingRow
          title={t("merchants.pricing.payout")}
          description={t("merchants.pricing.payoutHint")}
          action={<Figure>{formatBps(m.payout_fee_bps)}</Figure>}
        />
      </div>
      <p className="border-t border-border px-5 py-3 text-xs text-muted">
        {t("merchants.pricing.taxNote")}
      </p>
    </Card>
  );
}
