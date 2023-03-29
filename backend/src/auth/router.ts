import { Router } from "express";
import { validate } from "middlewares/validate";
import { authController } from "./controller";
import { loginReqSchema } from "./types";

export const authRouter: Router = Router();

authRouter.post("/login", validate(loginReqSchema), authController.login);
