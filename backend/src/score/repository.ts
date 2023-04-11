import { database } from "utils/database";
import { ServiceUnavailableError } from "utils/http-error";
import { FullScore, Score } from "./types";

export const scoreRepository = {
  find,
  findAsFull,
  findOne,
  findOneAsFull,
  findWithReviewAsFull,
  create,
  update,
  remove,
};

async function find(filter: Partial<Score> = {}) {
  const { id, examId, courseId, studentId, score, isAbsent, reviewStatus } =
    filter;

  const { rows } = await database.query<Score>(
    `
      SELECT
        id,
        exam_id "examId",
        course_id "courseId",
        student_id "studentId",
        score,
        is_absent "isAbsent",
        review_status "reviewStatus"
      FROM score
      WHERE ($1::UUID IS NULL OR id = $1)
      AND ($2::UUID IS NULL OR exam_id = $2)
      AND ($3::SMALLINT IS NULL OR course_id = $3)
      AND ($4::TEXT IS NULL OR student_id = $4)
      AND ($5::SMALLINT IS NULL OR score = $5)
      AND ($6::BOOLEAN IS NULL OR is_absent = $6)
      AND ($7::SMALLINT IS NULL OR review_status = $7)
    `,
    [id, examId, courseId, studentId, score, isAbsent, reviewStatus]
  );

  return rows;
}

async function findAsFull(filter: Partial<Score> = {}) {
  const { id, examId, courseId, studentId, score, isAbsent, reviewStatus } =
    filter;

  const { rows } = await database.query<FullScore>(
    `
      SELECT
        id,
        exam,
        course,
        student,
        score,
        is_absent "isAbsent",
        review_status "reviewStatus"
      FROM full_score
      WHERE ($1::UUID IS NULL OR id = $1)
      AND ($2::UUID IS NULL OR (exam->>'id')::UUID = $2)
      AND ($3::SMALLINT IS NULL OR (course->>'id')::SMALLINT = $3)
      AND ($4::TEXT IS NULL OR (student->>'id')::TEXT = $4)
      AND ($5::SMALLINT IS NULL OR score = $5)
      AND ($6::BOOLEAN IS NULL OR is_absent = $6)
      AND ($7::SMALLINT IS NULL OR review_status = $7)
    `,
    [id, examId, courseId, studentId, score, isAbsent, reviewStatus]
  );

  return rows;
}

async function findWithReviewAsFull(filter: Partial<Score> = {}) {
  const { id, examId, courseId, studentId, score, isAbsent } = filter;

  const { rows } = await database.query<FullScore>(
    `
      SELECT
        id,
        exam,
        course,
        student,
        score,
        is_absent "isAbsent",
        review_status "reviewStatus"
      FROM full_score
      WHERE ($1::UUID IS NULL OR id = $1)
      AND ($2::UUID IS NULL OR (exam->>'id')::UUID = $2)
      AND ($3::SMALLINT IS NULL OR (course->>'id')::SMALLINT = $3)
      AND ($4::TEXT IS NULL OR (student->>'id')::TEXT = $4)
      AND ($5::SMALLINT IS NULL OR score = $5)
      AND ($6::BOOLEAN IS NULL OR is_absent = $6)
      AND review_status != 1
    `,
    [id, examId, courseId, studentId, score, isAbsent]
  );

  return rows;
}

async function findOne(filter: Partial<Score> = {}) {
  const rows = await find(filter);
  return rows[0];
}

async function findOneAsFull(filter: Partial<Score> = {}) {
  const rows = await findAsFull(filter);
  return rows[0];
}

async function create(creator: Omit<Score, "id" | "reviewStatus">) {
  const { examId, courseId, studentId, score, isAbsent } = creator;

  const { rows } = await database.query<{ id: string }>(
    `
      INSERT INTO score (
        exam_id,
        course_id,
        student_id,
        score,
        is_absent
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id
    `,
    [examId, courseId, studentId, score, isAbsent]
  );

  if (!rows[0]) {
    throw new ServiceUnavailableError("添加失败，请稍后再试");
  }

  const fullScore = await findOneAsFull({ id: rows[0].id });

  if (!fullScore) {
    throw new ServiceUnavailableError("添加失败，请稍后再试");
  }

  return fullScore;
}

async function update(id: string, updater: Partial<Score> = {}) {
  const { examId, courseId, studentId, score, isAbsent, reviewStatus } =
    updater;

  const { rowCount } = await database.query(
    `
      UPDATE score
      SET
        exam_id = CASE WHEN $2::UUID IS NULL THEN exam_id ELSE $2 END,
        course_id = CASE WHEN $3::SMALLINT IS NULL THEN course_id ELSE $3 END,
        student_id = CASE WHEN $4::TEXT IS NULL THEN student_id ELSE $4 END,
        score = CASE WHEN $5::SMALLINT IS NULL THEN score ELSE $5 END,
        is_absent = CASE WHEN $6::BOOLEAN IS NULL THEN is_absent ELSE $6 END,
        review_status = CASE WHEN $7::SMALLINT IS NULL THEN review_status ELSE $7 END
      WHERE id = $1
    `,
    [id, examId, courseId, studentId, score, isAbsent, reviewStatus]
  );

  if (rowCount !== 1) {
    throw new ServiceUnavailableError("更新失败，请稍后再试");
  }
}

async function remove(id: string) {
  const { rowCount } = await database.query(
    `
      DELETE FROM score
      WHERE id = $1
    `,
    [id]
  );

  if (rowCount !== 1) {
    throw new ServiceUnavailableError("删除失败，请稍后再试");
  }
}
