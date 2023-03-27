import { Router } from "express";
import { rootController } from "./controller";

export const rootRouter: Router = Router();

rootRouter.get("/", rootController.greet);

rootRouter.get("/healthz", rootController.checkHealth);
