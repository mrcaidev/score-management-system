import { database } from "utils/database";
import { ServiceUnavailableError } from "utils/http-error";
import { Exam } from "./types";

export const examRepository = {
  find,
  findOne,
  create,
  updateById,
  removeById,
};

async function find(filter: Partial<Exam> = {}) {
  const { id, name, heldAt } = filter;

  const { rows } = await database.query<Exam>(
    `
      SELECT id, name, held_at "heldAt"
      FROM exam
      WHERE CASE WHEN $1::UUID IS NULL THEN TRUE ELSE id = $1 END
      AND CASE WHEN $2::TEXT IS NULL THEN TRUE ELSE name = $2 END
      AND CASE WHEN $3::TIMESTAMPTZ IS NULL THEN TRUE ELSE held_at = $3 END
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

async function updateById(id: string, updater: Partial<Exam> = {}) {
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

async function removeById(id: string) {
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
