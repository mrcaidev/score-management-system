import { NextFunction, Response } from "express";
import { accountService } from "./service";
import { LoginReq } from "./types";

export const accountController = {
  login,
};

async function login(req: LoginReq, res: Response, next: NextFunction) {
  try {
    const token = await accountService.login(req.body);
    return res.status(204).cookie("token", token, { httpOnly: true }).end();
  } catch (error) {
    return next(error);
  }
}
