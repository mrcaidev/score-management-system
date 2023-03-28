import { Request, Response } from "express";

export const rootController = {
  checkHealth,
};

async function checkHealth(_: Request, res: Response) {
  return res.status(200).json({ data: "OK" });
}
