import { Badge, type BadgeTone } from "@zellapay/ui";
import type { MerchantStatus } from "@/lib/api/types";
import type { Translate } from "@/lib/i18n/translate";

const tones: Record<MerchantStatus, BadgeTone> = {
  pending: "neutral",
  active: "success",
  suspended: "danger",
};

/** A merchant's status, always as text and colour together. */
export function StatusBadge({ status, t }: { status: MerchantStatus; t: Translate }) {
  return <Badge tone={tones[status]}>{t(`merchants.status.${status}`)}</Badge>;
}
