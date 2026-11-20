import { Alert, Badge, DataTable, PageHeader, SectionCard, type Column } from "@zellapay/ui";
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
import { SecurityAccount } from "./SecurityAccount";

const recommendedPasskeys = 2;

export async function PasskeysOverview({ locale }: { locale: Locale }) {
  const [{ token, current }, t] = await Promise.all([requireStaff(locale), getTranslate(locale)]);
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
  const count = res.data.data.length;
  return (
    <>
      <PageHeader title={t("security.title")} subtitle={t("security.subtitle")} />
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="space-y-6">
          <SectionCard
            title={t("security.passkeys.title")}
            subtitle={t("security.passkeys.subtitle")}
            actions={
              <Badge tone={count >= recommendedPasskeys ? "success" : "warning"}>
                {t("security.passkeys.status", { count, target: recommendedPasskeys })}
              </Badge>
            }
          >
            {count < recommendedPasskeys ? (
              <Alert tone="warning">{t("security.passkeys.needSecond")}</Alert>
            ) : null}
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
        </div>
        <SecurityAccount current={current} locale={locale} t={t} />
      </div>
    </>
  );
}
