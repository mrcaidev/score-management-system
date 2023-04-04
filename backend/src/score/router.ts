import { Role } from "account/types";
import { Router } from "express";
import { authenticate } from "middlewares/authenticate";
import { validate } from "middlewares/validate";
import { scoreController } from "./controller";
import {
  createReqSchema,
  deleteReqSchema,
  findAllReqSchema,
  updateReqSchema,
} from "./types";

export const scoreRouter: Router = Router();

scoreRouter.get(
  "/",
  authenticate(),
  validate(findAllReqSchema),
  scoreController.findAll
);

scoreRouter.post(
  "/",
  authenticate(Role.TEACHER),
  validate(createReqSchema),
  scoreController.create
);

scoreRouter.patch(
  "/:id",
  authenticate(Role.TEACHER),
  validate(updateReqSchema),
  scoreController.updateById
);

scoreRouter.delete(
  "/:id",
  authenticate(Role.TEACHER),
  validate(deleteReqSchema),
  scoreController.deleteById
);
