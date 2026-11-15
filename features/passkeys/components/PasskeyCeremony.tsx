"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition, type ReactNode } from "react";
import { FormProblem, type FormState } from "@zellapay/app-kit";
import { Alert, Button } from "@zellapay/ui";
import { useT } from "@/lib/i18n/provider";
import { passkeysSupported } from "@/lib/webauthn/browser";

type Failure = Extract<FormState, { status: "error" }>;
type Refusal = "cancelled" | "exists";

type PasskeyCeremonyProps = {
  /** Runs the whole ceremony. It returns an error to show, or nothing. */
  run: () => Promise<Failure | Refusal | null>;
  /** The button's text. */
  action: string;
  /** Where to go when it worked; the page refreshes when this is omitted. */
  next?: string;
  /** Fields shown above the button, such as a name for the passkey. */
  children?: ReactNode;
};

/**
 * The shell around a passkey ceremony: a button, the busy state, and what to
 * show when the browser cannot do passkeys, the person cancels, or the server
 * refuses. What the ceremony does is passed in as `run`.
 */
export function PasskeyCeremony({ run, action, next, children }: PasskeyCeremonyProps) {
  const t = useT();
  const router = useRouter();
  const [pending, start] = useTransition();
  const [problem, setProblem] = useState<Failure | Refusal | null>(null);
  const supported = passkeysSupported();

  function go() {
    start(async () => {
      const outcome = await run();
      setProblem(outcome);
      if (outcome) return;
      if (next) router.push(next);
      else router.refresh();
    });
  }

  return (
    <div className="space-y-5">
      {supported ? null : <Alert tone="error">{t("auth.passkey.unsupported")}</Alert>}
      {typeof problem === "string" ? (
        <Alert tone="warning">{t(`auth.passkey.${problem}`)}</Alert>
      ) : null}
      {problem && typeof problem !== "string" ? <FormProblem state={problem} /> : null}
      {children}
      <Button fullWidth onClick={go} pending={pending} disabled={!supported}
        pendingLabel={t("common.working")}>
        {action}
      </Button>
    </div>
  );
}
