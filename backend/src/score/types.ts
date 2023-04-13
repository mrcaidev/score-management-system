import { accountSchema } from "account/types";
import { courseSchema } from "course/types";
import { examSchema } from "exam/types";
import { Infer } from "utils/types";
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

export type Score = Infer<typeof scoreSchema>;

export const fullScoreSchema = scoreSchema
  .omit({ examId: true, courseId: true, studentId: true })
  .merge(
    z.object({
      exam: examSchema,
      course: courseSchema,
      student: accountSchema,
    })
  );

export type FullScore = Infer<typeof fullScoreSchema>;

export const findAllRequestSchema = z.object({
  query: scoreSchema.pick({ examId: true, studentId: true }).partial(),
});

export type FindAllRequest = Infer<typeof findAllRequestSchema>;

export const createRequestSchema = z.object({
  body: scoreSchema.omit({ id: true, reviewStatus: true }),
});

export type CreateRequest = Infer<typeof createRequestSchema>;

export const updateByIdRequestSchema = z.object({
  params: scoreSchema.pick({ id: true }),
  body: scoreSchema.pick({ isAbsent: true, score: true }).partial(),
});

export type UpdateByIdRequest = Infer<typeof updateByIdRequestSchema>;

export const removeByIdRequestSchema = z.object({
  params: scoreSchema.pick({ id: true }),
});

export type RemoveByIdRequest = Infer<typeof removeByIdRequestSchema>;
