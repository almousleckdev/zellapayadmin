import { Button } from "@zellapay/ui";
import { signOutAction } from "../actions/sign-out";
import type { Locale } from "@/lib/i18n/locales";

/** A quiet "use another account" button for pages in the middle of sign-in. */
export function SignOutLink({ locale, label }: { locale: Locale; label: string }) {
  return (
    <form action={signOutAction.bind(null, locale)}>
      <Button type="submit" variant="ghost" size="sm">
        {label}
      </Button>
    </form>
  );
}
