import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  DATABASE_URL: z.string().nonempty(),
  JWT_SECRET: z.string().nonempty(),
});

export const { DATABASE_URL, JWT_SECRET } = envSchema.parse(process.env);
