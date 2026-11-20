import type { ReactNode } from "react";
import { AuthFrame } from "@zellapay/app-kit";
import type { Locale } from "@/lib/i18n/locales";
import { getTranslate } from "@/lib/i18n/server";
import type { MessageKey } from "@/lib/i18n/translate";

type AuthPageProps = {
  locale: Locale;
  /** Catalogue prefix of the page, for example "auth.signIn". */
  scope: "auth.signIn" | "auth.passkey" | "auth.setup";
  footer?: ReactNode;
  children: ReactNode;
};

/** The frame of every pre-sign-in page, titled from its catalogue scope. */
export async function AuthPage({ locale, scope, footer, children }: AuthPageProps) {
  const t = await getTranslate(locale);
  return (
    <AuthFrame
      appName={t("common.appName")}
      panel={{
        heading: t("auth.panel.heading"),
        points: [t("auth.panel.point1"), t("auth.panel.point2"), t("auth.panel.point3")],
      }}
      title={t(`${scope}.title` as MessageKey)}
      subtitle={t(`${scope}.subtitle` as MessageKey)}
      footer={footer}
    >
      {children}
    </AuthFrame>
  );
}
