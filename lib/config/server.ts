import "server-only";
import { z } from "zod";

const schema = z.object({
  ZELLAPAY_API_URL: z.url(),
  SESSION_SECRET: z.string().min(32, "SESSION_SECRET needs at least 32 characters"),
  // Name of a header the edge overwrites with the real client address.
  CLIENT_IP_HEADER: z.string().regex(/^[a-z0-9-]*$/).optional(),
});

export type ServerConfig = z.infer<typeof schema>;

let cached: ServerConfig | undefined;

/** Reads and validates the environment once. The error names the variable. */
export function serverConfig(): ServerConfig {
  if (cached) return cached;
  const parsed = schema.safeParse(process.env);
  if (!parsed.success) {
    const names = parsed.error.issues.map((i) => i.path.join(".")).join(", ");
    throw new Error(`Invalid configuration: ${names}`);
  }
  cached = parsed.data;
  return cached;
}
