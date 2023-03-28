import { database } from "utils/database";
import { HttpError } from "utils/error";
import { CreateReq, Exam } from "./types";

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
    throw new HttpError(500, "添加考试失败，请稍后再试");
  }

  return rows[0];
}

async function updateById(id: string, dto: Exam) {
  const { name, heldAt } = dto;

  const { rowCount } = await database.query(
    `
      UPDATE exam
      SET name = $2, held_at = $3
      WHERE id = $1
    `,
    [id, name, heldAt]
  );

  if (rowCount !== 1) {
    throw new HttpError(500, "更新考试失败，请稍后再试");
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
    throw new HttpError(500, "删除考试失败，请稍后再试");
  }
}
