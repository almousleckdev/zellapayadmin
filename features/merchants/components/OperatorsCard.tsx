import { SectionCard } from "@zellapay/ui";
import type { OperatorList } from "@/lib/api/types";
import type { Translate } from "@/lib/i18n/translate";

type Props = { operators: OperatorList["data"]; t: Translate };

const item = "flex items-center justify-between gap-3 py-2.5 first:pt-0 last:pb-0";
const prefix = "rounded-md bg-surface-muted px-1.5 py-0.5 text-xs text-muted";

/** The operators every merchant is served by, and the numbers each handles. */
export function OperatorsCard({ operators, t }: Props) {
  return (
    <SectionCard
      title={t("merchants.operators.title")}
      subtitle={t("merchants.operators.subtitle")}
    >
      <ul className="divide-y divide-border">
        {operators.map((o) => (
          <li key={o.code} className={item}>
            <span className="font-mono text-xs">{o.code}</span>
            <span className="flex flex-wrap justify-end gap-1">
              {o.prefixes.map((p) => (
                <code key={p} className={prefix}>
                  {p}
                </code>
              ))}
            </span>
          </li>
        ))}
      </ul>
    </SectionCard>
  );
}
