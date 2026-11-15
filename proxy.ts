import { createProxy } from "@zellapay/app-kit/server";
import { sessionCookieName } from "@/lib/auth/cookie-name";

/** Only sign-in needs no session cookie. */
export const proxy = createProxy({
  cookieName: sessionCookieName,
  publicSegments: ["sign-in"],
  signInSegment: "sign-in",
});

export const config = {
  matcher: [{ source: "/((?!_next/static|_next/image|favicon.ico).*)" }],
};
