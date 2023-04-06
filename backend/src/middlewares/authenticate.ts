import { accountRepository } from "account/repository";
import { Role } from "account/types";
import { NextFunction, Request, Response } from "express";
import {
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
} from "utils/http-error";
import { decodeJwt, extractJwtFromHeaders } from "utils/jwt";

export function authenticate(expectation?: Role | Role[]) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = extractJwtFromHeaders(req.headers);

      if (!token) {
        throw new UnauthorizedError("未登录");
      }

      const { id } = await decodeJwt(token);

      const account = await accountRepository.findById(id);

      if (!account) {
        throw new NotFoundError("用户不存在");
      }

      if (!isExpectedRole(account.role, expectation)) {
        throw new ForbiddenError("没有权限访问");
      }

      res.locals.auth = account;

      return next();
    } catch (error) {
      return next(error);
    }
  };
}

function isExpectedRole(role: Role, expectation: Role | Role[] | undefined) {
  if (expectation === undefined) {
    return true;
  }

  if (Array.isArray(expectation)) {
    return expectation.includes(role);
  }

  return role === expectation;
}
