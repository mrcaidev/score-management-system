import { accountSchema } from "account/types";
import { sign, verify } from "jsonwebtoken";
import { JWT_SECRET } from "./env";
import { InternalServerError, UnauthorizedError } from "./http-error";
import { Infer } from "./types";

const payloadSchema = accountSchema.pick({ id: true });

type Payload = Infer<typeof payloadSchema>;

export async function generateJwt(payload: Payload) {
  try {
    return await new Promise<string>((resolve, reject) => {
      sign(payload, JWT_SECRET, { expiresIn: "1d" }, (error, token) => {
        if (error || !token) {
          return reject(error);
        }
        return resolve(token);
      });
    });
  } catch {
    throw new InternalServerError("登录失败，请稍后再试");
  }
}

export async function decodeJwt(token: string) {
  try {
    return await new Promise<Payload>((resolve, reject) => {
      verify(token, JWT_SECRET, (error, payload) => {
        if (error || !payload) {
          return reject(error);
        }
        return resolve(payloadSchema.parse(payload));
      });
    });
  } catch {
    throw new UnauthorizedError("登录信息无效，请重新登录");
  }
}
