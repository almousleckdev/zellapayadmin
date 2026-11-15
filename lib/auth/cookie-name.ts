/** Shared by the session code and the proxy, which skips server-only. */
export const sessionCookieName =
  process.env.NODE_ENV === "production" ? "__Host-zp_admin_session" : "zp_admin_session";
