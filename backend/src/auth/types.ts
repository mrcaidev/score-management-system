import { secretAccountSchema } from "account/types";
import { Infer } from "utils/types";
import { z } from "zod";

export const loginRequestSchema = z.object({
  body: secretAccountSchema.pick({ id: true, password: true }),
});

export type LoginRequest = Infer<typeof loginRequestSchema>;
