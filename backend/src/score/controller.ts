import { NextFunction, Response } from "express";
import { scoreService } from "./service";
import {
  CreateReq,
  DeleteReq,
  FindAllReq,
  HandleReviewReq,
  RequireReviewReq,
  UpdateReq,
} from "./types";

export const scoreController = {
  findAll,
  create,
  updateById,
  deleteById,
  requireReview,
  handleReview,
};

async function findAll(req: FindAllReq, res: Response, next: NextFunction) {
  try {
    const scores = await scoreService.findAll(req.query, res.locals.user);
    return res.status(200).json({ data: scores });
  } catch (error) {
    return next(error);
  }
}

async function create(req: CreateReq, res: Response, next: NextFunction) {
  try {
    const score = await scoreService.create(req.body);
    return res.status(201).json({ data: score });
  } catch (error) {
    return next(error);
  }
}

async function updateById(req: UpdateReq, res: Response, next: NextFunction) {
  try {
    const score = await scoreService.updateById(req.params.id, req.body);
    return res.status(200).json({ data: score });
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

async function requireReview(
  req: RequireReviewReq,
  res: Response,
  next: NextFunction
) {
  try {
    await scoreService.requireReview(req.params.id, res.locals.user.id);
    return res.status(204).end();
  } catch (error) {
    return next(error);
  }
}

async function handleReview(
  req: HandleReviewReq,
  res: Response,
  next: NextFunction
) {
  try {
    await scoreService.handleReview(req.params.id, req.body);
    return res.status(204).end();
  } catch (error) {
    return next(error);
  }
}
