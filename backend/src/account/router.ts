import { Router } from "express";
import { authenticate } from "middlewares/authenticate";
import { validate } from "middlewares/validate";
import { accountController } from "./controller";
import {
  Role,
  createRequestSchema,
  findAllRequestSchema,
  removeByIdRequestSchema,
  updateByIdRequestSchema,
} from "./types";

export const accountRouter: Router = Router();

accountRouter.get(
  "/",
  authenticate(Role.TEACHER),
  validate(findAllRequestSchema),
  accountController.findAll
);

accountRouter.post(
  "/",
  authenticate(Role.TEACHER),
  validate(createRequestSchema),
  accountController.create
);

accountRouter.patch(
  "/:id",
  authenticate(Role.TEACHER),
  validate(updateByIdRequestSchema),
  accountController.updateById
);

accountRouter.delete(
  "/:id",
  authenticate(Role.TEACHER),
  validate(removeByIdRequestSchema),
  accountController.removeById
);
