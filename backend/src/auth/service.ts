import { accountRepository } from "account/repository";
import { UnauthorizedError } from "utils/http-error";
import { generateJwt } from "utils/jwt";
import { LoginRequest } from "./types";

export const authService = {
  login,
};

async function login(body: LoginRequest["body"]) {
  const { id, password } = body;

  const account = await accountRepository.findOne({ id, password });

  if (!account) {
    throw new UnauthorizedError("账号或密码错误");
  }

  return generateJwt({ id });
}
