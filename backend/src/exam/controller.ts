import { NextFunction, Request, Response } from "express";
import { examService } from "./service";
import { CreateRequest, RemoveByIdRequest, UpdateByIdRequest } from "./types";

export const examController = {
  findAll,
  create,
  updateById,
  removeById,
};

async function findAll(_: Request, res: Response, next: NextFunction) {
  try {
    const exams = await examService.findAll();
    return res.status(200).json({ data: exams });
  } catch (error) {
    return next(error);
  }
}

async function create(req: CreateRequest, res: Response, next: NextFunction) {
  try {
    const exam = await examService.create(req.body);
    return res.status(201).json({ data: exam });
  } catch (error) {
    return next(error);
  }
}

async function updateById(
  req: UpdateByIdRequest,
  res: Response,
  next: NextFunction
) {
  try {
    await examService.updateById(req.params.id, req.body);
    return res.status(204).end();
  } catch (error) {
    return next(error);
  }
}

async function removeById(
  req: RemoveByIdRequest,
  res: Response,
  next: NextFunction
) {
  try {
    await examService.removeById(req.params.id);
    return res.status(204).end();
  } catch (error) {
    return next(error);
  }
}
