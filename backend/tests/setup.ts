import { app } from "app";
import { Exam } from "exam/types";
import supertest from "supertest";
import { generateJwt } from "utils/jwt";
import { beforeAll } from "vitest";

export const studentId = "2020010801001";
export const teacherId = "101";

export let studentCookie: string;
export let teacherCookie: string;
export let exam: Exam;

const request = supertest(app);

beforeAll(async () => {
  studentCookie = "token=" + (await generateJwt({ id: studentId }));
  teacherCookie = "token=" + (await generateJwt({ id: teacherId }));

  const examResponse = await request.get("/exams").set("Cookie", teacherCookie);
  exam = examResponse.body.data[0];
});
