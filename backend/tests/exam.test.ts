import { app } from "app";
import supertest from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { studentCookie, teacherCookie } from "./setup";

const request = supertest(app);

describe("GET /exams", () => {
  it("finds all exams", async () => {
    const response = await request.get("/exams");
    expect(response.status).toEqual(200);
    for (const item of response.body.data) {
      expect(item).toMatchObject({
        id: expect.any(String),
        name: expect.any(String),
        heldAt: expect.any(String),
      });
    }
  });
});

describe("POST /exams", () => {
  let examId: string;

  afterAll(async () => {
    await request.delete("/exams/" + examId).set("Cookie", teacherCookie);
  });

  it("creates exam", async () => {
    const response = await request
      .post("/exams")
      .set("Cookie", teacherCookie)
      .send({ name: "1", heldAt: "2021-01-01T00:00:00.000Z" });
    expect(response.status).toEqual(201);
    expect(response.body.data).toMatchObject({
      id: expect.any(String),
      name: "1",
      heldAt: "2021-01-01T00:00:00.000Z",
    });

    examId = response.body.data.id;
  });

  it("returns 400 when data format is invalid", async () => {
    const response = await request
      .post("/exams")
      .set("Cookie", teacherCookie)
      .send({ name: 0, heldAt: false });
    expect(response.status).toEqual(400);
  });

  it("returns 401 when not logged in", async () => {
    const response = await request
      .post("/exams")
      .send({ name: "1", heldAt: "2021-01-01T00:00:00.000Z" });
    expect(response.status).toEqual(401);
  });

  it("returns 403 when logged in as student", async () => {
    const response = await request
      .post("/exams")
      .set("Cookie", studentCookie)
      .send({ name: "1", heldAt: "2021-01-01T00:00:00.000Z" });
    expect(response.status).toEqual(403);
  });
});

describe("PATCH /exams/:id", () => {
  let examId: string;

  beforeAll(async () => {
    const response = await request
      .post("/exams")
      .set("Cookie", teacherCookie)
      .send({ name: "2", heldAt: "2021-01-01T00:00:00.000Z" });
    examId = response.body.data.id;
  });

  afterAll(async () => {
    await request.delete("/exams/" + examId).set("Cookie", teacherCookie);
  });

  it("updates exam", async () => {
    const response = await request
      .patch("/exams/" + examId)
      .set("Cookie", teacherCookie)
      .send({ name: "22", heldAt: "2021-01-01T00:00:00.000Z" });
    expect(response.status).toEqual(204);
  });

  it("returns 400 when data format is invalid", async () => {
    const response = await request
      .patch("/exams/" + examId)
      .set("Cookie", teacherCookie)
      .send({ name: 0, heldAt: false });
    expect(response.status).toEqual(400);
  });

  it("returns 401 when not logged in", async () => {
    const response = await request
      .patch("/exams/" + examId)
      .send({ name: "22", heldAt: "2021-01-01T00:00:00.000Z" });
    expect(response.status).toEqual(401);
  });

  it("returns 403 when logged in as student", async () => {
    const response = await request
      .patch("/exams/" + examId)
      .set("Cookie", studentCookie)
      .send({ name: "22", heldAt: "2021-01-01T00:00:00.000Z" });
    expect(response.status).toEqual(403);
  });

  it("returns 404 when exam does not exist", async () => {
    const response = await request
      .patch("/exams/00000000-0000-0000-0000-000000000000")
      .set("Cookie", teacherCookie)
      .send({ name: "22", heldAt: "2021-01-01T00:00:00.000Z" });
    expect(response.status).toEqual(404);
  });
});

describe("DELETE /exams/:id", () => {
  let examId: string;

  beforeAll(async () => {
    const response = await request
      .post("/exams")
      .set("Cookie", teacherCookie)
      .send({ name: "3", heldAt: "2021-01-01T00:00:00.000Z" });
    examId = response.body.data.id;
  });

  it("deletes exam", async () => {
    const response = await request
      .delete("/exams/" + examId)
      .set("Cookie", teacherCookie);
    expect(response.status).toEqual(204);
  });

  it("returns 401 when not logged in", async () => {
    const response = await request.delete("/exams/" + examId);
    expect(response.status).toEqual(401);
  });

  it("returns 403 when logged in as student", async () => {
    const response = await request
      .delete("/exams/" + examId)
      .set("Cookie", studentCookie);
    expect(response.status).toEqual(403);
  });

  it("returns 404 when exam does not exist", async () => {
    const response = await request
      .delete("/exams/00000000-0000-0000-0000-000000000000")
      .set("Cookie", teacherCookie);
    expect(response.status).toEqual(404);
  });
});
