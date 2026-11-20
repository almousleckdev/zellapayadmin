import { BarChart, Card, PageHeader, StatRow } from "@zellapay/ui";
import { createMerchantAction } from "@/features/merchants/actions/create";
import { NewMerchantDialog } from "@/features/merchants/components/NewMerchantDialog";
import { admin } from "@/lib/api/admin";
import type { Overview } from "@/lib/api/types";
import { requireStaff } from "@/lib/auth/dal";
import type { Locale } from "@/lib/i18n/locales";
import { getTranslate } from "@/lib/i18n/server";
import type { MessageKey, Translate } from "@/lib/i18n/translate";
import { route } from "@/lib/routes";
import { Attention } from "./Attention";
import { RecentMerchants } from "./RecentMerchants";
import { StatusSplit } from "./StatusSplit";

const chartDays = 30;
const recentCount = 6;

function dayLabel(date: string, locale: Locale): string {
  return new Intl.DateTimeFormat(locale === "fr" ? "fr-GA" : "en-GB", {
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`));
}

type Ctx = { o: Overview; locale: Locale; t: Translate };

function Stats({ o, locale, t }: Ctx) {
  const week = o.created_by_day.slice(-7).reduce((sum, d) => sum + d.count, 0);
  const list = route(locale, "merchants");
  return (
    <StatRow
      stats={[
        {
          label: t("home.stats.total"),
          value: String(o.total),
          note: week ? t("home.stats.week", { count: week }) : t("home.stats.none"),
          href: list,
        },
        ...(["active", "pending", "suspended"] as const).map((status) => ({
          label: t(`merchants.status.${status}`),
          value: String(o.by_status[status]),
          href: `${list}?status=${status}`,
        })),
      ]}
    />
  );
}

function Charts({ o, locale, t }: Ctx) {
  const title = "border-b border-border px-5 py-3.5 text-sm font-semibold";
  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
      <Card>
        <h2 className={title}>{t("home.charts.registered", { days: chartDays })}</h2>
        <div className="p-5">
          <BarChart
            summary={t("home.charts.registeredSummary", { days: chartDays })}
            data={o.created_by_day.map((d) => ({
              label: dayLabel(d.date, locale),
              value: d.count,
            }))}
          />
        </div>
      </Card>
      <Card>
        <h2 className={title}>{t("home.charts.status")}</h2>
        <div className="p-5">
          <StatusSplit o={o} t={t} />
        </div>
      </Card>
    </div>
  );
}

/** The counts and the newest merchants. Either failing is an error page. */
async function load(token: string) {
  const [overview, recent] = await Promise.all([
    admin.getOverview({ token }, chartDays),
    admin.listMerchants({ token }, { limit: recentCount }),
  ]);
  if (!overview.ok) throw new Error(`overview: ${overview.error.code}`);
  if (!recent.ok) throw new Error(`recent merchants: ${recent.error.code}`);
  return { overview: overview.data, recent: recent.data.data };
}

export async function Welcome({ locale }: { locale: Locale }) {
  const [{ token, current }, t] = await Promise.all([requireStaff(locale), getTranslate(locale)]);
  const { user } = current;
  const data = current.permissions.includes("merchants:read") ? await load(token) : null;
  const o = data?.overview;
  return (
    <>
      <PageHeader
        title={t("home.welcome", { name: user.name })}
        subtitle={t("home.role", { role: t(`roles.${user.role}` as MessageKey) })}
        actions={
          current.permissions.includes("merchants:create") ? (
            <NewMerchantDialog action={createMerchantAction.bind(null, locale)} />
          ) : null
        }
      />
      {o ? <Stats o={o} locale={locale} t={t} /> : null}
      {o ? <Charts o={o} locale={locale} t={t} /> : null}
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        {data ? <RecentMerchants merchants={data.recent} locale={locale} t={t} /> : null}
        <Attention o={o} passkeys={current.passkeys} locale={locale} t={t} />
      </div>
    </>
  );
}
