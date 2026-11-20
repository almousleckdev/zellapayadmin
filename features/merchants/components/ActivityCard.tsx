import { Card } from "@zellapay/ui";
import type { Activity } from "@/lib/api/types";
import { dateFormatter } from "@/lib/i18n/date";
import type { Locale } from "@/lib/i18n/locales";
import type { MessageKey, Translate } from "@/lib/i18n/translate";

type Props = { entries: Activity["data"]; locale: Locale; t: Translate };

const known = new Set([
  "merchant.created", "merchant.suspended", "merchant.restored", "merchant.activated",
  "merchant.activation_requested", "merchant.fees_requested", "merchant.fees_changed",
  "merchant.change_rejected", "api_key.created", "api_key.rotated", "api_key.revoked",
]);

/** An action's name in words, or the raw name for one we have no words for. */
function label(action: string, t: Translate): string {
  return known.has(action) ? t(`activity.actions.${action}` as MessageKey) : action;
}

/** What staff and the system did to this merchant, newest first. */
export function ActivityCard({ entries, locale, t }: Props) {
  const when = dateFormatter(locale);
  return (
    <Card>
      <h2 className="border-b border-border px-5 py-3.5 text-sm font-semibold">
        {t("activity.title")}
      </h2>
      {entries.length === 0 ? (
        <p className="px-5 py-8 text-center text-[13px] text-muted">{t("activity.empty")}</p>
      ) : (
        <ol className="divide-y divide-border">
          {entries.map((e) => (
            <li key={`${e.at}-${e.action}`} className="px-5 py-3">
              <p className="text-[13px] font-medium">{label(e.action, t)}</p>
              {e.reason ? <p className="text-[13px] text-muted">{e.reason}</p> : null}
              <p className="mt-0.5 text-xs text-muted">
                {e.actor} · {when.format(new Date(e.at))}
              </p>
            </li>
          ))}
        </ol>
      )}
    </Card>
  );
}
