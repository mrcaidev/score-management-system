import { NextFunction, Request, Response } from "express";
import { examService } from "./service";
import { CreateReq, DeleteReq, UpdateReq } from "./types";

export const examController = {
  findAll,
  create,
  updateById,
  deleteById,
};

async function findAll(_: Request, res: Response, next: NextFunction) {
  try {
    const exams = await examService.findAll();
    return res.status(200).json({ data: exams });
  } catch (error) {
    return next(error);
  }
}

async function create(req: CreateReq, res: Response, next: NextFunction) {
  try {
    const exam = await examService.create(req.body);
    return res.status(201).json({ data: exam });
  } catch (error) {
    return next(error);
  }
}

async function updateById(req: UpdateReq, res: Response, next: NextFunction) {
  try {
    const exam = await examService.updateById(req.params.id, req.body);
    return res.status(200).json({ data: exam });
  } catch (error) {
    return next(error);
  }
}

async function deleteById(req: DeleteReq, res: Response, next: NextFunction) {
  try {
    await examService.deleteById(req.params.id);
    return res.status(204).end();
  } catch (error) {
    return next(error);
  }
}
