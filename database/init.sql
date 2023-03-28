DROP TABLE IF EXISTS course;

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

DROP TABLE IF EXISTS review_status;

CREATE TABLE IF NOT EXISTS review_status (
  id SMALLINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name TEXT UNIQUE NOT NULL
);

INSERT INTO review_status (name) VALUES
('无'),
('待处理'),
('已受理'),
('已驳回'),
('已完成');

ALTER TABLE review_status ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable all access to service_role" ON review_status
AS PERMISSIVE
FOR ALL
TO service_role
USING (true);

-----------------------------------------------------------

DROP TABLE IF EXISTS role;

CREATE TABLE IF NOT EXISTS role (
  id SMALLINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name TEXT UNIQUE NOT NULL
);

INSERT INTO role (name) VALUES
('学生'),
('教师');

ALTER TABLE role ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable all access to service_role" ON role
AS PERMISSIVE
FOR ALL
TO service_role
USING (true);

-----------------------------------------------------------

DROP TABLE IF EXISTS account;

CREATE TABLE IF NOT EXISTS account (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  password TEXT NOT NULL,
  role_id SMALLINT NOT NULL REFERENCES role(id)
);

INSERT INTO account (id, name, password, role_id) VALUES
('101', '朱震', CRYPT('101', GEN_SALT('bf')), 2),
('2020010801001','蔚怡香', CRYPT('2020010801001', GEN_SALT('bf')), 1),
('2020010801002','巫睿杰', CRYPT('2020010801002', GEN_SALT('bf')), 1),
('2020010801003','桑月婵', CRYPT('2020010801003', GEN_SALT('bf')), 1),
('2020010801004','廉俊誉', CRYPT('2020010801004', GEN_SALT('bf')), 1),
('2020010801005','翁思宏', CRYPT('2020010801005', GEN_SALT('bf')), 1),
('2020010801006','国哲恒', CRYPT('2020010801006', GEN_SALT('bf')), 1),
('2020010801007','越睿杰', CRYPT('2020010801007', GEN_SALT('bf')), 1),
('2020010801008','符鑫蕾', CRYPT('2020010801008', GEN_SALT('bf')), 1),
('2020010801009','舒萧然', CRYPT('2020010801009', GEN_SALT('bf')), 1),
('2020010801010','濮晧宇', CRYPT('2020010801010', GEN_SALT('bf')), 1);

ALTER TABLE account ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable all access to service_role" ON account
AS PERMISSIVE
FOR ALL
TO service_role
USING (true);

-----------------------------------------------------------

DROP TABLE IF EXISTS exam;

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

DROP TABLE IF EXISTS score;

CREATE TABLE IF NOT EXISTS score (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  exam_id UUID NOT NULL REFERENCES exam(id),
  course_id SMALLINT NOT NULL REFERENCES course(id),
  student_id TEXT NOT NULL REFERENCES account(id),
  score SMALLINT NOT NULL,
  is_absent BOOLEAN NOT NULL,
  review_status_id SMALLINT NOT NULL DEFAULT 0 REFERENCES review_status(id)
);

ALTER TABLE score ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable all access to service_role" ON score
AS PERMISSIVE
FOR ALL
TO service_role
USING (true);
