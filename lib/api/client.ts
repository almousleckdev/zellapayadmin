import "server-only";
import { createApiClient, createRequestContext } from "@zellapay/app-kit/server";
import { serverConfig } from "@/lib/config/server";

/** Calls the backend for this app. */
export const call = createApiClient({
  baseUrl: () => serverConfig().ZELLAPAY_API_URL,
  context: createRequestContext(() => serverConfig().CLIENT_IP_HEADER),
});
