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

describe("GET /reviews", () => {
  it("finds his own reviews when logged in as student", async () => {
    const response = await request
      .get("/reviews")
      .set("Authorization", studentToken);
    expect(response.status).toEqual(200);
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

  it("finds all reviews when logged in as teacher", async () => {
    const response = await request
      .get("/reviews")
      .set("Authorization", teacherToken);
    expect(response.status).toEqual(200);
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

  it("returns 401 when not logged in", async () => {
    const response = await request.get("/reviews");
    expect(response.status).toEqual(401);
  });
});

describe("POST /reviews", () => {
  let scoreId: string;

  beforeAll(async () => {
    const response = await request
      .post("/scores")
      .set("Authorization", teacherToken)
      .send({
        examId: exam.id,
        courseId: course.id,
        studentId: studentId,
        score: 100,
        isAbsent: false,
      });
    scoreId = response.body.data.id;
  });

  afterAll(async () => {
    await request
      .delete("/scores/" + scoreId)
      .set("Authorization", teacherToken);
  });

  it("creates review", async () => {
    const response = await request
      .post("/reviews")
      .set("Authorization", studentToken)
      .send({
        examId: exam.id,
        courseId: course.id,
      });
    expect(response.status).toEqual(201);
    expect(response.body.data).toMatchObject({
      exam: { id: exam.id },
      course: { id: course.id },
      student: { id: studentId },
      reviewStatus: 2,
    });
  });

  it("returns 400 when data format is invalid", async () => {
    const response = await request
      .post("/reviews")
      .set("Authorization", studentToken)
      .send({
        examId: 0,
        courseId: "0",
      });
    expect(response.status).toEqual(400);
  });

  it("returns 401 when not logged in", async () => {
    const response = await request.post("/reviews").send({
      examId: exam.id,
      courseId: course.id,
    });
    expect(response.status).toEqual(401);
  });

  it("returns 403 when logged in as teacher", async () => {
    const response = await request
      .post("/reviews")
      .set("Authorization", teacherToken)
      .send({
        examId: exam.id,
        courseId: course.id,
      });
    expect(response.status).toEqual(403);
  });

  it("returns 404 when score does not exist", async () => {
    const response = await request
      .post("/reviews")
      .set("Authorization", studentToken)
      .send({
        examId: "00000000-0000-0000-0000-000000000000",
        courseId: 1,
      });
    expect(response.status).toEqual(404);
  });

  it("returns 422 when review already exists", async () => {
    const response = await request
      .post("/reviews")
      .set("Authorization", studentToken)
      .send({
        examId: exam.id,
        courseId: course.id,
      });
    expect(response.status).toEqual(422);
  });
});

describe("PATCH /reviews/:id", () => {
  let scoreId: string;

  beforeAll(async () => {
    const response = await request
      .post("/scores")
      .set("Authorization", teacherToken)
      .send({
        examId: exam.id,
        courseId: course.id + 1,
        studentId,
        score: 100,
        isAbsent: false,
      });
    scoreId = response.body.data.id;
  });

  afterAll(async () => {
    await request
      .delete("/scores/" + scoreId)
      .set("Authorization", teacherToken);
  });

  it("updates review", async () => {
    const response = await request
      .patch("/reviews/" + scoreId)
      .set("Authorization", teacherToken)
      .send({ reviewStatus: 2 });
    expect(response.status).toEqual(204);
  });

  it("returns 400 when data format is invalid", async () => {
    const response = await request
      .patch("/reviews/" + scoreId)
      .set("Authorization", teacherToken)
      .send({ reviewStatus: "2" });
    expect(response.status).toEqual(400);
  });

  it("returns 401 when not logged in", async () => {
    const response = await request
      .patch("/reviews/" + scoreId)
      .send({ reviewStatus: 2 });
    expect(response.status).toEqual(401);
  });

  it("returns 403 when logged in as student", async () => {
    const response = await request
      .patch("/reviews/" + scoreId)
      .set("Authorization", studentToken)
      .send({ reviewStatus: 2 });
    expect(response.status).toEqual(403);
  });

  it("returns 404 when review does not exist", async () => {
    const response = await request
      .patch("/reviews/00000000-0000-0000-0000-000000000000")
      .set("Authorization", teacherToken)
      .send({ reviewStatus: 2 });
    expect(response.status).toEqual(404);
  });
});

describe("DELETE /reviews/:id", () => {
  let scoreId: string;

  beforeAll(async () => {
    const response = await request
      .post("/scores")
      .set("Authorization", teacherToken)
      .send({
        examId: exam.id,
        courseId: course.id + 2,
        studentId,
        score: 100,
        isAbsent: false,
      });
    scoreId = response.body.data.id;

    await request
      .post("/reviews")
      .set("Authorization", studentToken)
      .send({
        examId: exam.id,
        courseId: course.id + 2,
      });
  });

  afterAll(async () => {
    await request
      .delete("/scores/" + scoreId)
      .set("Authorization", teacherToken);
  });

  it("deletes review", async () => {
    const response = await request
      .delete("/reviews/" + scoreId)
      .set("Authorization", studentToken);
    expect(response.status).toEqual(204);
  });

  it("returns 401 when not logged in", async () => {
    const response = await request.delete("/reviews/" + scoreId);
    expect(response.status).toEqual(401);
  });

  it("returns 403 when logged in as teacher", async () => {
    const response = await request
      .delete("/reviews/" + scoreId)
      .set("Authorization", teacherToken);
    expect(response.status).toEqual(403);
  });

  it("returns 404 when review does not exist", async () => {
    const response = await request
      .delete("/reviews/00000000-0000-0000-0000-000000000000")
      .set("Authorization", studentToken);
    expect(response.status).toEqual(404);
  });

  it("returns 422 when review is being handled", async () => {
    await request
      .patch("/reviews/" + scoreId)
      .set("Authorization", teacherToken)
      .send({
        reviewStatus: 3,
      });
    const response = await request
      .delete("/reviews/" + scoreId)
      .set("Authorization", studentToken);
    expect(response.status).toEqual(422);
  });
});
