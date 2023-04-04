import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  PORT: z.coerce.number().min(1).max(65535).default(3000),
  DATABASE_URL: z.string().nonempty(),
  JWT_SECRET: z.string().nonempty(),
});

export const { PORT, DATABASE_URL, JWT_SECRET } = envSchema.parse(process.env);
