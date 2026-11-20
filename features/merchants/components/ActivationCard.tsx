import { Alert, SectionCard } from "@zellapay/ui";
import { requestActivationAction } from "@/features/approvals/actions/requests";
import { ReasonDialog } from "@/features/approvals/components/ReasonDialog";
import type { Locale } from "@/lib/i18n/locales";
import type { Translate } from "@/lib/i18n/translate";

type Props = { id: string; locale: Locale; t: Translate; canRequest: boolean; waiting: boolean };

/** How a pending merchant goes live: one person asks, a second approves. */
export function ActivationCard({ id, locale, t, canRequest, waiting }: Props) {
  return (
    <SectionCard
      title={t("approvals.activation.title")}
      subtitle={t("approvals.activation.subtitle")}
    >
      {waiting ? (
        <Alert tone="info">{t("approvals.activation.waiting")}</Alert>
      ) : canRequest ? (
        <ReasonDialog
          trigger={t("approvals.activation.trigger")}
          title={t("approvals.activation.title")}
          subtitle={t("approvals.activation.subtitle")}
          submit={t("approvals.activation.submit")}
          done={t("approvals.activation.done")}
          action={requestActivationAction.bind(null, locale, id)}
        />
      ) : (
        <p className="text-[13px] text-muted">{t("approvals.activation.noRole")}</p>
      )}
    </SectionCard>
  );
}
