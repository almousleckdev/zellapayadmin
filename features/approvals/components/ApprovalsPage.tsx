import { Alert, Card, PageHeader, TextLink } from "@zellapay/ui";
import { admin } from "@/lib/api/admin";
import { requireStaff } from "@/lib/auth/dal";
import type { Locale } from "@/lib/i18n/locales";
import { getTranslate } from "@/lib/i18n/server";
import { merchantRoute } from "@/lib/routes";
import { RequestRow } from "./RequestRow";

/** Everything waiting for a decision, and what was decided lately. */
export async function ApprovalsPage({ locale }: { locale: Locale }) {
  const [{ token, current }, t] = await Promise.all([requireStaff(locale), getTranslate(locale)]);
  const header = <PageHeader title={t("approvals.title")} subtitle={t("approvals.subtitle")} />;
  if (!current.permissions.includes("merchants:read")) {
    return (
      <>
        {header}
        <Alert tone="warning">{t("merchants.notAllowed")}</Alert>
      </>
    );
  }
  const res = await admin.listApprovals({ token }, {});
  if (!res.ok) throw new Error(`could not list approvals: ${res.error.code}`);
  const canDecide = current.permissions.includes("approvals:decide");
  const open = res.data.data.filter((r) => r.status === "pending");
  const closed = res.data.data.filter((r) => r.status !== "pending");
  const groups = [
    { title: t("approvals.openTitle"), rows: open, empty: t("approvals.noneOpen") },
    { title: t("approvals.recentTitle"), rows: closed, empty: t("approvals.noneRecent") },
  ];
  return (
    <>
      {header}
      {groups.map((g) => (
        <Card key={g.title}>
          <h2 className="border-b border-border px-5 py-3.5 text-sm font-semibold">{g.title}</h2>
          {g.rows.length === 0 ? (
            <p className="px-5 py-8 text-center text-[13px] text-muted">{g.empty}</p>
          ) : (
            <ul className="divide-y divide-border">
              {g.rows.map((r) => (
                <div key={r.id}>
                  <p className="px-5 pt-3 text-xs">
                    <TextLink href={merchantRoute(locale, r.merchant_id)}>
                      {r.merchant_name ?? r.merchant_id}
                    </TextLink>
                  </p>
                  <RequestRow request={r} canDecide={canDecide} locale={locale} t={t} />
                </div>
              ))}
            </ul>
          )}
        </Card>
      ))}
    </>
  );
}
