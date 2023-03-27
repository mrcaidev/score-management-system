import { database } from "utils/database";
import { Account } from "./types";

export const accountRepository = {
  findByIdAndPassword,
};

async function findByIdAndPassword(id: string, password: string) {
  const { rows } = await database.query<Account>(
    `
      SELECT id, name, role
      FROM account
      WHERE id = $1 AND password = CRYPT($2, password)
    `,
    [id, password]
  );

  return rows[0];
}
