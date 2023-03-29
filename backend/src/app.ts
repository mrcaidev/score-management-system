import "utils/env";

import { authRouter } from "auth";
import cors from "cors";
import { courseRouter } from "course";
import { examRouter } from "exam";
import express, { Express } from "express";
import { handleError } from "middlewares/handle-error";
import { rootRouter } from "root";
import { scoreRouter } from "score";

export const app: Express = express();

app.use(cors());
app.use(express.json());

app.use("/", rootRouter);
app.use("/auth", authRouter);
app.use("/courses", courseRouter);
app.use("/exams", examRouter);
app.use("/scores", scoreRouter);

app.use(handleError);
