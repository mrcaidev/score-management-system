import { database } from "utils/database";
import { ServiceUnavailableError } from "utils/http-error";
import { Account, SecretAccount } from "./types";

export const accountRepository = {
  find,
  findOne,
  create,
  update,
  remove,
};

async function find(filter: Partial<SecretAccount> = {}) {
  const { id, name, role, password } = filter;

  const { rows } = await database.query<Account>(
    `
      SELECT id, name, role
      FROM account
      WHERE ($1::TEXT IS NULL OR id = $1)
      AND ($2::TEXT IS NULL OR name = $2)
      AND ($3::SMALLINT IS NULL OR role = $3)
      AND ($4::TEXT IS NULL OR password = CRYPT($4, password))
      ORDER BY id ASC
    `,
    [id, name, role, password]
  );

  return rows;
}

async function findOne(filter: Partial<SecretAccount> = {}) {
  const rows = await find(filter);
  return rows[0];
}

async function create(creator: Omit<SecretAccount, "role" | "password">) {
  const { id, name } = creator;

  const { rows } = await database.query<Account>(
    `
      INSERT INTO account (id, name, password)
      VALUES ($1, $2, CRYPT($1, GEN_SALT('bf')))
      RETURNING id, name, role
    `,
    [id, name]
  );

  if (!rows[0]) {
    throw new ServiceUnavailableError("添加失败，请稍后再试");
  }

  return rows[0];
}

async function update(id: string, updater: Partial<SecretAccount> = {}) {
  const { name, role, password } = updater;

  const { rowCount } = await database.query<Account>(
    `
      UPDATE account
      SET
        name = CASE WHEN $2::TEXT IS NULL THEN name ELSE $2 END,
        role = CASE WHEN $3::SMALLINT IS NULL THEN role ELSE $3 END,
        password = CASE WHEN $4::TEXT IS NULL THEN password ELSE CRYPT($4, GEN_SALT('bf')) END
      WHERE id = $1
    `,
    [id, name, role, password]
  );

  if (rowCount !== 1) {
    throw new ServiceUnavailableError("更新失败，请稍后再试");
  }
}

async function remove(id: string) {
  const { rowCount } = await database.query<Account>(
    `
      DELETE FROM account
      WHERE id = $1
    `,
    [id]
  );

  if (rowCount !== 1) {
    throw new ServiceUnavailableError("删除失败，请稍后再试");
  }
}
