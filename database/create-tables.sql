CREATE TABLE IF NOT EXISTS course (
  id SMALLINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name TEXT UNIQUE NOT NULL,
  max_score SMALLINT NOT NULL
);

ALTER TABLE course ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable all access to service_role" ON course
AS PERMISSIVE
FOR ALL
TO service_role
USING (true);

CREATE TABLE IF NOT EXISTS exam (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  held_at TIMESTAMPTZ NOT NULL
);

ALTER TABLE exam ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable all access to service_role" ON exam
AS PERMISSIVE
FOR ALL
TO service_role
USING (true);

CREATE TABLE IF NOT EXISTS account (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  password TEXT NOT NULL,
  role SMALLINT NOT NULL
);

ALTER TABLE account ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable all access to service_role" ON account
AS PERMISSIVE
FOR ALL
TO service_role
USING (true);

CREATE TABLE IF NOT EXISTS score (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id TEXT NOT NULL REFERENCES account(id),
  exam_id UUID NOT NULL REFERENCES exam(id),
  course_id SMALLINT NOT NULL REFERENCES course(id),
  score SMALLINT NOT NULL,
  is_absent BOOLEAN NOT NULL DEFAULT FALSE,
  review_status SMALLINT NOT NULL DEFAULT 0
);

ALTER TABLE score ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable all access to service_role" ON score
AS PERMISSIVE
FOR ALL
TO service_role
USING (true);
