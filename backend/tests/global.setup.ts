import { app } from "app";
import supertest from "supertest";
import { beforeAll } from "vitest";

export let student = "";
export let teacher = "";

const request = supertest(app);

beforeAll(async () => {
  const response = await request
    .post("/auth/login")
    .send({ id: "2020010801001", password: "2020010801001" });
  student = "Bearer " + response.body.data;
});

beforeAll(async () => {
  const response = await request
    .post("/auth/login")
    .send({ id: "101", password: "101" });
  teacher = "Bearer " + response.body.data;
});
