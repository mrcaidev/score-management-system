import { database } from "utils/database";
import { HttpError } from "utils/error";
import { CreateReq, FindAllReq, Score } from "./types";

export const scoreRepository = {
  findAll,
  findById,
  create,
  updateById,
  deleteById,
};

async function findAll(dto: FindAllReq["query"]) {
  const { courseId, examId, reviewStatus, studentId } = dto;

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

async function create(dto: CreateReq["body"]) {
  const { courseId, examId, isAbsent, score, studentId } = dto;

  const { rows } = await database.query<Score>(
    `
      INSERT INTO score (
        exam_id,
        course_id,
        student_id,
        score,
        is_absent
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING
        id,
        exam_id "examId",
        course_id "courseId",
        student_id "studentId",
        score,
        is_absent "isAbsent",
        review_status "reviewStatus"
    `,
    [examId, courseId, studentId, score, isAbsent]
  );

  if (!rows[0]) {
    throw new HttpError(500, "添加成绩失败，请稍后再试");
  }

  return rows[0];
}

async function updateById(id: string, dto: Score) {
  const { examId, courseId, studentId, score, isAbsent, reviewStatus } = dto;

  const { rowCount } = await database.query<Score>(
    `
      UPDATE score
      SET
        exam_id = $2,
        course_id = $3,
        student_id = $4,
        score = $5,
        is_absent = $6,
        review_status = $7
      WHERE id = $1
      RETURNING
        id,
        exam_id "examId",
        course_id "courseId",
        student_id "studentId",
        score,
        is_absent "isAbsent",
        review_status "reviewStatus"
    `,
    [id, examId, courseId, studentId, score, isAbsent, reviewStatus]
  );

  if (rowCount !== 1) {
    throw new HttpError(500, "更新成绩失败，请稍后再试");
  }
}

async function deleteById(id: string) {
  const { rowCount } = await database.query<Score>(
    `
      DELETE FROM score
      WHERE id = $1
      RETURNING
        id,
        exam_id "examId",
        course_id "courseId",
        student_id "studentId",
        score,
        is_absent "isAbsent",
        review_status "reviewStatus"
    `,
    [id]
  );

  if (rowCount !== 1) {
    throw new HttpError(500, "删除成绩失败，请稍后再试");
  }
}
