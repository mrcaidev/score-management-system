import { accountRepository } from "account/repository";
import { UnauthorizedError } from "utils/http-error";
import { generateJwt } from "utils/jwt";
import { LoginReq } from "./types";

export const authService = {
  getInfo,
  login,
};

async function getInfo(id: string) {
  const account = await accountRepository.findById(id);

  if (!account) {
    throw new UnauthorizedError("用户不存在");
  }

  return account;
}

async function login(dto: LoginReq["body"]) {
  const { id, password } = dto;

  const account = await accountRepository.findByIdAndPassword(id, password);

  if (!account) {
    throw new UnauthorizedError("账号或密码错误");
  }

  const token = await generateJwt({ id });
  return token;
}
