import { Role } from "account/types";
import { Router } from "express";
import { authenticate } from "middlewares/authenticate";
import { validate } from "middlewares/validate";
import { scoreController } from "./controller";
import {
  createRequestSchema,
  findAllRequestSchema,
  removeByIdRequestSchema,
  updateByIdRequestSchema,
} from "./types";

export const scoreRouter: Router = Router();

scoreRouter.get(
  "/",
  authenticate(),
  validate(findAllRequestSchema),
  scoreController.findAll
);

scoreRouter.post(
  "/",
  authenticate(Role.TEACHER),
  validate(createRequestSchema),
  scoreController.create
);

scoreRouter.patch(
  "/:id",
  authenticate(Role.TEACHER),
  validate(updateByIdRequestSchema),
  scoreController.updateById
);

scoreRouter.delete(
  "/:id",
  authenticate(Role.TEACHER),
  validate(removeByIdRequestSchema),
  scoreController.removeById
);
