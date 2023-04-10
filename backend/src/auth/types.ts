import { secretAccountSchema } from "account/types";
import { z } from "zod";

export const loginRequestSchema = z.object({
  body: secretAccountSchema.pick({ id: true, password: true }),
});

export type LoginRequest = z.infer<typeof loginRequestSchema>;
