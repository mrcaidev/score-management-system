import { Role } from "account";
import { sign, verify } from "jsonwebtoken";
import { z } from "zod";
import { JWT_SECRET } from "./env";
import { HttpError } from "./error";

export const authSchema = z.object({
  id: z.string().nonempty(),
  role: z.nativeEnum(Role),
});

export type AuthPayload = z.infer<typeof authSchema>;

export async function generateJwt(payload: AuthPayload) {
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
    throw new HttpError(500, "登录失败，请稍后再试");
  }
}

export async function decodeJwt(token: string) {
  try {
    const payload = await new Promise<AuthPayload>((resolve, reject) => {
      verify(token, JWT_SECRET, (error, payload) => {
        if (error || !payload) {
          return reject(error);
        }
        return resolve(authSchema.parse(payload));
      });
    });
    return payload;
  } catch {
    throw new HttpError(401, "登录信息无效");
  }
}
