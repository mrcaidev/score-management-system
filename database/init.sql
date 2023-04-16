CREATE EXTENSION IF NOT EXISTS pgcrypto;

-----------------------------------------------------------

DROP TABLE IF EXISTS account_role CASCADE;

CREATE TABLE account_role (
  id SMALLINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name TEXT NOT NULL UNIQUE
);

ALTER TABLE account_role ENABLE ROW LEVEL SECURITY;

INSERT INTO account_role (name) VALUES
('学生'),
('班主任');

-----------------------------------------------------------

DROP TABLE IF EXISTS account CASCADE;

CREATE TABLE account (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  role SMALLINT DEFAULT 1 NOT NULL REFERENCES account_role(id),
  password TEXT NOT NULL
);

ALTER TABLE account ENABLE ROW LEVEL SECURITY;

DROP FUNCTION IF EXISTS init_password CASCADE;

CREATE FUNCTION init_password()
RETURNS TRIGGER AS $$
BEGIN
  NEW.password := CRYPT(NEW.id, GEN_SALT('bf'));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS init_password ON account;

CREATE TRIGGER init_password
BEFORE INSERT ON account
FOR EACH ROW
EXECUTE FUNCTION init_password();

INSERT INTO account (id, name, role) VALUES
('101', '朱震', 2),
('2020010801001','蔚怡香', 1),
('2020010801002','巫睿杰', 1),
('2020010801003','桑月婵', 1),
('2020010801004','廉俊誉', 1),
('2020010801005','翁思宏', 1),
('2020010801006','国哲恒', 1),
('2020010801007','越睿杰', 1),
('2020010801008','符鑫蕾', 1),
('2020010801009','舒萧然', 1),
('2020010801010','濮晧宇', 1);

-----------------------------------------------------------

DROP TABLE IF EXISTS course CASCADE;

CREATE TABLE course (
  id SMALLINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  max_score SMALLINT NOT NULL
);

ALTER TABLE course ENABLE ROW LEVEL SECURITY;

INSERT INTO course (name, max_score) VALUES
('语文', 150),
('数学', 150),
('英语', 150),
('物理', 100),
('化学', 100),
('生物', 100);

-----------------------------------------------------------

DROP TABLE IF EXISTS exam CASCADE;

CREATE TABLE exam (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  held_at TIMESTAMPTZ NOT NULL
);

ALTER TABLE exam ENABLE ROW LEVEL SECURITY;

INSERT INTO exam (name, held_at) VALUES
('2023年3月月考', '2023-03-27 08:00:00'),
('2023年4月月考', '2023-04-24 08:00:00');

-----------------------------------------------------------

DROP TABLE IF EXISTS review_status CASCADE;

CREATE TABLE review_status (
  id SMALLINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name TEXT NOT NULL UNIQUE
);

ALTER TABLE review_status ENABLE ROW LEVEL SECURITY;

INSERT INTO review_status (name) VALUES
('无'),
('待处理'),
('已驳回'),
('已受理'),
('已完成');

-----------------------------------------------------------

DROP TABLE IF EXISTS score CASCADE;

CREATE TABLE score (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  exam_id UUID NOT NULL REFERENCES exam(id),
  course_id SMALLINT NOT NULL REFERENCES course(id),
  student_id TEXT NOT NULL REFERENCES account(id),
  score SMALLINT NOT NULL,
  is_absent BOOLEAN NOT NULL,
  review_status SMALLINT DEFAULT 1 NOT NULL REFERENCES review_status(id)
);

ALTER TABLE score ENABLE ROW LEVEL SECURITY;

-----------------------------------------------------------

DROP VIEW IF EXISTS full_score CASCADE;

CREATE VIEW full_score AS (
  WITH json_exam AS (
    SELECT id, name, held_at "heldAt"
    FROM exam
  ), json_course AS (
    SELECT id, name, max_score "maxScore"
    FROM course
  ), json_student AS (
    SELECT id, name, role
    FROM account
    WHERE account.role = 1
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
