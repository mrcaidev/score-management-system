import { Infer } from "utils/types";
import { z } from "zod";

export enum Role {
  STUDENT = 1,
  TEACHER,
}

export const secretAccountSchema = z.object({
  id: z.string().regex(/\d+/),
  name: z.string().nonempty(),
  role: z.nativeEnum(Role),
  password: z.string().nonempty(),
});

export type SecretAccount = Infer<typeof secretAccountSchema>;

export const accountSchema = secretAccountSchema.omit({ password: true });

export type Account = Infer<typeof accountSchema>;

export const findAllRequestSchema = z.object({
  query: z.object({ role: z.coerce.number().positive().int() }).partial(),
});

export type FindAllRequest = Infer<typeof findAllRequestSchema>;

export const createRequestSchema = z.object({
  body: secretAccountSchema.omit({ role: true, password: true }),
});

export type CreateRequest = Infer<typeof createRequestSchema>;

export const updateByIdRequestSchema = z.object({
  params: secretAccountSchema.pick({ id: true }),
  body: secretAccountSchema.omit({ id: true }).partial(),
});

export type UpdateByIdRequest = Infer<typeof updateByIdRequestSchema>;

export const removeByIdRequestSchema = z.object({
  params: secretAccountSchema.pick({ id: true }),
});

export type RemoveByIdRequest = Infer<typeof removeByIdRequestSchema>;
