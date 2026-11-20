import { mergeMessages } from "@zellapay/app-kit";
import baseEn from "@zellapay/app-kit/messages/en.json";
import baseFr from "@zellapay/app-kit/messages/fr.json";
import approvalsEn from "@/messages/approvals.en.json";
import approvalsFr from "@/messages/approvals.fr.json";
import en from "@/messages/en.json";
import fr from "@/messages/fr.json";
import type { Messages } from "@/lib/i18n/translate";

/** The catalogues as the app shows them: shared sections plus its own. */
export const catalogues: { fr: Messages; en: Messages } = {
  fr: mergeMessages(mergeMessages(baseFr, fr), approvalsFr),
  en: mergeMessages(mergeMessages(baseEn, en), approvalsEn),
};
