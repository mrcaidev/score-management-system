import { Role } from "account";
import { NextFunction, Request, Response } from "express";
import { decodeJwt } from "utils/jwt";

export function authenticate(expectation: Role) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { token } = req.cookies;

      if (!token) {
        return res.status(401).json({ error: "未登录" });
      }

      const { id, role } = await decodeJwt(token);

      if (role !== expectation) {
        return res.status(403).json({ error: "没有权限访问" });
      }

      res.locals.userId = id;

      return next();
    } catch (error) {
      return next(error);
    }
  };
}
