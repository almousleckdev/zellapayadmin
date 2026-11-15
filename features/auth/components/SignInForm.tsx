"use client";

import { ServerForm, useTranslate, type FormAction } from "@zellapay/app-kit";
import { PasswordField, TextField } from "@zellapay/ui";
import { useT } from "@/lib/i18n/provider";

export function SignInForm({ action }: { action: FormAction }) {
  const t = useT();
  const words = useTranslate();
  return (
    <ServerForm action={action} submit={t("auth.signIn.submit")}>
      <TextField
        name="email"
        type="email"
        label={t("auth.signIn.email")}
        autoComplete="username"
        autoCapitalize="none"
        spellCheck={false}
        required
      />
      <PasswordField
        name="password"
        label={t("auth.signIn.password")}
        autoComplete="current-password"
        showLabel={words("common.show")}
        hideLabel={words("common.hide")}
        required
      />
    </ServerForm>
  );
}
