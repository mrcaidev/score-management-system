import { NextFunction, Response } from "express";
import { accountService } from "./service";
import {
  CreateRequest,
  FindRequest,
  RemoveByIdRequest,
  UpdateByIdRequest,
} from "./types";

export const accountController = {
  find,
  create,
  updateById,
  removeById,
};

async function find(req: FindRequest, res: Response, next: NextFunction) {
  try {
    const accounts = await accountService.find(req.query);
    return res.status(200).json({ data: accounts });
  } catch (error) {
    return next(error);
  }
}

async function create(req: CreateRequest, res: Response, next: NextFunction) {
  try {
    const account = await accountService.create(req.body);
    return res.status(201).json({ data: account });
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
    await accountService.updateById(req.params.id, req.body);
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
    await accountService.removeById(req.params.id);
    return res.status(204).end();
  } catch (error) {
    return next(error);
  }
}
