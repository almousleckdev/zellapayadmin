import { z } from "zod";

/** The typed reason staff give for a status change. It is audited. */
export const reasonSchema = z.object({
  reason: z.string().trim().min(5, "reasonShort").max(500, "reasonLong"),
});

export const merchantIdSchema = z.string().min(1).max(128);
