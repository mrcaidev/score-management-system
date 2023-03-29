import { NextFunction, Response } from "express";
import { authService } from "./service";
import { LoginReq } from "./types";

export const authController = {
  login,
};

async function login(req: LoginReq, res: Response, next: NextFunction) {
  try {
    const token = await authService.login(req.body);
    return res.status(200).json({ data: token });
  } catch (error) {
    return next(error);
  }
}
