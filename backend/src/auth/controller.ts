import { NextFunction, Request, Response } from "express";
import { authService } from "./service";
import { LoginReq } from "./types";

export const authController = {
  getInfo,
  login,
};

async function getInfo(_: Request, res: Response, next: NextFunction) {
  try {
    const { id } = res.locals.auth;
    const account = await authService.getInfo(id);
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
