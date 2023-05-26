import { Router } from "express";
import { authenticate } from "middlewares/authenticate";
import { validate } from "middlewares/validate";
import { authController } from "./controller";
import { loginRequestSchema } from "./types";

export const authRouter: Router = Router();

authRouter.get("/", authenticate(), authController.getSelf);

authRouter.post("/login", validate(loginRequestSchema), authController.login);
