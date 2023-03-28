import { NextFunction, Request, Response } from "express";
import { HttpError } from "utils/http-error";
import { ZodError } from "zod";

export async function handleError(
  error: Error,
  _: Request,
  res: Response,
  next: NextFunction
) {
  if (res.headersSent) {
    return next(error);
  }

  if (error instanceof ZodError) {
    return res.status(400).json({ error: "请求格式错误" });
  }

  if (error instanceof HttpError) {
    return res.status(error.status).json({ error: error.message });
  }

  return res.status(500).json({ error: error.message });
}
