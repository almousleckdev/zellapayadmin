"use client";

import type { FormState } from "@zellapay/app-kit";
import { useT } from "@/lib/i18n/provider";
import { proveWithPasskey } from "@/lib/webauthn/browser";
import type { CeremonyOptions } from "../actions/passkeys";
import { PasskeyCeremony } from "./PasskeyCeremony";

type PasskeyLoginProps = {
  begin: () => Promise<FormState<CeremonyOptions>>;
  finish: (credential: unknown) => Promise<FormState<true>>;
  next: string;
};

/** Proves a registered passkey: begin, let the browser sign, then check. */
export function PasskeyLogin({ begin, finish, next }: PasskeyLoginProps) {
  const t = useT();

  async function run() {
    const started = await begin();
    if (started.status !== "done") return started.status === "error" ? started : null;
    const credential = await proveWithPasskey(started.payload.options);
    if (typeof credential === "string") return credential;
    const checked = await finish(credential);
    return checked.status === "error" ? checked : null;
  }

  return <PasskeyCeremony run={run} action={t("auth.passkey.use")} next={next} />;
}
