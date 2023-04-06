import { database } from "utils/database";
import { InternalServerError } from "utils/http-error";
import { CreateReq, Exam, UpdateReq } from "./types";

export const examRepository = {
  findAll,
  findById,
  findByName,
  create,
  updateById,
  deleteById,
};

async function findAll() {
  const { rows } = await database.query<Exam>(
    `
      SELECT id, name, held_at "heldAt"
      FROM exam
      ORDER BY held_at DESC
    `
  );

  return rows;
}

async function findById(id: string) {
  const { rows } = await database.query<Exam>(
    `
      SELECT id, name, held_at "heldAt"
      FROM exam
      WHERE id = $1
    `,
    [id]
  );

  return rows[0];
}

async function findByName(name: string) {
  const { rows } = await database.query<Exam>(
    `
      SELECT id, name, held_at "heldAt"
      FROM exam
      WHERE name = $1
    `,
    [name]
  );

  return rows[0];
}

async function create(dto: CreateReq["body"]) {
  const { name, heldAt } = dto;

  const { rows } = await database.query<Exam>(
    `
      INSERT INTO exam (name, held_at)
      VALUES ($1, $2)
      RETURNING id, name, held_at "heldAt"
    `,
    [name, heldAt]
  );

  if (!rows[0]) {
    throw new InternalServerError("添加考试失败，请稍后再试");
  }

  return rows[0];
}

async function updateById(id: string, dto: UpdateReq["body"]) {
  const { name, heldAt } = dto;

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
    throw new InternalServerError("更新考试失败，请稍后再试");
  }
}

async function deleteById(id: string) {
  const { rowCount } = await database.query(
    `
      DELETE FROM exam
      WHERE id = $1
    `,
    [id]
  );

  if (rowCount !== 1) {
    throw new InternalServerError("删除考试失败，请稍后再试");
  }
}
