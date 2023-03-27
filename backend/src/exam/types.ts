import { z } from "zod";

export const examSchema = z.object({
  id: z.string().uuid(),
  name: z.string().nonempty(),
  heldAt: z.string().datetime(),
});

export type Exam = z.infer<typeof examSchema>;

export const createReqSchema = z.object({
  body: examSchema.omit({ id: true }),
});

export type CreateReq = z.infer<typeof createReqSchema>;

export const updateReqSchema = z.object({
  params: examSchema.pick({ id: true }),
  body: examSchema.omit({ id: true }).partial(),
});

export type UpdateReq = z.infer<typeof updateReqSchema>;

export const deleteReqSchema = z.object({
  params: examSchema.pick({ id: true }),
});

export type DeleteReq = z.infer<typeof deleteReqSchema>;
