import { z } from "zod";

export const accountSchema = z.object({
  id: z.string().nonempty(),
  name: z.string().nonempty(),
  role: z.number().int(),
});

export type Account = z.infer<typeof accountSchema>;
