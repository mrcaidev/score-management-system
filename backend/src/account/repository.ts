import { database } from "utils/database";
import { InternalServerError } from "utils/http-error";
import { Account, CreateReq, FindAllReq, UpdateReq } from "./types";

export const accountRepository = {
  findAll,
  findById,
  findByIdAndPassword,
  create,
  updateById,
  deleteById,
};

async function findAll(dto: FindAllReq["query"]) {
  const { role } = dto;

  const { rows } = await database.query<Account>(
    `
      SELECT id, name, role
      FROM account
      WHERE $1::SMALLINT IS NULL OR role = $1
    `,
    [role]
  );

  return rows;
}

async function findById(id: string) {
  const { rows } = await database.query<Account>(
    `
      SELECT id, name, role
      FROM account
      WHERE id = $1
    `,
    [id]
  );

  return rows[0];
}

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

async function create(dto: CreateReq["body"]) {
  const { id, name } = dto;

  const { rows } = await database.query<Account>(
    `
      INSERT INTO account (id, name, password)
      VALUES ($1, $2, CRYPT($3, GEN_SALT('bf')))
      RETURNING id, name, role
    `,
    [id, name, id]
  );

  if (!rows[0]) {
    throw new InternalServerError("添加用户失败，请稍后再试");
  }

  return rows[0];
}

async function updateById(id: string, dto: UpdateReq["body"]) {
  const { name, role, password } = dto;

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
    throw new InternalServerError("更新用户失败，请稍后再试");
  }
}

async function deleteById(id: string) {
  const { rowCount } = await database.query<Account>(
    `
      DELETE FROM account
      WHERE id = $1
    `,
    [id]
  );

  if (rowCount !== 1) {
    throw new InternalServerError("删除用户失败，请稍后再试");
  }
}
