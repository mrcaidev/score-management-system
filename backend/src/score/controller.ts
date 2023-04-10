import { NextFunction, Response } from "express";
import { scoreService } from "./service";
import {
  CreateRequest,
  FindAllRequest,
  RemoveByIdRequest,
  UpdateByIdRequest,
} from "./types";

export const scoreController = {
  findAll,
  create,
  updateById,
  removeById,
};

async function findAll(req: FindAllRequest, res: Response, next: NextFunction) {
  try {
    const fullScores = await scoreService.findAll(req.query, res.locals.auth);
    return res.status(200).json({ data: fullScores });
  } catch (error) {
    return next(error);
  }
}

async function create(req: CreateRequest, res: Response, next: NextFunction) {
  try {
    const fullScore = await scoreService.create(req.body);
    return res.status(201).json({ data: fullScore });
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
