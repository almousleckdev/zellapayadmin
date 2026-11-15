import { Welcome } from "@/features/overview/components/Welcome";
import { resolveLocale } from "@/lib/i18n/params";

export default async function Page({ params }: PageProps<"/[lang]">) {
  return <Welcome locale={await resolveLocale(params)} />;
}
