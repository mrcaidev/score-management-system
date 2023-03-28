import { sign, verify } from "jsonwebtoken";
import { z } from "zod";
import { JWT_SECRET } from "./env";
import { InternalServerError, UnauthorizedError } from "./http-error";

export async function generateJwt(id: string) {
  try {
    const token = await new Promise<string>((resolve, reject) => {
      sign(id, JWT_SECRET, { expiresIn: "1d" }, (error, token) => {
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
    const id = await new Promise<string>((resolve, reject) => {
      verify(token, JWT_SECRET, (error, id) => {
        if (error || !id) {
          return reject(error);
        }
        return resolve(z.string().parse(id));
      });
    });
    return id;
  } catch {
    throw new UnauthorizedError("登录信息无效");
  }
}
