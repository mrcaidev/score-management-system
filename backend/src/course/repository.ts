import { database } from "utils/database";
import { Course } from "./types";

export const courseRepository = {
  findAll,
  findById,
};

async function findAll() {
  const { rows } = await database.query<Course>(
    `
      SELECT id, name, max_score "maxScore"
      FROM course
    `
  );

  return rows;
}

async function findById(id: number) {
  const { rows } = await database.query<Course>(
    `
      SELECT id, name, max_score "maxScore"
      FROM course
      WHERE id = $1
    `,
    [id]
  );

  return rows[0];
}
