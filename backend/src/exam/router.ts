import { Role } from "account/types";
import { Router } from "express";
import { authenticate } from "middlewares/authenticate";
import { validate } from "middlewares/validate";
import { examController } from "./controller";
import {
  createRequestSchema,
  removeByIdRequestSchema,
  updateByIdRequestSchema,
} from "./types";

export const examRouter: Router = Router();

examRouter.get("/", examController.findAll);

examRouter.post(
  "/",
  authenticate(Role.TEACHER),
  validate(createRequestSchema),
  examController.create
);

examRouter.patch(
  "/:id",
  authenticate(Role.TEACHER),
  validate(updateByIdRequestSchema),
  examController.updateById
);

examRouter.delete(
  "/:id",
  authenticate(Role.TEACHER),
  validate(removeByIdRequestSchema),
  examController.removeById
);
