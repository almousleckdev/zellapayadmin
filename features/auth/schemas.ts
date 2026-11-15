import { z } from "zod";
import { fields } from "@zellapay/app-kit";

export const signInSchema = z.object({
  email: fields.email,
  password: fields.currentPassword,
});
