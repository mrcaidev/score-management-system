import { accountSchema } from "account/types";
import { courseSchema } from "course/types";
import { examSchema } from "exam/types";
import { z } from "zod";

export enum ReviewStatus {
  NONE = 1,
  PENDING,
  REJECTED,
  ACCEPTED,
  FINISHED,
}

export const scoreSchema = z.object({
  id: z.string().uuid(),
  examId: examSchema.shape.id,
  courseId: courseSchema.shape.id,
  studentId: accountSchema.shape.id,
  score: z.number().nonnegative(),
  isAbsent: z.boolean(),
  reviewStatus: z.nativeEnum(ReviewStatus),
});

export type Score = z.infer<typeof scoreSchema>;

export const fullScoreSchema = scoreSchema
  .omit({ examId: true, courseId: true, studentId: true })
  .merge(
    z.object({
      exam: examSchema,
      course: courseSchema,
      student: accountSchema,
    })
  );

export type FullScore = z.infer<typeof fullScoreSchema>;

export const findAllReqSchema = z.object({
  query: scoreSchema
    .pick({ examId: true, courseId: true, studentId: true, reviewStatus: true })
    .partial(),
});

export type FindAllReq = z.infer<typeof findAllReqSchema>;

export const createReqSchema = z.object({
  body: scoreSchema.omit({ id: true, reviewStatus: true }),
});

export type CreateReq = z.infer<typeof createReqSchema>;

export const updateReqSchema = z.object({
  params: scoreSchema.pick({ id: true }),
  body: scoreSchema.pick({ score: true, reviewStatus: true }).partial(),
});

export type UpdateReq = z.infer<typeof updateReqSchema>;

export const deleteReqSchema = z.object({
  params: scoreSchema.pick({ id: true }),
});

export type DeleteReq = z.infer<typeof deleteReqSchema>;
