import { NextFunction, Request, Response } from "express";
import { courseService } from "./service";

export const courseController = {
  findAll,
};

async function findAll(_: Request, res: Response, next: NextFunction) {
  try {
    const courses = await courseService.findAll();
    return res.status(200).json({ data: courses });
  } catch (error) {
    return next(error);
  }
}
