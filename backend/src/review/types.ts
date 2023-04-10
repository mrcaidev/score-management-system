import { scoreSchema } from "score/types";
import { z } from "zod";

export const createRequestSchema = z.object({
  body: scoreSchema.pick({ examId: true, courseId: true }),
});

export type CreateRequest = z.infer<typeof createRequestSchema>;

export const updateByIdRequestSchema = z.object({
  params: scoreSchema.pick({ id: true }),
  body: scoreSchema.pick({ reviewStatus: true }),
});

export type UpdateByIdRequest = z.infer<typeof updateByIdRequestSchema>;

export const removeByIdRequestSchema = z.object({
  params: scoreSchema.pick({ id: true }),
});

export type RemoveByIdRequest = z.infer<typeof removeByIdRequestSchema>;
