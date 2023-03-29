import { z } from "zod";

export enum Role {
  STUDENT,
  TEACHER,
}

export type Auth = {
  id: string;
  role: Role;
};

export const loginReqSchema = z.object({
  body: z.object({
    id: z.string().nonempty(),
    password: z.string().nonempty(),
  }),
});

export type LoginReq = z.infer<typeof loginReqSchema>;
