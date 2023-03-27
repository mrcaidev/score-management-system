import { database } from "utils/database";
import { Course } from "./types";

export const courseRepository = {
  findAll,
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
