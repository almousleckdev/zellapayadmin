import { signInAction } from "@/features/auth/actions/sign-in";
import { AuthPage } from "@/features/auth/components/AuthPage";
import { SignInForm } from "@/features/auth/components/SignInForm";
import { resolveLocale } from "@/lib/i18n/params";

export default async function Page({ params }: PageProps<"/[lang]/sign-in">) {
  const locale = await resolveLocale(params);
  return (
    <AuthPage locale={locale} scope="auth.signIn">
      <SignInForm action={signInAction.bind(null, locale)} />
    </AuthPage>
  );
}
