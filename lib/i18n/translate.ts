import {
  createTranslate as create,
  type MessageKey as KeyOf,
  type Translate as TranslateTo,
} from "@zellapay/app-kit";
import type approvals from "@/messages/approvals.en.json";
import type en from "@/messages/en.json";
import type base from "@zellapay/app-kit/messages/en.json";

/** Every message this app can show: the shared ones and its own. */
export type Messages = typeof base & typeof en & typeof approvals;

export type MessageKey = KeyOf<Messages>;
export type Translate = TranslateTo<Messages>;

export function createTranslate(messages: Messages): Translate {
  return create(messages);
}
