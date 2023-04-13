import { Infer } from "utils/types";
import { z } from "zod";

export const examSchema = z.object({
  id: z.string().uuid(),
  name: z.string().nonempty(),
  heldAt: z.string().datetime(),
});

export type Exam = Infer<typeof examSchema>;

export const createRequestSchema = z.object({
  body: examSchema.omit({ id: true }),
});

export type CreateRequest = Infer<typeof createRequestSchema>;

export const updateByIdRequestSchema = z.object({
  params: examSchema.pick({ id: true }),
  body: examSchema.omit({ id: true }).partial(),
});

export type UpdateByIdRequest = Infer<typeof updateByIdRequestSchema>;

export const removeByIdRequestSchema = z.object({
  params: examSchema.pick({ id: true }),
});

export type RemoveByIdRequest = Infer<typeof removeByIdRequestSchema>;
