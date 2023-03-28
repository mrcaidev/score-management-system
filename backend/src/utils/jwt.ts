import { sign, verify } from "jsonwebtoken";
import { z } from "zod";
import { JWT_SECRET } from "./env";
import { InternalServerError, UnauthorizedError } from "./http-error";

export const authSchema = z.object({
  id: z.string().nonempty(),
  role: z.number().int(),
});

export type Auth = z.infer<typeof authSchema>;

export async function generateJwt(payload: Auth) {
  try {
    const token = await new Promise<string>((resolve, reject) => {
      sign(payload, JWT_SECRET, { expiresIn: "1d" }, (error, token) => {
        if (error || !token) {
          return reject(error);
        }
        return resolve(token);
      });
    });
    return token;
  } catch {
    throw new InternalServerError("登录失败，请稍后再试");
  }
}

export async function decodeJwt(token: string) {
  try {
    const payload = await new Promise<Auth>((resolve, reject) => {
      verify(token, JWT_SECRET, (error, payload) => {
        if (error || !payload) {
          return reject(error);
        }
        return resolve(authSchema.parse(payload));
      });
    });
    return payload;
  } catch {
    throw new UnauthorizedError("登录信息无效");
  }
}
