import { Role } from "account";
import { NextFunction, Request, Response } from "express";
import { decodeJwt } from "utils/jwt";

export function authenticate(expectation?: Role | Role[]) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { token } = req.cookies;

      if (!token) {
        return res.status(401).json({ error: "未登录" });
      }

      const payload = await decodeJwt(token);

      if (!matchExpectation(payload.role, expectation)) {
        return res.status(403).json({ error: "没有权限访问" });
      }

      res.locals.auth = payload;

      return next();
    } catch (error) {
      return next(error);
    }
  };
}

function matchExpectation(role: Role, expectation: Role | Role[] | undefined) {
  if (!expectation) {
    return true;
  }

  if (Array.isArray(expectation)) {
    return expectation.includes(role);
  }

  return role === expectation;
}
