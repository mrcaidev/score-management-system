import { Router } from "express";
import { authenticate } from "middlewares/authenticate";
import { validate } from "middlewares/validate";
import { accountController } from "./controller";
import {
  Role,
  createRequestSchema,
  findRequestSchema,
  removeByIdRequestSchema,
  updateByIdRequestSchema,
} from "./types";

export const accountRouter: Router = Router();

accountRouter.get(
  "/",
  authenticate(Role.TEACHER),
  validate(findRequestSchema),
  accountController.find
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
