import { z } from "zod";

export enum Role {
  STUDENT = 1,
  TEACHER = 2,
}

export const accountSchema = z.object({
  id: z.string().nonempty(),
  name: z.string().nonempty(),
  role: z.number().int(),
});

export type Account = z.infer<typeof accountSchema>;

export const loginReqSchema = z.object({
  body: z.object({
    id: z.string().nonempty(),
    password: z.string().nonempty(),
  }),
});

export type LoginReq = z.infer<typeof loginReqSchema>;
