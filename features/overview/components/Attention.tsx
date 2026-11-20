import { Card, Icon, type IconName } from "@zellapay/ui";
import Link from "next/link";
import type { Overview } from "@/lib/api/types";
import type { Locale } from "@/lib/i18n/locales";
import type { Translate } from "@/lib/i18n/translate";
import { route } from "@/lib/routes";

type Props = { o?: Overview; passkeys: number; locale: Locale; t: Translate };
type Item = { href: string; text: string; icon: IconName };

const recommendedPasskeys = 2;
const row = "group flex items-center gap-3 px-5 py-3 text-[13px] hover:bg-surface-muted/50";

function items({ o, passkeys, locale, t }: Props): Item[] {
  const list: Item[] = [];
  const merchants = route(locale, "merchants");
  if (o && o.pending_approvals > 0) {
    list.push({
      href: route(locale, "approvals"),
      text: t("home.attention.approvals", { count: o.pending_approvals }),
      icon: "check",
    });
  }
  if (o && o.by_status.pending > 0) {
    list.push({
      href: `${merchants}?status=pending`,
      text: t("home.attention.pending", { count: o.by_status.pending }),
      icon: "clock",
    });
  }
  if (o && o.by_status.suspended > 0) {
    list.push({
      href: `${merchants}?status=suspended`,
      text: t("home.attention.suspended", { count: o.by_status.suspended }),
      icon: "alert",
    });
  }
  if (passkeys < recommendedPasskeys) {
    list.push({
      href: route(locale, "security"),
      text: t("home.attention.passkey"),
      icon: "shield",
    });
  }
  return list;
}

/** What staff should look at next, each item linking to where to act. */
export function Attention(props: Props) {
  const list = items(props);
  return (
    <Card>
      <h2 className="border-b border-border px-5 py-3.5 text-sm font-semibold">
        {props.t("home.attention.title")}
      </h2>
      {list.length === 0 ? (
        <p className="px-5 py-8 text-center text-[13px] text-muted">
          {props.t("home.attention.clear")}
        </p>
      ) : (
        <ul className="divide-y divide-border">
          {list.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={row}
              >
                <Icon name={item.icon} className="size-4 text-warning" />
                <span className="flex-1">{item.text}</span>
                <Icon
                  name="arrowRight"
                  className="size-4 text-muted transition-transform group-hover:translate-x-0.5"
                />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
