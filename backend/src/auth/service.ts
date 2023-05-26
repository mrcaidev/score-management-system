import { accountRepository } from "account/repository";
import { UnauthorizedError } from "utils/http-error";
import { generateJwt } from "utils/jwt";
import { LoginRequest } from "./types";

export const authService = {
  login,
};

async function login(body: LoginRequest["body"]) {
  const { id } = body;

  const account = await accountRepository.findOneByCredentials(body);

  if (!account) {
    throw new UnauthorizedError("学工号或密码错误");
  }

  return generateJwt({ id });
}
