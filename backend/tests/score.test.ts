import { app } from "app";
import supertest from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import {
  course,
  exam,
  studentId,
  studentToken,
  teacherToken,
} from "./global.setup";

const request = supertest(app);

describe("GET /scores", () => {
  it("finds his own scores when logged in as student", async () => {
    const response = await request
      .get("/scores")
      .set("Authorization", studentToken);
    for (const item of response.body.data) {
      expect(item).toMatchObject({
        id: expect.any(String),
        exam: {
          id: expect.any(String),
          name: expect.any(String),
          heldAt: expect.any(String),
        },
        course: {
          id: expect.any(Number),
          name: expect.any(String),
          maxScore: expect.any(Number),
        },
        student: {
          id: studentId,
          name: expect.any(String),
          role: expect.any(Number),
        },
        score: expect.any(Number),
        isAbsent: expect.any(Boolean),
        reviewStatus: expect.any(Number),
      });
    }
  });

  it("finds all scores when logged in as teacher", async () => {
    const response = await request
      .get("/scores")
      .set("Authorization", teacherToken);
    for (const item of response.body.data) {
      expect(item).toMatchObject({
        id: expect.any(String),
        exam: {
          id: expect.any(String),
          name: expect.any(String),
          heldAt: expect.any(String),
        },
        course: {
          id: expect.any(Number),
          name: expect.any(String),
          maxScore: expect.any(Number),
        },
        student: {
          id: expect.any(String),
          name: expect.any(String),
          role: expect.any(Number),
        },
        score: expect.any(Number),
        isAbsent: expect.any(Boolean),
        reviewStatus: expect.any(Number),
      });
    }
  });

  it("finds all score with specified exam id", async () => {
    const response = await request
      .get("/scores")
      .query({ examId: exam.id })
      .set("Authorization", teacherToken);
    for (const item of response.body.data) {
      expect(item).toMatchObject({ exam: { id: exam.id } });
    }
  });

  it("returns 401 when not logged in", async () => {
    const response = await request.get("/scores");
    expect(response.status).toEqual(401);
  });
});

describe("POST /scores", () => {
  let scoreId: string;

  afterAll(async () => {
    await request
      .delete("/scores/" + scoreId)
      .set("Authorization", teacherToken);
  });

  it("creates score", async () => {
    const response = await request
      .post("/scores")
      .set("Authorization", teacherToken)
      .send({
        examId: exam.id,
        courseId: course.id,
        studentId,
        score: 100,
        isAbsent: false,
      });
    expect(response.status).toEqual(201);
    expect(response.body.data).toMatchObject({
      id: expect.any(String),
      exam: { id: exam.id },
      course: { id: course.id },
      student: { id: studentId },
      score: 100,
      isAbsent: false,
      reviewStatus: 1,
    });

    scoreId = response.body.data.id;
  });

  it("returns 400 when data format is invalid", async () => {
    const response = await request
      .post("/scores")
      .set("Authorization", teacherToken)
      .send({
        examId: 0,
        courseId: "0",
        studentId: false,
        score: "100",
        isAbsent: "false",
      });
    expect(response.status).toEqual(400);
  });

  it("returns 401 when not logged in", async () => {
    const response = await request.post("/scores");
    expect(response.status).toEqual(401);
  });

  it("returns 403 when logged in as student", async () => {
    const response = await request
      .post("/scores")
      .set("Authorization", studentToken);
    expect(response.status).toEqual(403);
  });

  it("returns 404 when exam id is not found", async () => {
    const response = await request
      .post("/scores")
      .set("Authorization", teacherToken)
      .send({
        examId: "00000000-0000-0000-0000-000000000000",
        courseId: course.id,
        studentId,
        score: 100,
        isAbsent: false,
      });
    expect(response.status).toEqual(404);
  });

  it("returns 404 when course id is not found", async () => {
    const response = await request
      .post("/scores")
      .set("Authorization", teacherToken)
      .send({
        examId: exam.id,
        courseId: 100,
        studentId,
        score: 100,
        isAbsent: false,
      });
    expect(response.status).toEqual(404);
  });

  it("returns 404 when student id is not found", async () => {
    const response = await request
      .post("/scores")
      .set("Authorization", teacherToken)
      .send({
        examId: exam.id,
        courseId: course.id,
        studentId: "0",
        score: 100,
        isAbsent: false,
      });
    expect(response.status).toEqual(404);
  });

  it("returns 409 when score already exists", async () => {
    const response = await request
      .post("/scores")
      .set("Authorization", teacherToken)
      .send({
        examId: exam.id,
        courseId: course.id,
        studentId,
        score: 100,
        isAbsent: false,
      });
    expect(response.status).toEqual(409);
  });

  it("returns 422 when score exceeds max score", async () => {
    const response = await request
      .post("/scores")
      .set("Authorization", teacherToken)
      .send({
        examId: exam.id,
        courseId: course.id + 1,
        studentId,
        score: course.maxScore + 1,
        isAbsent: false,
      });
    expect(response.status).toEqual(422);
  });
});

describe("PATCH /scores/:id", () => {
  let scoreId: string;

  beforeAll(async () => {
    const response = await request
      .post("/scores")
      .set("Authorization", teacherToken)
      .send({
        examId: exam.id,
        courseId: course.id,
        studentId,
        score: 100,
        isAbsent: false,
      });
    console.log(response.body);
    scoreId = response.body.data.id;
  });

  afterAll(async () => {
    await request
      .delete("/scores/" + scoreId)
      .set("Authorization", teacherToken);
  });

  it("updates score", async () => {
    const response = await request
      .patch("/scores/" + scoreId)
      .set("Authorization", teacherToken)
      .send({
        examId: exam.id,
        courseId: course.id,
        studentId,
        score: 90,
        isAbsent: false,
      });
    expect(response.status).toEqual(204);
  });

  it("returns 400 when data format is invalid", async () => {
    const response = await request
      .patch("/scores/" + scoreId)
      .set("Authorization", teacherToken)
      .send({
        examId: 0,
        courseId: "0",
        studentId: false,
        score: "100",
        isAbsent: "false",
      });

    expect(response.status).toEqual(400);
  });

  it("returns 401 when not logged in", async () => {
    const response = await request.patch("/scores/" + scoreId);
    expect(response.status).toEqual(401);
  });

  it("returns 403 when logged in as student", async () => {
    const response = await request
      .patch("/scores/" + scoreId)
      .set("Authorization", studentToken);
    expect(response.status).toEqual(403);
  });

  it("returns 404 when score id is not found", async () => {
    const response = await request
      .patch("/scores/00000000-0000-0000-0000-000000000000")
      .set("Authorization", teacherToken)
      .send({
        examId: exam.id,
        courseId: course.id,
        studentId,
        score: 100,
        isAbsent: false,
      });
    expect(response.status).toEqual(404);
  });

  it("returns 422 when score exceeds max score", async () => {
    const response = await request
      .patch("/scores/" + scoreId)
      .set("Authorization", teacherToken)
      .send({
        examId: exam.id,
        courseId: course.id,
        studentId,
        score: course.maxScore + 1,
        isAbsent: false,
      });
    expect(response.status).toEqual(422);
  });
});

describe("DELETE /scores/:id", () => {
  let scoreId: string;

  beforeAll(async () => {
    const response = await request
      .post("/scores")
      .set("Authorization", teacherToken)
      .send({
        examId: exam.id,
        courseId: course.id,
        studentId,
        score: 100,
        isAbsent: false,
      });
    scoreId = response.body.data.id;
  });

  it("deletes score", async () => {
    const response = await request
      .delete("/scores/" + scoreId)
      .set("Authorization", teacherToken);
    expect(response.status).toEqual(204);
  });

  it("returns 401 when not logged in", async () => {
    const response = await request.delete("/scores/" + scoreId);
    expect(response.status).toEqual(401);
  });

  it("returns 403 when logged in as student", async () => {
    const response = await request
      .delete("/scores/" + scoreId)
      .set("Authorization", studentToken);
    expect(response.status).toEqual(403);
  });

  it("returns 404 when score id is not found", async () => {
    const response = await request
      .delete("/scores/00000000-0000-0000-0000-000000000000")
      .set("Authorization", teacherToken);
    expect(response.status).toEqual(404);
  });
});
