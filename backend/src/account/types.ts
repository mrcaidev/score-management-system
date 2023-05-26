import { Infer } from "utils/types";
import { z } from "zod";

export enum Role {
  STUDENT = 1,
  TEACHER,
}

export const accountSchema = z.object({
  id: z.string().regex(/\d+/),
  name: z.string().nonempty(),
  role: z.coerce.number().min(1).max(2),
});

export type Account = Infer<typeof accountSchema>;

export const secretAccountSchema = accountSchema.extend({
  password: z.string().nonempty(),
});

export type SecretAccount = Infer<typeof secretAccountSchema>;

export const findRequestSchema = z.object({
  query: accountSchema.pick({ role: true }).partial(),
});

export type FindRequest = Infer<typeof findRequestSchema>;

export const createRequestSchema = z.object({
  body: accountSchema.omit({ role: true }),
});

export type CreateRequest = Infer<typeof createRequestSchema>;

export const updateByIdRequestSchema = z.object({
  params: accountSchema.pick({ id: true }),
  body: accountSchema.omit({ id: true }).partial(),
});

export type UpdateByIdRequest = Infer<typeof updateByIdRequestSchema>;

export const removeByIdRequestSchema = z.object({
  params: accountSchema.pick({ id: true }),
});

export type RemoveByIdRequest = Infer<typeof removeByIdRequestSchema>;
