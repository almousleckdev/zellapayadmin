import { Badge, DataTable, PageHeader, SectionCard, type Column } from "@zellapay/ui";
import { admin } from "@/lib/api/admin";
import type { Passkey } from "@/lib/api/types";
import { requireStaff } from "@/lib/auth/dal";
import { dateFormatter } from "@/lib/i18n/date";
import type { Locale } from "@/lib/i18n/locales";
import { getTranslate } from "@/lib/i18n/server";
import {
  beginRegistrationAction,
  finishRegistrationAction,
} from "../actions/passkeys";
import { PasskeyRegistration } from "./PasskeyRegistration";

export async function PasskeysOverview({ locale }: { locale: Locale }) {
  const [{ token }, t] = await Promise.all([requireStaff(locale), getTranslate(locale)]);
  const res = await admin.listPasskeys({ token });
  if (!res.ok) throw new Error(`could not list passkeys: ${res.error.code}`);
  const when = dateFormatter(locale);
  const columns: Column<Passkey>[] = [
    { id: "name", header: t("security.passkeys.name"), cell: (k) => k.label },
    {
      id: "created", header: t("security.passkeys.created"),
      cell: (k) => when.format(new Date(k.created_at)),
    },
    {
      id: "used", header: t("security.passkeys.lastUsed"),
      cell: (k) =>
        k.last_used_at ? (
          when.format(new Date(k.last_used_at))
        ) : (
          <Badge tone="neutral">{t("security.passkeys.never")}</Badge>
        ),
    },
  ];
  return (
    <>
      <PageHeader title={t("security.title")} subtitle={t("security.subtitle")} />
      <SectionCard
        title={t("security.passkeys.title")}
        subtitle={t("security.passkeys.subtitle")}
      >
        <DataTable
          caption={t("security.passkeys.title")}
          columns={columns}
          rows={res.data.data}
          rowKey={(k) => k.id}
          empty={t("security.passkeys.empty")}
        />
      </SectionCard>
      <SectionCard title={t("security.passkeys.add")}>
        <PasskeyRegistration
          begin={beginRegistrationAction.bind(null, locale)}
          finish={finishRegistrationAction.bind(null, locale)}
        />
      </SectionCard>
    </>
  );
}
