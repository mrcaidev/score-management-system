import { app } from "app";
import supertest from "supertest";
import { beforeAll } from "vitest";

export const STUDENT_ID = "2020010801001";
export const TEACHER_ID = "101";

export let student = "";
export let teacher = "";

const request = supertest(app);

beforeAll(async () => {
  const response = await request
    .post("/auth/login")
    .send({ id: STUDENT_ID, password: STUDENT_ID });
  student = "Bearer " + response.body.data;
});

beforeAll(async () => {
  const response = await request
    .post("/auth/login")
    .send({ id: TEACHER_ID, password: TEACHER_ID });
  teacher = "Bearer " + response.body.data;
});
