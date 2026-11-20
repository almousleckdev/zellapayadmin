import { Alert, PageHeader, TextLink } from "@zellapay/ui";
import { notFound } from "next/navigation";
import { admin } from "@/lib/api/admin";
import type {
  Activity,
  ChangeRequest,
  MerchantDetail as Detail,
  OperatorList,
} from "@/lib/api/types";
import { requireStaff } from "@/lib/auth/dal";
import type { Locale } from "@/lib/i18n/locales";
import { getTranslate } from "@/lib/i18n/server";
import type { Translate } from "@/lib/i18n/translate";
import { route } from "@/lib/routes";
import { inviteAction } from "../actions/invite";
import { restoreMerchantAction, suspendMerchantAction } from "../actions/standing";
import { ActivationCard } from "./ActivationCard";
import { ActivityCard } from "./ActivityCard";
import { InviteCard } from "./InviteCard";
import { MerchantFacts } from "./MerchantFacts";
import { MerchantRequests } from "./MerchantRequests";
import { OperatorsCard } from "./OperatorsCard";
import { PricingCard } from "./PricingCard";
import { StandingCard } from "./StandingCard";
import { StatusBadge } from "./StatusBadge";

type Props = { locale: Locale; id: string; notice?: string };

const notices = {
  created: ["success", "merchants.notice.created"],
  invited: ["success", "merchants.notice.invited"],
  inviteFailed: ["warning", "merchants.notice.inviteFailed"],
} as const;

type Perms = readonly string[];

/** The cards for acting on a merchant; each shows only if the role allows. */
function Actions({ m, perms, locale }: { m: Detail; perms: Perms; locale: Locale }) {
  return (
    <>
      {perms.includes("merchants:invite") ? (
        <InviteCard action={inviteAction.bind(null, locale, m.id)} />
      ) : null}
      {m.status === "active" && perms.includes("merchants:suspend") ? (
        <StandingCard kind="suspend" action={suspendMerchantAction.bind(null, locale, m.id)} />
      ) : null}
      {m.status === "suspended" && perms.includes("merchants:restore") ? (
        <StandingCard kind="restore" action={restoreMerchantAction.bind(null, locale, m.id)} />
      ) : null}
    </>
  );
}

function isOpen(requests: ChangeRequest[], kind: ChangeRequest["kind"]): boolean {
  return requests.some((r) => r.kind === kind && r.status === "pending");
}

type Loaded = {
  m: Detail;
  requests: ChangeRequest[];
  entries: Activity["data"];
  operators: OperatorList["data"];
};

/** Loads everything the page shows. Any failure but "not found" is an error. */
async function load(token: string, id: string): Promise<Loaded> {
  const s = { token };
  const [res, approvals, activity, operators] = await Promise.all([
    admin.getMerchant(s, id),
    admin.listApprovals(s, { merchantId: id }),
    admin.getActivity(s, id),
    admin.listOperators(s),
  ]);
  if (!res.ok && res.error.code === "not_found") notFound();
  if (!res.ok || !approvals.ok || !activity.ok || !operators.ok) {
    throw new Error("could not load the merchant page");
  }
  return {
    m: res.data,
    requests: approvals.data.data,
    entries: activity.data.data,
    operators: operators.data.data,
  };
}

type BodyProps = { data: Loaded; perms: Perms; locale: Locale; t: Translate };

function Body({ data, perms, locale, t }: BodyProps) {
  const { m, requests } = data;
  return (
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_24rem]">
      <div className="space-y-6">
        <MerchantFacts m={m} locale={locale} t={t} />
        <PricingCard
          m={m}
          locale={locale}
          t={t}
          canRequest={perms.includes("merchants:fees")}
          changePending={isOpen(requests, "fees")}
        />
        <ActivityCard entries={data.entries} locale={locale} t={t} />
      </div>
      <div className="space-y-6">
        <MerchantRequests
          requests={requests}
          canDecide={perms.includes("approvals:decide")}
          locale={locale}
          t={t}
        />
        {m.status === "pending" ? (
          <ActivationCard
            id={m.id}
            locale={locale}
            t={t}
            canRequest={perms.includes("merchants:activate")}
            waiting={isOpen(requests, "activate")}
          />
        ) : null}
        <Actions m={m} perms={perms} locale={locale} />
        <OperatorsCard operators={data.operators} t={t} />
      </div>
    </div>
  );
}

export async function MerchantDetail({ locale, id, notice }: Props) {
  const [{ token, current }, t] = await Promise.all([requireStaff(locale), getTranslate(locale)]);
  if (!current.permissions.includes("merchants:read")) {
    return <Alert tone="warning">{t("merchants.notAllowed")}</Alert>;
  }
  const data = await load(token, id);
  const flash = notice && notice in notices ? notices[notice as keyof typeof notices] : null;
  return (
    <>
      <TextLink href={route(locale, "merchants")}>{t("merchants.back")}</TextLink>
      <PageHeader
        title={data.m.name}
        subtitle={t("merchants.detail.heading")}
        actions={<StatusBadge status={data.m.status} t={t} />}
      />
      {flash ? <Alert tone={flash[0]}>{t(flash[1])}</Alert> : null}
      <Body data={data} perms={current.permissions} locale={locale} t={t} />
    </>
  );
}
