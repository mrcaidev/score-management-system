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
      WHERE CASE WHEN $1::SMALLINT IS NULL THEN TRUE ELSE id = $1 END
      AND CASE WHEN $2::TEXT IS NULL THEN TRUE ELSE name = $2 END
      AND CASE WHEN $3::SMALLINT IS NULL THEN TRUE ELSE max_score = $3 END
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
