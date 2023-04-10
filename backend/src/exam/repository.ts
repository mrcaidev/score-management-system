import { database } from "utils/database";
import { ServiceUnavailableError } from "utils/http-error";
import { Exam } from "./types";

export const examRepository = {
  find,
  findOne,
  create,
  update,
  remove,
};

async function find(filter: Partial<Exam> = {}) {
  const { id, name, heldAt } = filter;

  const { rows } = await database.query<Exam>(
    `
      SELECT id, name, held_at "heldAt"
      FROM exam
      WHERE ($1::UUID IS NULL OR id = $1)
      AND ($2::TEXT IS NULL OR name = $2)
      AND ($3::TIMESTAMPTZ IS NULL OR held_at = $3)
      ORDER BY held_at DESC
    `,
    [id, name, heldAt]
  );

  return rows;
}

async function findOne(filter: Partial<Exam> = {}) {
  const rows = await find(filter);
  return rows[0];
}

async function create(creator: Omit<Exam, "id">) {
  const { name, heldAt } = creator;

  const { rows } = await database.query<Exam>(
    `
      INSERT INTO exam (name, held_at)
      VALUES ($1, $2)
      RETURNING id, name, held_at "heldAt"
    `,
    [name, heldAt]
  );

  if (!rows[0]) {
    throw new ServiceUnavailableError("添加失败，请稍后再试");
  }

  return rows[0];
}

async function update(id: string, updater: Partial<Exam> = {}) {
  const { name, heldAt } = updater;

  const { rowCount } = await database.query(
    `
      UPDATE exam
      SET name = CASE WHEN $2::TEXT IS NULL THEN name ELSE $2 END,
        held_at = CASE WHEN $3::TIMESTAMPTZ IS NULL THEN held_at ELSE $3 END
      WHERE id = $1
    `,
    [id, name, heldAt]
  );

  if (rowCount !== 1) {
    throw new ServiceUnavailableError("更新失败，请稍后再试");
  }
}

async function remove(id: string) {
  const { rowCount } = await database.query(
    `
      DELETE FROM exam
      WHERE id = $1
    `,
    [id]
  );

  if (rowCount !== 1) {
    throw new ServiceUnavailableError("删除失败，请稍后再试");
  }
}
