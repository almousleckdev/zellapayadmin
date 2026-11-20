"use client";

import type { FormAction } from "@zellapay/app-kit";
import { TextField } from "@zellapay/ui";
import type { ChangeRequest } from "@/lib/api/types";
import { bpsToInput } from "@/lib/format/percent";
import { useT } from "@/lib/i18n/provider";
import { ReasonDialog } from "./ReasonDialog";

type Props = { action: FormAction<ChangeRequest>; feeBps: number; payoutFeeBps: number };

/** Asks for new fees. The fields start with today's values. */
export function FeeChangeDialog({ action, feeBps, payoutFeeBps }: Props) {
  const t = useT();
  return (
    <ReasonDialog
      trigger={t("approvals.fees.trigger")}
      triggerVariant="secondary"
      title={t("approvals.fees.title")}
      subtitle={t("approvals.fees.subtitle")}
      submit={t("approvals.fees.submit")}
      done={t("approvals.fees.done")}
      action={action}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          name="fee"
          label={t("approvals.fees.collection")}
          defaultValue={bpsToInput(feeBps)}
          inputMode="decimal"
          hint={t("approvals.fees.percentHint")}
          required
        />
        <TextField
          name="payoutFee"
          label={t("approvals.fees.payout")}
          defaultValue={bpsToInput(payoutFeeBps)}
          inputMode="decimal"
          required
        />
      </div>
    </ReasonDialog>
  );
}
