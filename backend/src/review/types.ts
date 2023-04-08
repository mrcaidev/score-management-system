import { courseSchema } from "course/types";
import { examSchema } from "exam/types";
import { scoreSchema } from "score/types";
import { z } from "zod";

export const createReqSchema = z.object({
  body: z.object({
    examId: examSchema.shape.id,
    courseId: courseSchema.shape.id,
  }),
});

export type CreateReq = z.infer<typeof createReqSchema>;

export const updateReqSchema = z.object({
  params: scoreSchema.pick({ id: true }),
  body: scoreSchema.pick({ reviewStatus: true }),
});

export type UpdateReq = z.infer<typeof updateReqSchema>;

export const deleteReqSchema = z.object({
  params: scoreSchema.pick({ id: true }),
});

export type DeleteReq = z.infer<typeof deleteReqSchema>;
