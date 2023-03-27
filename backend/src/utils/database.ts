import { Pool } from "pg";
import { DATABASE_URL } from "./env";

export const database = new Pool({ connectionString: DATABASE_URL });
