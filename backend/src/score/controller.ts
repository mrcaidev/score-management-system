import { NextFunction, Response } from "express";
import { scoreService } from "./service";
import {
  CreateRequest,
  FindRequest,
  RemoveByIdRequest,
  UpdateByIdRequest,
} from "./types";

export const scoreController = {
  find,
  create,
  updateById,
  removeById,
};

async function find(req: FindRequest, res: Response, next: NextFunction) {
  try {
    const scores = await scoreService.find(req.query, res.locals.auth);
    return res.status(200).json({ data: scores });
  } catch (error) {
    return next(error);
  }
}

async function create(req: CreateRequest, res: Response, next: NextFunction) {
  try {
    const score = await scoreService.create(req.body);
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
    await scoreService.updateById(req.params.id, req.body);
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
    await scoreService.removeById(req.params.id);
    return res.status(204).end();
  } catch (error) {
    return next(error);
  }
}
