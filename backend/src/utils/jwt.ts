import { sign, verify } from "jsonwebtoken";
import { z } from "zod";
import { JWT_SECRET } from "./env";
import { InternalServerError, UnauthorizedError } from "./http-error";

const payloadSchema = z.object({
  id: z.string().nonempty(),
});

type Payload = z.infer<typeof payloadSchema>;

export async function generateJwt(payload: Payload) {
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
  } catch (error) {
    throw new InternalServerError("登录失败，请稍后再试");
  }
}

export async function decodeJwt(token: string) {
  try {
    const payload = await new Promise<Payload>((resolve, reject) => {
      verify(token, JWT_SECRET, (error, payload) => {
        if (error || !payload) {
          return reject(error);
        }
        return resolve(payloadSchema.parse(payload));
      });
    });
    return payload;
  } catch {
    throw new UnauthorizedError("登录信息无效");
  }
}
