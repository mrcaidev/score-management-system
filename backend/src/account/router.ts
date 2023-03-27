import { Router } from "express";
import { validate } from "middlewares/validate";
import { accountController } from "./controller";
import { loginReqSchema } from "./types";

export const accountRouter: Router = Router();

accountRouter.post("/login", validate(loginReqSchema), accountController.login);
