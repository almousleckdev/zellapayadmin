import { Badge, type BadgeTone } from "@zellapay/ui";
import { decideAction } from "../actions/requests";
import type { ChangeRequest } from "@/lib/api/types";
import { formatBps } from "@/lib/format/percent";
import { dateFormatter } from "@/lib/i18n/date";
import type { Locale } from "@/lib/i18n/locales";
import type { Translate } from "@/lib/i18n/translate";
import { ReasonDialog } from "./ReasonDialog";

const tones: Record<ChangeRequest["status"], BadgeTone> = {
  pending: "warning", approved: "success", rejected: "danger", expired: "neutral",
};

type Props = { request: ChangeRequest; canDecide: boolean; locale: Locale; t: Translate };

/** What a request asks for, in words. */
export function summary(r: ChangeRequest, t: Translate): string {
  if (r.kind === "activate") return t("approvals.kind.activate");
  return t("approvals.kind.fees", {
    fee: formatBps(r.fee_bps ?? 0),
    payout: formatBps(r.payout_fee_bps ?? 0),
  });
}

function Deciders({ request, locale, t }: Omit<Props, "canDecide">) {
  const bind = (verb: "approve" | "reject") =>
    decideAction.bind(null, locale, { id: request.id, merchantId: request.merchant_id, verb });
  return (
    <div className="flex gap-2">
      <ReasonDialog
        trigger={t("approvals.approve.trigger")}
        title={t("approvals.approve.title")}
        subtitle={summary(request, t)}
        submit={t("approvals.approve.submit")}
        done={t("approvals.approve.done")}
        action={bind("approve")}
      />
      <ReasonDialog
        trigger={t("approvals.reject.trigger")}
        triggerVariant="secondary"
        title={t("approvals.reject.title")}
        subtitle={summary(request, t)}
        submit={t("approvals.reject.submit")}
        done={t("approvals.reject.done")}
        action={bind("reject")}
      />
    </div>
  );
}

/** One change request: what, why, who and when, and what can be done. */
export function RequestRow({ request, canDecide, locale, t }: Props) {
  const when = dateFormatter(locale);
  const open = request.status === "pending";
  const expiry = new Date(request.expires_at);
  return (
    <li className="space-y-2 px-5 py-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-[13px] font-medium">{summary(request, t)}</p>
        <Badge tone={tones[request.status]}>{t(`approvals.status.${request.status}`)}</Badge>
      </div>
      <p className="text-[13px] text-muted">{request.reason}</p>
      <p className="text-xs text-muted">
        {request.requested_by_you ? t("approvals.byYou") : t("approvals.byColleague")}
        {" · "}
        {when.format(new Date(request.requested_at))}
        {open ? ` · ${t("approvals.expires", { at: when.format(expiry) })}` : ""}
      </p>
      {request.decision_reason ? (
        <p className="text-xs text-muted">
          {t("approvals.decision", { reason: request.decision_reason })}
        </p>
      ) : null}
      {open && canDecide && !request.requested_by_you ? (
        <Deciders request={request} locale={locale} t={t} />
      ) : null}
      {open && request.requested_by_you ? (
        <p className="text-xs font-medium text-warning">{t("approvals.waiting")}</p>
      ) : null}
    </li>
  );
}
