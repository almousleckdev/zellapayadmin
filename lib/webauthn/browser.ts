import type { WebAuthnOptions } from "@/lib/api/admin";

/**
 * Browser side of passkeys. The backend speaks the WebAuthn JSON form, and
 * current browsers convert it to and from the binary form themselves, so
 * nothing here touches keys or challenges.
 */

type JsonCapable = {
  parseCreationOptionsFromJSON?: (o: unknown) => PublicKeyCredentialCreationOptions;
  parseRequestOptionsFromJSON?: (o: unknown) => PublicKeyCredentialRequestOptions;
};

function api(): JsonCapable | undefined {
  return typeof PublicKeyCredential === "undefined"
    ? undefined
    : (PublicKeyCredential as unknown as JsonCapable);
}

export function passkeysSupported(): boolean {
  const a = api();
  return Boolean(a?.parseCreationOptionsFromJSON && a.parseRequestOptionsFromJSON);
}

/** What a ceremony ends with, when it produced no credential. */
export type Refusal = "cancelled" | "exists";

/**
 * Runs a ceremony. It reports a refusal when the person cancels or times out,
 * or when this authenticator already holds one of their passkeys.
 */
async function run(
  start: () => Promise<Credential | null>,
): Promise<Record<string, unknown> | Refusal> {
  try {
    const credential = (await start()) as (Credential & { toJSON(): unknown }) | null;
    return credential ? (credential.toJSON() as Record<string, unknown>) : "cancelled";
  } catch (error) {
    if (error instanceof DOMException && error.name === "NotAllowedError") return "cancelled";
    if (error instanceof DOMException && error.name === "InvalidStateError") return "exists";
    throw error;
  }
}

export function createPasskey(options: WebAuthnOptions) {
  const publicKey = api()?.parseCreationOptionsFromJSON?.(options.publicKey);
  if (!publicKey) throw new Error("passkeys are not supported");
  return run(() => navigator.credentials.create({ publicKey }));
}

export function proveWithPasskey(options: WebAuthnOptions) {
  const publicKey = api()?.parseRequestOptionsFromJSON?.(options.publicKey);
  if (!publicKey) throw new Error("passkeys are not supported");
  return run(() => navigator.credentials.get({ publicKey }));
}
