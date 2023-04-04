import { secretAccountSchema } from "account/types";
import { z } from "zod";

export const loginReqSchema = z.object({
  body: secretAccountSchema.pick({ id: true, password: true }),
});

export type LoginReq = z.infer<typeof loginReqSchema>;
