import { Account } from "account/types";
import { NextFunction, Request, Response } from "express";
import { authService } from "./service";
import { LoginRequest } from "./types";

export const authController = {
  getSelf,
  login,
};

async function getSelf(_: Request, res: Response, next: NextFunction) {
  try {
    const account = res.locals.auth as Account;
    return res.status(200).json({ data: account });
  } catch (error) {
    return next(error);
  }
}

async function login(req: LoginRequest, res: Response, next: NextFunction) {
  try {
    const token = await authService.login(req.body);
    return res
      .status(204)
      .cookie("token", token, { maxAge: 86400, httpOnly: true, secure: true });
  } catch (error) {
    return next(error);
  }
}
