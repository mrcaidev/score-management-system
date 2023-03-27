import { Role } from "account";
import { Router } from "express";
import { authenticate } from "middlewares/authenticate";
import { validate } from "middlewares/validate";
import { examController } from "./controller";
import { createReqSchema, deleteReqSchema, updateReqSchema } from "./types";

export const examRouter: Router = Router();

examRouter.get("/", examController.findAll);

examRouter.post(
  "/",
  authenticate(Role.TEACHER),
  validate(createReqSchema),
  examController.create
);

examRouter.patch(
  "/:id",
  authenticate(Role.TEACHER),
  validate(updateReqSchema),
  examController.updateById
);

examRouter.delete(
  "/:id",
  authenticate(Role.TEACHER),
  validate(deleteReqSchema),
  examController.deleteById
);
