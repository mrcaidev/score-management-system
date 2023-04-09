import { NextFunction, Response } from "express";
import { accountService } from "./service";
import { CreateReq, DeleteReq, FindAllReq, UpdateReq } from "./types";

export const accountController = {
  findAll,
  create,
  updateById,
  deleteById,
};

async function findAll(req: FindAllReq, res: Response, next: NextFunction) {
  try {
    const accounts = await accountService.findAll(req.query);
    return res.status(200).json({ data: accounts });
  } catch (error) {
    return next(error);
  }
}

async function create(req: CreateReq, res: Response, next: NextFunction) {
  try {
    const account = await accountService.create(req.body);
    return res.status(201).json({ data: account });
  } catch (error) {
    return next(error);
  }
}

async function updateById(req: UpdateReq, res: Response, next: NextFunction) {
  try {
    await accountService.updateById(req.params.id, req.body);
    return res.status(204).end();
  } catch (error) {
    return next(error);
  }
}

async function deleteById(req: DeleteReq, res: Response, next: NextFunction) {
  try {
    await accountService.deleteById(req.params.id);
    return res.status(204).end();
  } catch (error) {
    return next(error);
  }
}
