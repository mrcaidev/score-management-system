import { NextFunction, Request, Response } from "express";
import { AnyZodObject } from "zod";

export function validate(schema: AnyZodObject) {
  return async (req: Request, _: Response, next: NextFunction) => {
    try {
      await schema.parseAsync(req);
      return next();
    } catch (error) {
      return next(error);
    }
  };
}
