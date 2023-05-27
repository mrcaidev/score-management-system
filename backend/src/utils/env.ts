import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  CORS_ORIGIN: z.string().url(),
  DATABASE_URL: z.string().nonempty(),
  JWT_SECRET: z.string().nonempty(),
});

export const { CORS_ORIGIN, DATABASE_URL, JWT_SECRET } = envSchema.parse(
  process.env
);
