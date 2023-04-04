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
