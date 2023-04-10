import { NextFunction, Request, Response } from "express";
import { reviewService } from "./service";
import { CreateRequest, RemoveByIdRequest, UpdateByIdRequest } from "./types";

export const reviewController = {
  findAll,
  create,
  updateById,
  removeById,
};

async function findAll(_: Request, res: Response, next: NextFunction) {
  try {
    const scores = await reviewService.findAll(res.locals.auth);
    return res.status(200).json({ data: scores });
  } catch (error) {
    return next(error);
  }
}

async function create(req: CreateRequest, res: Response, next: NextFunction) {
  try {
    const score = await reviewService.create(req.body, res.locals.auth);
    return res.status(201).json({ data: score });
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
    await reviewService.updateById(req.params.id, req.body);
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
    await reviewService.removeById(req.params.id, res.locals.auth);
    return res.status(204).end();
  } catch (error) {
    return next(error);
  }
}
