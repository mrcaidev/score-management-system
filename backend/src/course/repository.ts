import { database } from "utils/database";
import { Course } from "./types";

export const courseRepository = {
  find,
  findOne,
};

async function find(filter: Partial<Course> = {}) {
  const { id, name, maxScore } = filter;

  const { rows } = await database.query<Course>(
    `
      SELECT id, name, max_score "maxScore"
      FROM course
      WHERE ($1::SMALLINT IS NULL OR id = $1)
      AND ($2::TEXT IS NULL OR name = $2)
      AND ($3::SMALLINT IS NULL OR max_score = $3)
      ORDER BY id ASC
    `,
    [id, name, maxScore]
  );

  return rows;
}

async function findOne(filter: Partial<Course> = {}) {
  const rows = await find(filter);
  return rows[0];
}
