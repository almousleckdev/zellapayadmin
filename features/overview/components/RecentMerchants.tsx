import { Card, DataTable, TextLink, type Column } from "@zellapay/ui";
import type { Merchant } from "@/lib/api/types";
import { StatusBadge } from "@/features/merchants/components/StatusBadge";
import { dateFormatter } from "@/lib/i18n/date";
import type { Locale } from "@/lib/i18n/locales";
import type { Translate } from "@/lib/i18n/translate";
import { merchantRoute, route } from "@/lib/routes";

type Props = { merchants: Merchant[]; locale: Locale; t: Translate };

/** The newest merchants, each linking to its page. */
export function RecentMerchants({ merchants, locale, t }: Props) {
  const when = dateFormatter(locale);
  const columns: Column<Merchant>[] = [
    {
      id: "name",
      header: t("merchants.columns.name"),
      cell: (m) => <TextLink href={merchantRoute(locale, m.id)}>{m.name}</TextLink>,
    },
    {
      id: "status",
      header: t("merchants.columns.status"),
      cell: (m) => <StatusBadge status={m.status} t={t} />,
    },
    {
      id: "created",
      header: t("merchants.columns.created"),
      cell: (m) => <span className="text-muted">{when.format(new Date(m.created_at))}</span>,
    },
  ];
  return (
    <Card>
      <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
        <h2 className="text-sm font-semibold">{t("home.recent.title")}</h2>
        <TextLink href={route(locale, "merchants")}>{t("home.recent.all")}</TextLink>
      </div>
      <DataTable
        caption={t("home.recent.title")}
        columns={columns}
        rows={merchants}
        rowKey={(m) => m.id}
        empty={t("merchants.empty")}
      />
    </Card>
  );
}
