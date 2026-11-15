"use client";

import { useState } from "react";
import { TextField } from "@zellapay/ui";
import { useT } from "@/lib/i18n/provider";
import { createPasskey } from "@/lib/webauthn/browser";
import type { CeremonyOptions } from "../actions/passkeys";
import { PasskeyCeremony } from "./PasskeyCeremony";
import type { FormState } from "@zellapay/app-kit";

type PasskeyRegistrationProps = {
  begin: () => Promise<FormState<CeremonyOptions>>;
  finish: (label: string, credential: unknown) => Promise<FormState<true>>;
  next?: string;
};

/** Registers a passkey: begin, let the browser create it, then store it. */
export function PasskeyRegistration({ begin, finish, next }: PasskeyRegistrationProps) {
  const t = useT();
  const [label, setLabel] = useState(t("auth.setup.labelDefault"));

  async function run() {
    const started = await begin();
    if (started.status !== "done") return started.status === "error" ? started : null;
    const credential = await createPasskey(started.payload.options);
    if (typeof credential === "string") return credential;
    const stored = await finish(label, credential);
    return stored.status === "error" ? stored : null;
  }

  return (
    <PasskeyCeremony run={run} action={t("auth.setup.start")} next={next}>
      <TextField
        name="label"
        label={t("auth.setup.label")}
        hint={t("auth.setup.labelHint")}
        value={label}
        onChange={(event) => setLabel(event.target.value)}
        maxLength={64}
        required
      />
    </PasskeyCeremony>
  );
}
