import "server-only";
import { createSessionStore } from "@zellapay/app-kit/server";
import { serverConfig } from "@/lib/config/server";
import { sessionCookieName } from "./cookie-name";

const eightHours = 8 * 60 * 60;

// Strict, not Lax: the admin console is never reached from another site.
const store = createSessionStore({
  cookieName: sessionCookieName,
  secret: () => serverConfig().SESSION_SECRET,
  ttlSeconds: eightHours,
  sameSite: "strict",
});

/** The backend session token, if the browser has a valid cookie. */
export const readSessionToken = store.read;

/** Stores the token. Only Server Actions and Route Handlers may call this. */
export const saveSessionToken = store.save;

export const clearSessionToken = store.clear;
