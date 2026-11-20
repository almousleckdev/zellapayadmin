import { Card } from "@zellapay/ui";
import type { Current } from "@/lib/api/types";
import { dateFormatter } from "@/lib/i18n/date";
import type { Locale } from "@/lib/i18n/locales";
import type { MessageKey, Translate } from "@/lib/i18n/translate";

type Props = { current: Current; locale: Locale; t: Translate };

function Panel({ title, rows, note }: { title: string; rows: [string, string][]; note?: string }) {
  return (
    <Card>
      <h2 className="border-b border-border px-5 py-3.5 text-sm font-semibold">{title}</h2>
      <dl className="divide-y divide-border">
        {rows.map(([label, value]) => (
          <div key={label} className="flex items-baseline justify-between gap-4 px-5 py-2.5">
            <dt className="text-[13px] text-muted">{label}</dt>
            <dd className="text-end text-[13px]">{value}</dd>
          </div>
        ))}
      </dl>
      {note ? <p className="border-t border-border px-5 py-3 text-xs text-muted">{note}</p> : null}
    </Card>
  );
}

/** Who is signed in and how long this session lasts. */
export function SecurityAccount({ current, locale, t }: Props) {
  const when = dateFormatter(locale);
  const { user, session } = current;
  const verified = session.mfa_verified_at ? when.format(new Date(session.mfa_verified_at)) : "–";
  return (
    <div className="space-y-6">
      <Panel
        title={t("security.account.title")}
        rows={[
          [t("security.account.name"), user.name],
          [t("security.account.email"), user.email],
          [t("security.account.role"), t(`roles.${user.role}` as MessageKey)],
        ]}
      />
      <Panel
        title={t("security.session.title")}
        note={t("security.session.note")}
        rows={[
          [t("security.session.started"), when.format(new Date(session.created_at))],
          [t("security.session.verified"), verified],
          [t("security.session.expires"), when.format(new Date(session.expires_at))],
        ]}
      />
    </div>
  );
}
