import { DataTable, TextLink, type Column } from "@zellapay/ui";
import type { Merchant } from "@/lib/api/types";
import { dateFormatter } from "@/lib/i18n/date";
import type { Locale } from "@/lib/i18n/locales";
import type { Translate } from "@/lib/i18n/translate";
import { merchantRoute } from "@/lib/routes";
import { StatusBadge } from "./StatusBadge";

type Props = { locale: Locale; t: Translate; merchants: Merchant[] };

export function MerchantsTable({ locale, t, merchants }: Props) {
  const when = dateFormatter(locale);
  const columns: Column<Merchant>[] = [
    {
      id: "name",
      header: t("merchants.columns.name"),
      cell: (m) => <TextLink href={merchantRoute(locale, m.id)}>{m.name}</TextLink>,
    },
    {
      id: "id",
      header: t("merchants.detail.id"),
      cell: (m) => <span className="font-mono text-xs text-muted">{m.id}</span>,
    },
    {
      id: "status",
      header: t("merchants.columns.status"),
      cell: (m) => <StatusBadge status={m.status} t={t} />,
    },
    { id: "currency", header: t("merchants.columns.currency"), cell: (m) => m.default_currency },
    {
      id: "created",
      header: t("merchants.columns.created"),
      cell: (m) => <span className="text-muted">{when.format(new Date(m.created_at))}</span>,
    },
  ];
  return (
    <DataTable
      caption={t("merchants.title")}
      columns={columns}
      rows={merchants}
      rowKey={(m) => m.id}
      empty={t("merchants.empty")}
    />
  );
}
