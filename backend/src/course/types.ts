import { Infer } from "utils/types";
import { z } from "zod";

export const courseSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().nonempty(),
  maxScore: z.number().positive(),
});

export type Course = Infer<typeof courseSchema>;
