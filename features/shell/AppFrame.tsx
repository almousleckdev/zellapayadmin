import type { ReactNode } from "react";
import { AppFrame as StaffFrame } from "@zellapay/app-kit";
import { signOutAction } from "@/features/auth/actions/sign-out";
import { requireStaff } from "@/lib/auth/dal";
import type { Locale } from "@/lib/i18n/locales";
import { getTranslate } from "@/lib/i18n/server";
import type { MessageKey } from "@/lib/i18n/translate";
import { route } from "@/lib/routes";

type AppFrameProps = { locale: Locale; children: ReactNode };

/** The signed-in frame. It reads the session, so it always sits in Suspense. */
export async function AppFrame({ locale, children }: AppFrameProps) {
  const [{ current }, t] = await Promise.all([requireStaff(locale), getTranslate(locale)]);
  return (
    <StaffFrame
      logoHref={route(locale, "home")}
      appName={t("common.appName")}
      nav={{
        label: t("nav.menu"),
        items: [
          { href: route(locale, "home"), label: t("nav.overview") },
          ...(current.permissions.includes("merchants:read")
            ? [{ href: route(locale, "merchants"), label: t("nav.merchants") }]
            : []),
          { href: route(locale, "security"), label: t("nav.security") },
        ],
      }}
      user={{ name: current.user.name, role: t(`roles.${current.user.role}` as MessageKey) }}
      signOut={{ label: t("common.signOut"), action: signOutAction.bind(null, locale) }}
      skipLabel={t("common.skip")}
    >
      {children}
    </StaffFrame>
  );
}
