import { database } from "utils/database";
import { InternalServerError } from "utils/http-error";
import { CreateReq, FindAllReq, NamedScore, Score } from "./types";

export const scoreRepository = {
  findAll,
  findAllAsNamed,
  findById,
  findByIdAsNamed,
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

async function findAllAsNamed(dto: FindAllReq["query"]) {
  const { examId, courseId, studentId, reviewStatus } = dto;

  const { rows } = await database.query<NamedScore>(
    `
      SELECT
        score.id,
        exam.name "examName",
        course.name "courseName",
        account.name "studentName",
        score.score,
        score.is_absent "isAbsent",
        score.review_status "reviewStatus"
      FROM score
      LEFT OUTER JOIN exam ON exam.id = score.exam_id
      LEFT OUTER JOIN course ON course.id = score.course_id
      LEFT OUTER JOIN account ON account.id = score.student_id
      WHERE ($1::UUID IS NULL OR exam.id = $1)
        AND ($2::SMALLINT IS NULL OR course.id = $2)
        AND ($3::TEXT IS NULL OR account.id = $3)
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

async function findByIdAsNamed(id: string) {
  const { rows } = await database.query<NamedScore>(
    `
      SELECT
        score.id,
        exam.name "examName",
        course.name "courseName",
        account.name "studentName",
        score.score,
        score.is_absent "isAbsent",
        score.review_status "reviewStatus"
      FROM score
      LEFT OUTER JOIN exam ON exam.id = score.exam_id
      LEFT OUTER JOIN course ON course.id = score.course_id
      LEFT OUTER JOIN account ON account.id = score.student_id
      WHERE score.id = $1
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

  const namedScore = await findByIdAsNamed(rows[0].id);

  if (!namedScore) {
    throw new InternalServerError("添加成绩失败，请稍后再试");
  }

  return namedScore;
}

async function updateById(id: string, dto: Score) {
  const { examId, courseId, studentId, score, isAbsent, reviewStatus } = dto;

  const { rowCount } = await database.query(
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
    `,
    [id, examId, courseId, studentId, score, isAbsent, reviewStatus]
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
