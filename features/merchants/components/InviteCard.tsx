"use client";

import { Alert, SectionCard, Select, TextField } from "@zellapay/ui";
import { ServerForm, type FormAction } from "@zellapay/app-kit";
import type { Invitation } from "@/lib/api/types";
import { useT } from "@/lib/i18n/provider";
import { merchantRoles } from "../schemas";

/** Sends one person a link to join the merchant. The reason is audited. */
export function InviteCard({ action }: { action: FormAction<Invitation> }) {
  const t = useT();
  const roles = merchantRoles.map((value) => ({
    value,
    label: t(`merchants.invite.roles.${value}`),
  }));
  return (
    <SectionCard title={t("merchants.invite.title")} subtitle={t("merchants.invite.subtitle")}>
      <ServerForm
        action={action}
        submit={t("merchants.invite.submit")}
        renderDone={(invitation, dismiss) => (
          <div className="space-y-3">
            <Alert tone="success">{t("merchants.invite.done", { email: invitation.email })}</Alert>
            <button type="button" className="text-[13px] underline" onClick={dismiss}>
              {t("merchants.invite.another")}
            </button>
          </div>
        )}
      >
        <div className="grid gap-4 sm:grid-cols-[1fr_11rem]">
          <TextField name="email" type="email" label={t("merchants.invite.email")} required />
          <Select name="role" label={t("merchants.invite.role")} options={roles} />
        </div>
        <TextField
          name="reason"
          label={t("merchants.reason.label")}
          hint={t("merchants.reason.hint")}
          maxLength={500}
          required
        />
      </ServerForm>
    </SectionCard>
  );
}
