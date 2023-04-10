import { Role } from "account/types";
import { Router } from "express";
import { authenticate } from "middlewares/authenticate";
import { validate } from "middlewares/validate";
import { reviewController } from "./controller";
import {
  createRequestSchema,
  removeByIdRequestSchema,
  updateByIdRequestSchema,
} from "./types";

export const reviewRouter: Router = Router();

reviewRouter.get("/", authenticate(), reviewController.findAll);

reviewRouter.post(
  "/",
  authenticate(Role.STUDENT),
  validate(createRequestSchema),
  reviewController.create
);

reviewRouter.patch(
  "/:id",
  authenticate(Role.TEACHER),
  validate(updateByIdRequestSchema),
  reviewController.updateById
);

reviewRouter.delete(
  "/:id",
  authenticate(Role.STUDENT),
  validate(removeByIdRequestSchema),
  reviewController.removeById
);
