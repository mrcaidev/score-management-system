import { Role } from "account/types";
import { database } from "utils/database";
import { ServiceUnavailableError } from "utils/http-error";
import { FullScore, Score } from "./types";

export const scoreRepository = {
  find,
  findWithReview,
  findOne,
  create,
  updateById,
  removeById,
};

async function find(filter: Partial<Score> = {}) {
  const { id, examId, courseId, studentId, score, isAbsent, reviewStatus } =
    filter;

  const { rows } = await database.query<UnshapedFullScore>(
    `
      SELECT
        id,
        exam_id "examId",
        exam_name "examName",
        exam_held_at "examHeldAt",
        course_id "courseId",
        course_name "courseName",
        course_max_score "courseMaxScore",
        student_id "studentId",
        student_name "studentName",
        student_role "studentRole",
        score,
        is_absent "isAbsent",
        review_status "reviewStatus"
      FROM joined_score
      WHERE CASE WHEN $1::UUID IS NULL THEN TRUE ELSE id = $1 END
      AND CASE WHEN $2::UUID IS NULL THEN TRUE ELSE exam_id = $2 END
      AND CASE WHEN $3::SMALLINT IS NULL THEN TRUE ELSE course_id = $3 END
      AND CASE WHEN $4::TEXT IS NULL THEN TRUE ELSE student_id = $4 END
      AND CASE WHEN $5::SMALLINT IS NULL THEN TRUE ELSE score = $5 END
      AND CASE WHEN $6::BOOLEAN IS NULL THEN TRUE ELSE is_absent = $6 END
      AND CASE WHEN $7::SMALLINT IS NULL THEN TRUE ELSE review_status = $7 END
    `,
    [id, examId, courseId, studentId, score, isAbsent, reviewStatus]
  );

  return rows.map(reshape);
}

async function findWithReview(filter: Partial<Score> = {}) {
  const { id, examId, courseId, studentId, score, isAbsent } = filter;

  const { rows } = await database.query<UnshapedFullScore>(
    `
      SELECT
        id,
        exam_id "examId",
        exam_name "examName",
        exam_held_at "examHeldAt",
        course_id "courseId",
        course_name "courseName",
        course_max_score "courseMaxScore",
        student_id "studentId",
        student_name "studentName",
        student_role "studentRole",
        score,
        is_absent "isAbsent",
        review_status "reviewStatus"
      FROM joined_score
      WHERE CASE WHEN $1::UUID IS NULL THEN TRUE ELSE id = $1 END
      AND CASE WHEN $2::UUID IS NULL THEN TRUE ELSE exam_id = $2 END
      AND CASE WHEN $3::SMALLINT IS NULL THEN TRUE ELSE course_id = $3 END
      AND CASE WHEN $4::TEXT IS NULL THEN TRUE ELSE student_id = $4 END
      AND CASE WHEN $5::SMALLINT IS NULL THEN TRUE ELSE score = $5 END
      AND CASE WHEN $6::BOOLEAN IS NULL THEN TRUE ELSE is_absent = $6 END
      AND review_status != 1
    `,
    [id, examId, courseId, studentId, score, isAbsent]
  );

  return rows.map(reshape);
}

async function findOne(filter: Partial<Score> = {}) {
  const rows = await find(filter);
  return rows[0];
}

async function create(creator: Omit<Score, "id" | "reviewStatus">) {
  const { examId, courseId, studentId, score, isAbsent } = creator;

  const { rows } = await database.query<{ id: string }>(
    `
      INSERT INTO score (exam_id, course_id, student_id, score, is_absent)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id
    `,
    [examId, courseId, studentId, score, isAbsent]
  );

  if (!rows[0]) {
    throw new ServiceUnavailableError("添加失败，请稍后再试");
  }

  const fullScore = await findOne({ id: rows[0].id });

  if (!fullScore) {
    throw new ServiceUnavailableError("添加失败，请稍后再试");
  }

  return fullScore;
}

async function updateById(id: string, updater: Partial<Score> = {}) {
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

async function removeById(id: string) {
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

type UnshapedFullScore = {
  id: string;
  examId: string;
  examName: string;
  examHeldAt: string;
  courseId: number;
  courseName: string;
  courseMaxScore: number;
  studentId: string;
  studentName: string;
  studentRole: Role;
  score: number;
  isAbsent: boolean;
  reviewStatus: number;
};

function reshape(score: UnshapedFullScore) {
  return {
    id: score.id,
    exam: {
      id: score.examId,
      name: score.examName,
      heldAt: score.examHeldAt,
    },
    course: {
      id: score.courseId,
      name: score.courseName,
      maxScore: score.courseMaxScore,
    },
    student: {
      id: score.studentId,
      name: score.studentName,
      role: score.studentRole,
    },
    score: score.score,
    isAbsent: score.isAbsent,
    reviewStatus: score.reviewStatus,
  } as FullScore;
}
