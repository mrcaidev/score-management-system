import { Role } from "account";
import { Router } from "express";
import { authenticate } from "middlewares/authenticate";
import { validate } from "middlewares/validate";
import { scoreController } from "./controller";
import {
  createReqSchema,
  deleteReqSchema,
  handleReviewReqSchema,
  requireReviewReqSchema,
  updateReqSchema,
} from "./types";

export const scoreRouter: Router = Router();

scoreRouter.get("/", scoreController.findAll);

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

scoreRouter.post(
  "/:id/require-review",
  authenticate(Role.STUDENT),
  validate(requireReviewReqSchema),
  scoreController.requireReview
);

scoreRouter.post(
  "/:id/handle-review",
  authenticate(Role.TEACHER),
  validate(handleReviewReqSchema),
  scoreController.handleReview
);
