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
  const { examId, studentId } = dto;

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
      WHERE exam_id =
        CASE WHEN $1::UUID IS NULL
        THEN (
          SELECT id
          FROM exam
          ORDER BY held_at DESC
          LIMIT 1
        )
        ELSE $1
        END
      AND ($2::TEXT IS NULL OR student_id = $2);
    `,
    [examId, studentId]
  );

  return rows;
}

async function findAllAsFull(dto: FindAllReq["query"]) {
  const { examId, studentId } = dto;

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
      WHERE (exam->>'id')::UUID =
        CASE WHEN $1::UUID IS NULL
        THEN (
          SELECT id
          FROM exam
          ORDER BY held_at DESC
          LIMIT 1
        )
        ELSE $1
        END
      AND ($2::TEXT IS NULL OR (student->>'id')::TEXT = $2);
    `,
    [examId, studentId]
  );

  return rows;
}

async function findAllWithReviewAsFull(dto: FindAllReq["query"] = {}) {
  const { examId, studentId } = dto;

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
      WHERE (exam->>'id')::UUID =
          CASE WHEN $1::UUID IS NULL
          THEN (
            SELECT id
            FROM exam
            ORDER BY held_at DESC
            LIMIT 1
          )
          ELSE $1
          END
        AND ($1::TEXT IS NULL OR (student->>'id')::TEXT = $1)
        AND review_status != 1
    `,
    [examId, studentId]
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
  const { isAbsent, score } = dto;

  const { rowCount } = await database.query(
    `
      UPDATE score
      SET
        is_absent = CASE WHEN $2::BOOLEAN IS NULL THEN is_absent ELSE $2 END,
        score = CASE WHEN $3::SMALLINT IS NULL THEN score ELSE $3 END
      WHERE id = $1
    `,
    [id, isAbsent, score]
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
