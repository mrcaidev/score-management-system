import { Account } from "account/types";
import { NextFunction, Request, Response } from "express";
import { authService } from "./service";
import { LoginReq } from "./types";

export const authController = {
  getAccount,
  login,
};

async function getAccount(_: Request, res: Response, next: NextFunction) {
  try {
    const account = res.locals.auth as Account;
    return res.status(200).json({ data: account });
  } catch (error) {
    return next(error);
  }
}

async function login(req: LoginReq, res: Response, next: NextFunction) {
  try {
    const token = await authService.login(req.body);
    return res.status(200).json({ data: token });
  } catch (error) {
    return next(error);
  }
}
