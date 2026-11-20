import type { ReactNode } from "react";
import { AppFrame as StaffFrame } from "@zellapay/app-kit";
import { signOutAction } from "@/features/auth/actions/sign-out";
import { requireStaff } from "@/lib/auth/dal";
import type { Locale } from "@/lib/i18n/locales";
import { getTranslate } from "@/lib/i18n/server";
import type { MessageKey } from "@/lib/i18n/translate";
import { route } from "@/lib/routes";
import { navItems } from "./navigation";

type AppFrameProps = { locale: Locale; children: ReactNode };

/** The signed-in frame. It reads the session, so it always sits in Suspense. */
export async function AppFrame({ locale, children }: AppFrameProps) {
  const [{ token, current }, t] = await Promise.all([
    requireStaff(locale),
    getTranslate(locale),
  ]);
  return (
    <StaffFrame
      logoHref={route(locale, "home")}
      appName={t("common.appName")}
      nav={{ label: t("nav.menu"), items: await navItems({ locale, token, current, t }) }}
      user={{ name: current.user.name, role: t(`roles.${current.user.role}` as MessageKey) }}
      signOut={{
        label: t("common.signOut"),
        action: signOutAction.bind(null, locale),
        confirm: {
          title: t("common.signOutTitle"),
          body: t("common.signOutBody"),
          confirm: t("common.signOut"),
          cancel: t("common.cancel"),
        },
      }}
      skipLabel={t("common.skip")}
      menuLabels={{
        open: t("common.menuOpen"),
        close: t("common.menuClose"),
        collapse: t("common.menuCollapse"),
        expand: t("common.menuExpand"),
      }}
    >
      {children}
    </StaffFrame>
  );
}
