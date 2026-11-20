"use client";

import { useState, type ReactNode } from "react";
import { ServerForm, type FormAction } from "@zellapay/app-kit";
import { Alert, Button, Modal, TextField, type ButtonVariant } from "@zellapay/ui";
import type { ChangeRequest } from "@/lib/api/types";
import { useT } from "@/lib/i18n/provider";

type ReasonDialogProps = {
  trigger: string;
  triggerVariant?: ButtonVariant;
  title: string;
  subtitle?: string;
  submit: string;
  done: string;
  action: FormAction<ChangeRequest>;
  /** Extra fields shown above the reason. */
  children?: ReactNode;
};

/** A button that opens a modal asking for a reason, plus any extra fields. */
export function ReasonDialog(props: ReasonDialogProps) {
  const { trigger, triggerVariant = "primary", title, subtitle, submit, done, action } = props;
  const t = useT();
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button size="sm" variant={triggerVariant} onClick={() => setOpen(true)}>
        {trigger}
      </Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={title}
        subtitle={subtitle}
        closeLabel={t("common.close")}
      >
        <ServerForm
          action={action}
          layout="end"
          submit={submit}
          footer={
            <Button variant="secondary" onClick={() => setOpen(false)}>
              {t("common.cancel")}
            </Button>
          }
          renderDone={() => (
            <div className="space-y-4">
              <Alert tone="success">{done}</Alert>
              <div className="flex justify-end">
                <Button onClick={() => setOpen(false)}>{t("common.close")}</Button>
              </div>
            </div>
          )}
        >
          {props.children}
          <TextField
            name="reason"
            label={t("merchants.reason.label")}
            hint={t("merchants.reason.hint")}
            maxLength={500}
            required
          />
        </ServerForm>
      </Modal>
    </>
  );
}
