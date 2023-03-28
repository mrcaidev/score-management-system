import { z } from "zod";

export enum ReviewStatus {
  NONE,
  PENDING,
  ACCEPTED,
  REJECTED,
  FINISHED,
}

export const scoreSchema = z.object({
  id: z.string().uuid(),
  examId: z.string().uuid(),
  courseId: z.number().min(1),
  studentId: z.string().nonempty(),
  score: z.number().min(0),
  isAbsent: z.boolean(),
  reviewStatus: z.nativeEnum(ReviewStatus),
});

export type Score = z.infer<typeof scoreSchema>;

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
  body: scoreSchema.pick({ score: true }).partial(),
});

export type UpdateReq = z.infer<typeof updateReqSchema>;

export const deleteReqSchema = z.object({
  params: scoreSchema.pick({ id: true }),
});

export type DeleteReq = z.infer<typeof deleteReqSchema>;

export const requireReviewReqSchema = z.object({
  params: scoreSchema.pick({ id: true }),
});

export type RequireReviewReq = z.infer<typeof requireReviewReqSchema>;

export const handleReviewReqSchema = z.object({
  params: scoreSchema.pick({ id: true }),
  body: scoreSchema.pick({ reviewStatus: true }),
});

export type HandleReviewReq = z.infer<typeof handleReviewReqSchema>;
