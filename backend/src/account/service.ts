import { UnauthorizedError } from "utils/http-error";
import { generateJwt } from "utils/jwt";
import { accountRepository } from "./repository";
import { LoginReq } from "./types";

export const accountService = {
  login,
};

async function login(dto: LoginReq["body"]) {
  const { id, password } = dto;

  const account = await accountRepository.findByIdAndPassword(id, password);

  if (!account) {
    throw new UnauthorizedError("账号或密码错误");
  }

  const token = await generateJwt(id);
  return token;
}
