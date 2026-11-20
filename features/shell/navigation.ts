import { admin } from "@/lib/api/admin";
import type { Current } from "@/lib/api/types";
import type { Locale } from "@/lib/i18n/locales";
import type { Translate } from "@/lib/i18n/translate";
import { route } from "@/lib/routes";
import type { NavItem } from "@zellapay/ui";

type Input = { locale: Locale; token: string; current: Current; t: Translate };

type Counts = { merchants?: number; approvals?: number };

const orNothing = (n: number | undefined) => (n && n > 0 ? n : undefined);

/** Merchants waiting for activation and requests waiting for a decision. */
async function waiting(token: string): Promise<Counts> {
  const res = await admin.getOverview({ token }, 1);
  if (!res.ok) return {};
  return {
    merchants: orNothing(res.data.by_status.pending),
    approvals: orNothing(res.data.pending_approvals),
  };
}

/** The sidebar: a workspace section and an account section. */
export async function navItems({ locale, token, current, t }: Input): Promise<NavItem[]> {
  const workspace = t("common.navWorkspace");
  const items: NavItem[] = [
    { href: route(locale, "home"), label: t("nav.overview"), icon: "overview", group: workspace },
  ];
  if (current.permissions.includes("merchants:read")) {
    const count = await waiting(token);
    items.push(
      {
        href: route(locale, "merchants"),
        label: t("nav.merchants"),
        icon: "merchants",
        group: workspace,
        badge: count.merchants,
      },
      {
        href: route(locale, "approvals"),
        label: t("nav.approvals"),
        icon: "check",
        group: workspace,
        badge: count.approvals,
      },
    );
  }
  items.push({
    href: route(locale, "security"),
    label: t("nav.security"),
    icon: "shield",
    group: t("common.navAccount"),
  });
  return items;
}
