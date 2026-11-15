import { Suspense } from "react";
import { PageSkeleton } from "@zellapay/ui";
import { AppFrame } from "@/features/shell/AppFrame";
import { resolveLocale } from "@/lib/i18n/params";

export default async function Layout({ children, params }: LayoutProps<"/[lang]">) {
  const locale = await resolveLocale(params);
  return (
    <Suspense fallback={<PageSkeleton />}>
      <AppFrame locale={locale}>{children}</AppFrame>
    </Suspense>
  );
}
