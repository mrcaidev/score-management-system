import { Account } from "account/types";
import { app } from "app";
import { Course } from "course/types";
import { Exam } from "exam/types";
import supertest from "supertest";
import { beforeAll } from "vitest";

export const studentId = "2020010801001";
export const teacherId = "101";

export let studentToken: string;
export let teacherToken: string;

export let exam: Exam;
export let course: Course;
export let student: Account;

const request = supertest(app);

beforeAll(async () => {
  const studentTokenResponse = await request
    .post("/auth/login")
    .send({ id: studentId, password: studentId });
  studentToken = "Bearer " + studentTokenResponse.body.data;

  const teacherTokenResponse = await request
    .post("/auth/login")
    .send({ id: teacherId, password: teacherId });
  teacherToken = "Bearer " + teacherTokenResponse.body.data;

  const examResponse = await request
    .get("/exams")
    .set("Authorization", teacherToken);
  exam = examResponse.body.data[0];

  const courseResponse = await request
    .get("/courses")
    .set("Authorization", teacherToken);
  course = courseResponse.body.data[0];

  const studentResponse = await request
    .get("/accounts")
    .set("Authorization", teacherToken);
  student = studentResponse.body.data[0];
});
