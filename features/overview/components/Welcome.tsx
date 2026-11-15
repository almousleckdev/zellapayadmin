import { PageHeader, Badge, Alert, Card } from "@zellapay/ui";
import { requireStaff } from "@/lib/auth/dal";
import type { Locale } from "@/lib/i18n/locales";
import { getTranslate } from "@/lib/i18n/server";
import type { MessageKey } from "@/lib/i18n/translate";

const recommendedPasskeys = 2;

export async function Welcome({ locale }: { locale: Locale }) {
  const [{ current }, t] = await Promise.all([requireStaff(locale), getTranslate(locale)]);
  const { user } = current;
  return (
    <>
      <PageHeader title={t("home.welcome", { name: user.name })} />
      {current.passkeys < recommendedPasskeys ? (
        <Alert tone="warning">{t("home.secondPasskey")}</Alert>
      ) : null}
      <Card className="space-y-3">
        <Badge tone="neutral">
          {t("home.role", { role: t(`roles.${user.role}` as MessageKey) })}
        </Badge>
        <p className="text-sm text-muted">{t("home.intro")}</p>
      </Card>
    </>
  );
}
