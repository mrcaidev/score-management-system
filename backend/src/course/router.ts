import { Router } from "express";
import { courseController } from "./controller";

export const courseRouter: Router = Router();

courseRouter.get("/", courseController.findAll);
