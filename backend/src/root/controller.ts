import { Request, Response } from "express";

export const rootController = {
  greet,
  checkHealth,
};

async function greet(_: Request, res: Response) {
  return res.status(200).json({ data: "成绩管理系统" });
}

async function checkHealth(_: Request, res: Response) {
  return res.status(200).json({ data: "OK" });
}
