import { database } from "utils/database";
import { InternalServerError } from "utils/http-error";
import { CreateReq, FindAllReq, FullScore, Score, UpdateReq } from "./types";

export const scoreRepository = {
  findAll,
  findAllAsFull,
  findAllWithReviewAsFull,
  findById,
  findByIdAsFull,
  create,
  updateById,
  deleteById,
};

async function findAll(dto: FindAllReq["query"]) {
  const { examId, courseId, studentId, reviewStatus } = dto;

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
      WHERE ($1::UUID IS NULL OR exam_id = $1)
        AND ($2::SMALLINT IS NULL OR course_id = $2)
        AND ($3::TEXT IS NULL OR student_id = $3)
        AND ($4::SMALLINT IS NULL OR review_status = $4)
    `,
    [examId, courseId, studentId, reviewStatus]
  );

  return rows;
}

async function findAllAsFull(dto: FindAllReq["query"]) {
  const { examId, courseId, studentId, reviewStatus } = dto;

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
      WHERE ($1::UUID IS NULL OR (exam->>'id')::UUID = $1)
        AND ($2::SMALLINT IS NULL OR (course->>'id')::SMALLINT = $2)
        AND ($3::TEXT IS NULL OR (student->>'id')::TEXT = $3)
        AND ($4::SMALLINT IS NULL OR review_status = $4)
    `,
    [examId, courseId, studentId, reviewStatus]
  );

  return rows;
}

async function findAllWithReviewAsFull(
  dto: Pick<FindAllReq["query"], "studentId"> = {}
) {
  const { studentId } = dto;

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
      WHERE ($1::TEXT IS NULL OR (student->>'id')::TEXT = $1)
        AND review_status != 1
    `,
    [studentId]
  );

  return rows;
}

async function findById(id: string) {
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
      WHERE id = $1
    `,
    [id]
  );

  return rows[0];
}

async function findByIdAsFull(id: string) {
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
      WHERE id = $1
    `,
    [id]
  );

  return rows[0];
}

async function create(dto: CreateReq["body"]) {
  const { courseId, examId, isAbsent, score, studentId } = dto;

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
    throw new InternalServerError("添加成绩失败，请稍后再试");
  }

  const fullScore = await findByIdAsFull(rows[0].id);

  if (!fullScore) {
    throw new InternalServerError("添加成绩失败，请稍后再试");
  }

  return fullScore;
}

async function updateById(id: string, dto: UpdateReq["body"]) {
  const { score, reviewStatus } = dto;

  const { rowCount } = await database.query(
    `
      UPDATE score
      SET score = CASE WHEN $2 IS NULL THEN score ELSE $2 END,
        review_status = CASE WHEN $3 IS NULL THEN review_status ELSE $3 END
      WHERE id = $1
    `,
    [id, score, reviewStatus]
  );

  if (rowCount !== 1) {
    throw new InternalServerError("更新成绩失败，请稍后再试");
  }
}

async function deleteById(id: string) {
  const { rowCount } = await database.query(
    `
      DELETE FROM score
      WHERE id = $1
    `,
    [id]
  );

  if (rowCount !== 1) {
    throw new InternalServerError("删除成绩失败，请稍后再试");
  }
}
