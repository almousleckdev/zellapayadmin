import { ApprovalsPage } from "@/features/approvals/components/ApprovalsPage";
import { resolveLocale } from "@/lib/i18n/params";

export default async function Page({ params }: PageProps<"/[lang]/approvals">) {
  return <ApprovalsPage locale={await resolveLocale(params)} />;
}
