import { afterEach, describe, expect, it, vi } from "vitest";
import { createPasskey, passkeysSupported } from "./browser";

afterEach(() => vi.unstubAllGlobals());

describe("passkeysSupported", () => {
  it("is false where the browser has no passkey API", () => {
    expect(passkeysSupported()).toBe(false);
  });

  it("needs the JSON helpers that convert options for the browser", () => {
    vi.stubGlobal("PublicKeyCredential", {});
    expect(passkeysSupported()).toBe(false);
    vi.stubGlobal("PublicKeyCredential", {
      parseCreationOptionsFromJSON: () => ({}),
      parseRequestOptionsFromJSON: () => ({}),
    });
    expect(passkeysSupported()).toBe(true);
  });
});

describe("a ceremony", () => {
  function browserThatThrows(name: string) {
    vi.stubGlobal("PublicKeyCredential", { parseCreationOptionsFromJSON: () => ({}) });
    vi.stubGlobal("navigator", {
      credentials: { create: () => Promise.reject(new DOMException("no", name)) },
    });
  }

  it("reports a cancellation instead of failing", async () => {
    browserThatThrows("NotAllowedError");
    expect(await createPasskey({ publicKey: {} })).toBe("cancelled");
  });

  it("reports a device that already holds the passkey", async () => {
    browserThatThrows("InvalidStateError");
    expect(await createPasskey({ publicKey: {} })).toBe("exists");
  });

  it("lets unexpected errors through", async () => {
    browserThatThrows("SecurityError");
    await expect(createPasskey({ publicKey: {} })).rejects.toThrow();
  });
});
