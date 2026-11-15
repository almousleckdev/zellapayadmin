import { describe, expect, it } from "vitest";
import { route } from "./routes";

describe("route", () => {
  it("builds localized paths", () => {
    expect(route("fr", "home")).toBe("/fr");
    expect(route("en", "passkeySetup")).toBe("/en/passkey/setup");
  });

  it("adds an encoded query", () => {
    expect(route("fr", "signIn", { next: "security" })).toBe("/fr/sign-in?next=security");
  });
});
