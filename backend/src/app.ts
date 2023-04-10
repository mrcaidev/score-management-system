import "utils/env";

import { accountRouter } from "account/router";
import { authRouter } from "auth/router";
import cors from "cors";
import { courseRouter } from "course/router";
import { examRouter } from "exam/router";
import express, { Express } from "express";
import { handleError } from "middlewares/handle-error";
import { reviewRouter } from "review/router";
import { rootRouter } from "root/router";
import { scoreRouter } from "score/router";

export const app: Express = express();

app.use(cors());
app.use(express.json());

app.use("/", rootRouter);
app.use("/accounts", accountRouter);
app.use("/auth", authRouter);
app.use("/courses", courseRouter);
app.use("/exams", examRouter);
app.use("/scores", scoreRouter);
app.use("/reviews", reviewRouter);

app.use(handleError);
