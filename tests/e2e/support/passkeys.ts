import type { CDPSession, Page } from "@playwright/test";

/**
 * Gives the page a virtual authenticator, so passkey ceremonies run for real
 * in Chromium without a person touching a key. Registered passkeys live as
 * long as the page does.
 */
export async function addVirtualAuthenticator(page: Page): Promise<Authenticators> {
  const client = await page.context().newCDPSession(page);
  await client.send("WebAuthn.enable");
  let current = await create(client);
  return {
    /** Swaps in a new authenticator, like registering on a second device. */
    async replace() {
      await client.send("WebAuthn.removeVirtualAuthenticator", { authenticatorId: current });
      current = await create(client);
    },
  };
}

export type Authenticators = { replace: () => Promise<void> };

async function create(client: CDPSession): Promise<string> {
  const { authenticatorId } = await client.send("WebAuthn.addVirtualAuthenticator", {
    options: {
      protocol: "ctap2",
      transport: "internal",
      hasResidentKey: false,
      hasUserVerification: true,
      isUserVerified: true,
      automaticPresenceSimulation: true,
    },
  });
  return authenticatorId;
}
