import { Card } from "@zellapay/ui";
import { RequestRow } from "@/features/approvals/components/RequestRow";
import type { ChangeRequest } from "@/lib/api/types";
import type { Locale } from "@/lib/i18n/locales";
import type { Translate } from "@/lib/i18n/translate";

type Props = { requests: ChangeRequest[]; canDecide: boolean; locale: Locale; t: Translate };

/** Open requests on this merchant, with buttons for a second person. */
export function MerchantRequests({ requests, canDecide, locale, t }: Props) {
  const open = requests.filter((r) => r.status === "pending");
  if (open.length === 0) return null;
  return (
    <Card>
      <h2 className="border-b border-border px-5 py-3.5 text-sm font-semibold">
        {t("approvals.openTitle")}
      </h2>
      <ul className="divide-y divide-border">
        {open.map((r) => (
          <RequestRow key={r.id} request={r} canDecide={canDecide} locale={locale} t={t} />
        ))}
      </ul>
    </Card>
  );
}
