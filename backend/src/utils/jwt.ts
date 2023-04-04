import { accountSchema } from "account/types";
import { IncomingHttpHeaders } from "http";
import { sign, verify } from "jsonwebtoken";
import { z } from "zod";
import { JWT_SECRET } from "./env";
import { InternalServerError, UnauthorizedError } from "./http-error";

const payloadSchema = accountSchema.pick({ id: true });

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
    throw new UnauthorizedError("登录信息无效，请重新登录");
  }
}

export function extractJwtFromHeaders(headers: IncomingHttpHeaders) {
  const { authorization } = headers;

  if (!authorization) {
    return;
  }

  const [type, token] = authorization.split(" ");

  if (type !== "Bearer") {
    return;
  }

  return token;
}
