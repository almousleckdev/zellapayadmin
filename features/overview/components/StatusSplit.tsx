import { StackedBar } from "@zellapay/ui";
import type { Overview } from "@/lib/api/types";
import type { Translate } from "@/lib/i18n/translate";

/** How the merchant base divides between active, pending and suspended. */
export function StatusSplit({ o, t }: { o: Overview; t: Translate }) {
  const { active, pending, suspended } = o.by_status;
  return (
    <StackedBar
      summary={t("home.charts.statusSummary", { active, pending, suspended })}
      segments={[
        { label: t("merchants.status.active"), value: active, color: 1 },
        { label: t("merchants.status.pending"), value: pending, color: 2 },
        { label: t("merchants.status.suspended"), value: suspended, color: 3 },
      ]}
    />
  );
}
