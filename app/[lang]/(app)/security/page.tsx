import { PasskeysOverview } from "@/features/passkeys/components/PasskeysOverview";
import { resolveLocale } from "@/lib/i18n/params";

export default async function Page({ params }: PageProps<"/[lang]/security">) {
  return <PasskeysOverview locale={await resolveLocale(params)} />;
}
