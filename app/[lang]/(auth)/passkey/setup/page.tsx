import { Suspense } from "react";
import { AuthPage } from "@/features/auth/components/AuthPage";
import {
  beginRegistrationAction,
  finishRegistrationAction,
} from "@/features/passkeys/actions/passkeys";
import { PasskeyRegistration } from "@/features/passkeys/components/PasskeyRegistration";
import { requirePending } from "@/lib/auth/dal";
import type { Locale } from "@/lib/i18n/locales";
import { resolveLocale } from "@/lib/i18n/params";
import { route } from "@/lib/routes";

export default async function Page({ params }: PageProps<"/[lang]/passkey/setup">) {
  const locale = await resolveLocale(params);
  return (
    <AuthPage locale={locale} scope="auth.setup">
      <Suspense>
        <Guard locale={locale} />
      </Suspense>
    </AuthPage>
  );
}

async function Guard({ locale }: { locale: Locale }) {
  await requirePending(locale, "enrol_required");
  return (
    <PasskeyRegistration
      begin={beginRegistrationAction.bind(null, locale)}
      finish={finishRegistrationAction.bind(null, locale)}
      next={route(locale, "home")}
    />
  );
}
