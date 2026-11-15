import { Suspense } from "react";
import { AuthPage } from "@/features/auth/components/AuthPage";
import { SignOutLink } from "@/features/auth/components/SignOutLink";
import { beginLoginAction, finishLoginAction } from "@/features/passkeys/actions/passkeys";
import { PasskeyLogin } from "@/features/passkeys/components/PasskeyLogin";
import { requirePending } from "@/lib/auth/dal";
import type { Locale } from "@/lib/i18n/locales";
import { getTranslate } from "@/lib/i18n/server";
import { resolveLocale } from "@/lib/i18n/params";
import { route } from "@/lib/routes";

export default async function Page({ params }: PageProps<"/[lang]/passkey">) {
  const locale = await resolveLocale(params);
  return (
    <AuthPage locale={locale} scope="auth.passkey">
      <Suspense>
        <Guard locale={locale} />
      </Suspense>
    </AuthPage>
  );
}

async function Guard({ locale }: { locale: Locale }) {
  await requirePending(locale, "required");
  const t = await getTranslate(locale);
  return (
    <div className="space-y-3">
      <PasskeyLogin
        begin={beginLoginAction.bind(null, locale)}
        finish={finishLoginAction.bind(null, locale)}
        next={route(locale, "home")}
      />
      <SignOutLink locale={locale} label={t("auth.passkey.signOutInstead")} />
    </div>
  );
}
