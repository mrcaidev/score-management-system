import { Router } from "express";
import { authenticate } from "middlewares/authenticate";
import { validate } from "middlewares/validate";
import { accountController } from "./controller";
import {
  Role,
  createReqSchema,
  deleteReqSchema,
  findAllReqSchema,
  updateReqSchema,
} from "./types";

export const accountRouter: Router = Router();

accountRouter.get(
  "/",
  authenticate(Role.TEACHER),
  validate(findAllReqSchema),
  accountController.findAll
);

accountRouter.post(
  "/",
  authenticate(Role.TEACHER),
  validate(createReqSchema),
  accountController.create
);

accountRouter.put(
  "/:id",
  authenticate(Role.TEACHER),
  validate(updateReqSchema),
  accountController.updateById
);

accountRouter.delete(
  "/:id",
  authenticate(Role.TEACHER),
  validate(deleteReqSchema),
  accountController.deleteById
);
