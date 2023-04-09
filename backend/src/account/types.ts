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

export type SecretAccount = z.infer<typeof secretAccountSchema>;

export const accountSchema = secretAccountSchema.omit({ password: true });

export type Account = z.infer<typeof accountSchema>;

export const findAllReqSchema = z.object({
  query: secretAccountSchema.pick({ role: true }).partial(),
});

export type FindAllReq = z.infer<typeof findAllReqSchema>;

export const createReqSchema = z.object({
  body: secretAccountSchema.pick({ id: true, name: true }),
});

export type CreateReq = z.infer<typeof createReqSchema>;

export const updateReqSchema = z.object({
  params: secretAccountSchema.pick({ id: true }),
  body: secretAccountSchema.omit({ id: true }).partial(),
});

export type UpdateReq = z.infer<typeof updateReqSchema>;

export const deleteReqSchema = z.object({
  params: secretAccountSchema.pick({ id: true }),
});

export type DeleteReq = z.infer<typeof deleteReqSchema>;
