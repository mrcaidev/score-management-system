CREATE OR REPLACE VIEW full_score AS (
  WITH json_exam AS (
    SELECT id, name
    FROM exam
  ), json_course AS (
    SELECT id, name
    FROM course
  ), json_student AS (
    SELECT id, name
    FROM account
    WHERE role = 0
  )
  SELECT
    score.id,
    ROW_TO_JSON(json_exam) exam,
    ROW_TO_JSON(json_course) course,
    ROW_TO_JSON(json_student) student,
    score.score,
    score.is_absent,
    score.review_status
  FROM score
  LEFT OUTER JOIN json_exam ON json_exam.id = score.exam_id
  LEFT OUTER JOIN json_course ON json_course.id = score.course_id
  LEFT OUTER JOIN json_student ON json_student.id = score.student_id
);
