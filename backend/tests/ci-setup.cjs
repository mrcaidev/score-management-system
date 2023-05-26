const { Client } = require("pg");

const sql = `
  CREATE EXTENSION IF NOT EXISTS pgcrypto;

  -----------------------------------------------------------

  DROP TABLE IF EXISTS account_role CASCADE;

  CREATE TABLE account_role (
    id SMALLINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name TEXT NOT NULL UNIQUE
  );

  INSERT INTO account_role (name) VALUES
  ('学生'),
  ('教师');

  -----------------------------------------------------------

  DROP TABLE IF EXISTS account CASCADE;

  CREATE TABLE account (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    role SMALLINT DEFAULT 1 NOT NULL REFERENCES account_role(id),
    password TEXT NOT NULL
  );

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

  INSERT INTO exam (name, held_at) VALUES
  ('2023年3月月考', '2023-03-27 08:00:00'),
  ('2023年4月月考', '2023-04-24 08:00:00');

  -----------------------------------------------------------

  DROP TABLE IF EXISTS review_status CASCADE;

  CREATE TABLE review_status (
    id SMALLINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name TEXT NOT NULL UNIQUE
  );

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

  -----------------------------------------------------------

  DROP VIEW IF EXISTS joined_score CASCADE;

  CREATE VIEW joined_score AS (
    WITH student AS (
      SELECT id, name, role
      FROM account
      WHERE role = 1
    )
    SELECT
      score.id,
      exam.id exam_id,
      exam.name exam_name,
      exam.held_at exam_held_at,
      course.id course_id,
      course.name course_name,
      course.max_score course_max_score,
      student.id student_id,
      student.name student_name,
      student.role student_role,
      score.score,
      score.is_absent,
      score.review_status
    FROM score
    LEFT OUTER JOIN exam ON exam.id = score.exam_id
    LEFT OUTER JOIN course ON course.id = score.course_id
    LEFT OUTER JOIN student ON student.id = score.student_id
  );
`;

async function setup() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  await client.query(sql);
  await client.end();
}

setup();
