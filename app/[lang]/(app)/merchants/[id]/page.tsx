import { MerchantDetail } from "@/features/merchants/components/MerchantDetail";
import { resolveLocale } from "@/lib/i18n/params";

export default async function Page({ params }: PageProps<"/[lang]/merchants/[id]">) {
  const [locale, { id }] = [await resolveLocale(params), await params];
  return <MerchantDetail locale={locale} id={id} />;
}
