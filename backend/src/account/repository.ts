import { database } from "utils/database";
import { ServiceUnavailableError } from "utils/http-error";
import { Account, SecretAccount } from "./types";

export const accountRepository = {
  find,
  findOne,
  findOneByCredentials,
  create,
  updateById,
  removeById,
};

async function find(filter: Partial<Account> = {}) {
  const { id, name, role } = filter;

  const { rows } = await database.query<Account>(
    `
      SELECT id, name, role
      FROM account
      WHERE CASE WHEN $1::TEXT IS NULL THEN TRUE ELSE id = $1 END
      AND CASE WHEN $2::TEXT IS NULL THEN TRUE ELSE name = $2 END
      AND CASE WHEN $3::SMALLINT IS NULL THEN TRUE ELSE role = $3 END
      ORDER BY id ASC
    `,
    [id, name, role]
  );

  return rows;
}

async function findOne(filter: Partial<Account> = {}) {
  const rows = await find(filter);
  return rows[0];
}

async function findOneByCredentials(
  filter: Pick<SecretAccount, "id" | "password">
) {
  const { id, password } = filter;

  const { rows } = await database.query<Account>(
    `
      SELECT id, name, role
      FROM account
      WHERE id = $1
      AND password = CRYPT($2, password)
      ORDER BY id ASC
    `,
    [id, password]
  );

  return rows[0];
}

async function create(creator: Omit<Account, "role">) {
  const { id, name } = creator;

  const { rows } = await database.query<Account>(
    `
      INSERT INTO account (id, name)
      VALUES ($1, $2)
      RETURNING id, name, role
    `,
    [id, name]
  );

  if (!rows[0]) {
    throw new ServiceUnavailableError("添加失败，请稍后再试");
  }

  return rows[0];
}

async function updateById(id: string, updater: Partial<Account> = {}) {
  const { name, role } = updater;

  const { rowCount } = await database.query<Account>(
    `
      UPDATE account
      SET
        name = CASE WHEN $2::TEXT IS NULL THEN name ELSE $2 END,
        role = CASE WHEN $3::SMALLINT IS NULL THEN role ELSE $3 END
      WHERE id = $1
    `,
    [id, name, role]
  );

  if (rowCount !== 1) {
    throw new ServiceUnavailableError("更新失败，请稍后再试");
  }
}

async function removeById(id: string) {
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
