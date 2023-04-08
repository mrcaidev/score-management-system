import { Role } from "account/types";
import { Router } from "express";
import { authenticate } from "middlewares/authenticate";
import { validate } from "middlewares/validate";
import { reviewController } from "./controller";
import { createReqSchema, deleteReqSchema, updateReqSchema } from "./types";

export const reviewRouter: Router = Router();

reviewRouter.get("/", authenticate(), reviewController.findAll);

reviewRouter.post(
  "/",
  authenticate(Role.STUDENT),
  validate(createReqSchema),
  reviewController.create
);

reviewRouter.patch(
  "/:id",
  authenticate(Role.TEACHER),
  validate(updateReqSchema),
  reviewController.updateById
);

reviewRouter.delete(
  "/:id",
  authenticate(Role.STUDENT),
  validate(deleteReqSchema),
  reviewController.deleteById
);
