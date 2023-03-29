DROP TABLE IF EXISTS score;
DROP TABLE IF EXISTS account;
DROP TABLE IF EXISTS course;
DROP TABLE IF EXISTS exam;

-----------------------------------------------------------

CREATE TABLE IF NOT EXISTS course (
  id SMALLINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name TEXT UNIQUE NOT NULL,
  max_score SMALLINT NOT NULL
);

INSERT INTO course (name, max_score) VALUES
('语文', 150),
('数学', 150),
('英语', 150),
('物理', 100),
('化学', 100),
('生物', 100);

ALTER TABLE course ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable all access to service_role" ON course
AS PERMISSIVE
FOR ALL
TO service_role
USING (true);

-----------------------------------------------------------

CREATE TABLE IF NOT EXISTS exam (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  held_at TIMESTAMPTZ NOT NULL
);

INSERT INTO exam (name, held_at) VALUES
('2023年3月月考', '2023-03-27');

ALTER TABLE exam ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable all access to service_role" ON exam
AS PERMISSIVE
FOR ALL
TO service_role
USING (true);

-----------------------------------------------------------

CREATE TABLE IF NOT EXISTS account (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  password TEXT NOT NULL,
  role SMALLINT NOT NULL CHECK (role IN (0, 1))
);

INSERT INTO account (id, name, password, role) VALUES
('2020010801001','蔚怡香', CRYPT('2020010801001', GEN_SALT('bf')), 0),
('2020010801002','巫睿杰', CRYPT('2020010801002', GEN_SALT('bf')), 0),
('2020010801003','桑月婵', CRYPT('2020010801003', GEN_SALT('bf')), 0),
('2020010801004','廉俊誉', CRYPT('2020010801004', GEN_SALT('bf')), 0),
('2020010801005','翁思宏', CRYPT('2020010801005', GEN_SALT('bf')), 0),
('2020010801006','国哲恒', CRYPT('2020010801006', GEN_SALT('bf')), 0),
('2020010801007','越睿杰', CRYPT('2020010801007', GEN_SALT('bf')), 0),
('2020010801008','符鑫蕾', CRYPT('2020010801008', GEN_SALT('bf')), 0),
('2020010801009','舒萧然', CRYPT('2020010801009', GEN_SALT('bf')), 0),
('2020010801010','濮晧宇', CRYPT('2020010801010', GEN_SALT('bf')), 0),
('101', '朱震', CRYPT('101', GEN_SALT('bf')), 1);

ALTER TABLE account ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable all access to service_role" ON account
AS PERMISSIVE
FOR ALL
TO service_role
USING (true);

-----------------------------------------------------------

CREATE TABLE IF NOT EXISTS score (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  exam_id UUID NOT NULL REFERENCES exam(id),
  course_id SMALLINT NOT NULL REFERENCES course(id),
  student_id TEXT NOT NULL REFERENCES account(id),
  score SMALLINT NOT NULL,
  is_absent BOOLEAN NOT NULL,
  review_status SMALLINT NOT NULL DEFAULT 0 CHECK (review_status IN (0, 1, 2, 3, 4))
);

ALTER TABLE score ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable all access to service_role" ON score
AS PERMISSIVE
FOR ALL
TO service_role
USING (true);

-----------------------------------------------------------

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
