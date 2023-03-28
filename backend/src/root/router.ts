import { Router } from "express";
import { rootController } from "./controller";

export const rootRouter: Router = Router();

rootRouter.get("/healthz", rootController.checkHealth);
