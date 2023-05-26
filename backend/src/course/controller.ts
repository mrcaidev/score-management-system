import { NextFunction, Request, Response } from "express";
import { courseService } from "./service";

export const courseController = {
  find,
};

async function find(_: Request, res: Response, next: NextFunction) {
  try {
    const courses = await courseService.find();
    return res.status(200).json({ data: courses });
  } catch (error) {
    return next(error);
  }
}
