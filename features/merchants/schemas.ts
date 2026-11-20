import { z } from "zod";

/** The typed reason staff give for a status change. It is audited. */
export const reasonSchema = z.object({
  reason: z.string().trim().min(5, "reasonShort").max(500, "reasonLong"),
});

export const merchantIdSchema = z.string().min(1).max(128);

const email = z.string().trim().min(1, "required").pipe(z.email("emailInvalid"));
const reason = z.string().trim().min(5, "reasonShort").max(500, "reasonLong");

export const merchantRoles = ["owner", "admin", "developer", "finance", "support"] as const;

/** Creating a merchant, optionally inviting its owner in the same step. */
export const newMerchantSchema = z.object({
  name: z.string().trim().min(1, "required").max(100, "nameLong"),
  currency: z.string().trim().toUpperCase().regex(/^[A-Z]{3}$/, "currencyInvalid"),
  ownerEmail: z.union([z.literal(""), email]),
  reason,
});

export const inviteSchema = z.object({
  email,
  role: z.enum(merchantRoles, "required"),
  reason,
});

/** A percentage typed by a person, such as "1.5" or "2,25", in 0 to 100. */
const percent = z
  .string()
  .trim()
  .regex(/^\d{1,3}([.,]\d{1,2})?$/, "percentInvalid")
  .transform((text) => Math.round(Number(text.replace(",", ".")) * 100))
  .refine((bps) => bps <= 10_000, "percentInvalid");

export const feeChangeSchema = z.object({ fee: percent, payoutFee: percent, reason });
