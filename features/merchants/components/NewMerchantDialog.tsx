"use client";

import { useState } from "react";
import type { FormAction } from "@zellapay/app-kit";
import { Button, Icon, Modal } from "@zellapay/ui";
import { useT } from "@/lib/i18n/provider";
import { NewMerchantForm } from "./NewMerchantForm";

/** The "New merchant" button and the modal it opens. */
export function NewMerchantDialog({ action }: { action: FormAction }) {
  const t = useT();
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Icon name="plus" />
        {t("merchants.create.cta")}
      </Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={t("merchants.create.title")}
        subtitle={t("merchants.create.subtitle")}
        closeLabel={t("common.close")}
      >
        <NewMerchantForm action={action} onCancel={() => setOpen(false)} />
      </Modal>
    </>
  );
}
