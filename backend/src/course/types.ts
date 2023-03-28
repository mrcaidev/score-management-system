import { z } from "zod";

export const courseSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().nonempty(),
  maxScore: z.number().positive(),
});

export type Course = z.infer<typeof courseSchema>;
