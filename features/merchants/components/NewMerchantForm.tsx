"use client";

import { ServerForm, type FormAction } from "@zellapay/app-kit";
import { Button, TextField } from "@zellapay/ui";
import { useT } from "@/lib/i18n/provider";

type Props = { action: FormAction; onCancel: () => void };

/** The fields for registering a merchant, and optionally inviting its owner. */
export function NewMerchantForm({ action, onCancel }: Props) {
  const t = useT();
  return (
    <ServerForm
      action={action}
      layout="end"
      submit={t("merchants.create.submit")}
      footer={
        <Button variant="secondary" onClick={onCancel}>
          {t("common.cancel")}
        </Button>
      }
    >
      <div className="grid gap-4 sm:grid-cols-[1fr_7rem]">
        <TextField name="name" label={t("merchants.create.name")} maxLength={100} required />
        <TextField
          name="currency"
          label={t("merchants.create.currency")}
          defaultValue="XAF"
          maxLength={3}
          className="uppercase"
          required
        />
      </div>
      <TextField
        name="ownerEmail"
        type="email"
        label={t("merchants.create.owner")}
        hint={t("merchants.create.ownerHint")}
        autoComplete="off"
      />
      <TextField
        name="reason"
        label={t("merchants.reason.label")}
        hint={t("merchants.create.reasonHint")}
        maxLength={500}
        required
      />
    </ServerForm>
  );
}
