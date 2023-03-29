import { accountRepository } from "account";
import { Role } from "auth";
import { NextFunction, Request, Response } from "express";
import { decodeJwt } from "utils/jwt";

export function authenticate(expectation?: Role | Role[]) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { token } = req.cookies;

      if (!token) {
        return res.status(401).json({ error: "未登录" });
      }

      const { id } = await decodeJwt(token);

      const account = await accountRepository.findById(id);

      if (!account) {
        return res.status(401).json({ error: "登录信息无效" });
      }

      if (!isExpectedRole(account.role, expectation)) {
        return res.status(403).json({ error: "没有权限访问" });
      }

      res.locals.auth = { id, role: account.role };

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
