"use client";

import { Alert, SectionCard, TextField } from "@zellapay/ui";
import { ServerForm, type FormAction } from "@zellapay/app-kit";
import type { Merchant } from "@/lib/api/types";
import { useT } from "@/lib/i18n/provider";

type Props = {
  kind: "suspend" | "restore";
  action: FormAction<Merchant>;
};

/** Asks for a reason and suspends or restores. The reason is audited. */
export function StandingCard({ kind, action }: Props) {
  const t = useT();
  return (
    <SectionCard
      title={t(`merchants.${kind}.title`)}
      subtitle={t(`merchants.${kind}.warning`)}
    >
      <ServerForm
        action={action}
        submit={t(`merchants.${kind}.submit`)}
        renderDone={(_, dismiss) => (
          <div className="space-y-3">
            <Alert tone="success">{t(`merchants.${kind}.done`)}</Alert>
            <button type="button" className="text-sm underline" onClick={dismiss}>
              {t("merchants.reason.again")}
            </button>
          </div>
        )}
      >
        <TextField
          name="reason"
          label={t("merchants.reason.label")}
          hint={t("merchants.reason.hint")}
          minLength={5}
          maxLength={500}
          required
        />
      </ServerForm>
    </SectionCard>
  );
}
