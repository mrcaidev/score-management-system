import { NextFunction, Request, Response } from "express";
import { reviewService } from "./service";
import { CreateReq, DeleteReq, UpdateReq } from "./types";

export const reviewController = {
  findAll,
  create,
  updateById,
  deleteById,
};

async function findAll(_: Request, res: Response, next: NextFunction) {
  try {
    const scores = await reviewService.findAll(res.locals.auth);
    return res.status(200).json({ data: scores });
  } catch (error) {
    return next(error);
  }
}

async function create(req: CreateReq, res: Response, next: NextFunction) {
  try {
    await reviewService.create(req.params.id, res.locals.auth);
    return res.status(201).end();
  } catch (error) {
    return next(error);
  }
}

async function updateById(req: UpdateReq, res: Response, next: NextFunction) {
  try {
    await reviewService.updateById(req.params.id, req.body);
    return res.status(204).end();
  } catch (error) {
    return next(error);
  }
}

async function deleteById(req: DeleteReq, res: Response, next: NextFunction) {
  try {
    await reviewService.deleteById(req.params.id, res.locals.auth);
    return res.status(204).end();
  } catch (error) {
    return next(error);
  }
}
