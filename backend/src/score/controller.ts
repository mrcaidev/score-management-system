import { NextFunction, Response } from "express";
import { scoreService } from "./service";
import { CreateReq, DeleteReq, FindAllReq, UpdateReq } from "./types";

export const scoreController = {
  findAll,
  create,
  updateById,
  deleteById,
};

async function findAll(req: FindAllReq, res: Response, next: NextFunction) {
  try {
    const namedScores = await scoreService.findAll(req.query, res.locals.auth);
    return res.status(200).json({ data: namedScores });
  } catch (error) {
    return next(error);
  }
}

async function create(req: CreateReq, res: Response, next: NextFunction) {
  try {
    const namedScore = await scoreService.create(req.body);
    return res.status(201).json({ data: namedScore });
  } catch (error) {
    return next(error);
  }
}

async function updateById(req: UpdateReq, res: Response, next: NextFunction) {
  try {
    await scoreService.updateById(req.params.id, req.body);
    return res.status(204).end();
  } catch (error) {
    return next(error);
  }
}

async function deleteById(req: DeleteReq, res: Response, next: NextFunction) {
  try {
    await scoreService.deleteById(req.params.id);
    return res.status(204).end();
  } catch (error) {
    return next(error);
  }
}
