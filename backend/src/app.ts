import "utils/env";

import { accountRouter } from "account/router";
import { authRouter } from "auth/router";
import cookieParser from "cookie-parser";
import cors from "cors";
import { courseRouter } from "course/router";
import { examRouter } from "exam/router";
import express, { Express } from "express";
import { rateLimit } from "express-rate-limit";
import { handleError } from "middlewares/handle-error";
import { reviewRouter } from "review/router";
import { rootRouter } from "root/router";
import { scoreRouter } from "score/router";

export const app: Express = express();

app.use(cors());
app.use(
  rateLimit({
    windowMs: 60 * 1000,
    max: 100,
    message: { error: "请求过于频繁，请稍后再试" },
    legacyHeaders: false,
    standardHeaders: true,
  })
);
app.use(cookieParser());
app.use(express.json());

app.use("/", rootRouter);
app.use("/accounts", accountRouter);
app.use("/auth", authRouter);
app.use("/courses", courseRouter);
app.use("/exams", examRouter);
app.use("/reviews", reviewRouter);
app.use("/scores", scoreRouter);

app.use(handleError);
