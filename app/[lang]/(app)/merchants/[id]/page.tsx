import { MerchantDetail } from "@/features/merchants/components/MerchantDetail";
import { resolveLocale } from "@/lib/i18n/params";

export default async function Page({
  params,
  searchParams,
}: PageProps<"/[lang]/merchants/[id]">) {
  const [locale, { id }, query] = [await resolveLocale(params), await params, await searchParams];
  const notice = Array.isArray(query.notice) ? query.notice[0] : query.notice;
  return <MerchantDetail locale={locale} id={id} notice={notice} />;
}
