import { MerchantsOverview } from "@/features/merchants/components/MerchantsOverview";
import { resolveLocale } from "@/lib/i18n/params";

export default async function Page({ params, searchParams }: PageProps<"/[lang]/merchants">) {
  const locale = await resolveLocale(params);
  return <MerchantsOverview locale={locale} searchParams={await searchParams} />;
}
