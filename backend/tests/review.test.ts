import { app } from "app";
import supertest from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { exam, studentCookie, studentId, teacherCookie } from "./setup";

const request = supertest(app);

describe("GET /reviews", () => {
  it("finds his own reviews when logged in as student", async () => {
    const response = await request.get("/reviews").set("Cookie", studentCookie);
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
    const response = await request.get("/reviews").set("Cookie", teacherCookie);
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
      .set("Cookie", teacherCookie)
      .send({
        examId: exam.id,
        courseId: 4,
        studentId: studentId,
        score: 100,
        isAbsent: false,
      });
    scoreId = response.body.data.id;
  });

  afterAll(async () => {
    await request.delete("/scores/" + scoreId).set("Cookie", teacherCookie);
  });

  it("creates review", async () => {
    const response = await request
      .post("/reviews")
      .set("Cookie", studentCookie)
      .send({ examId: exam.id, courseId: 4 });
    expect(response.status).toEqual(201);
    expect(response.body.data).toMatchObject({
      exam: { id: exam.id },
      course: { id: 4 },
      student: { id: studentId },
      reviewStatus: 2,
    });
  });

  it("returns 400 when data format is invalid", async () => {
    const response = await request
      .post("/reviews")
      .set("Cookie", studentCookie)
      .send({ examId: 0, courseId: "4" });
    expect(response.status).toEqual(400);
  });

  it("returns 401 when not logged in", async () => {
    const response = await request
      .post("/reviews")
      .send({ examId: exam.id, courseId: 4 });
    expect(response.status).toEqual(401);
  });

  it("returns 403 when logged in as teacher", async () => {
    const response = await request
      .post("/reviews")
      .set("Cookie", teacherCookie)
      .send({ examId: exam.id, courseId: 4 });
    expect(response.status).toEqual(403);
  });

  it("returns 404 when score does not exist", async () => {
    const response = await request
      .post("/reviews")
      .set("Cookie", studentCookie)
      .send({ examId: "00000000-0000-0000-0000-000000000000", courseId: 4 });
    expect(response.status).toEqual(404);
  });

  it("returns 422 when review already exists", async () => {
    const response = await request
      .post("/reviews")
      .set("Cookie", studentCookie)
      .send({ examId: exam.id, courseId: 4 });
    expect(response.status).toEqual(422);
  });
});

describe("PATCH /reviews/:id", () => {
  let scoreId: string;

  beforeAll(async () => {
    const response = await request
      .post("/scores")
      .set("Cookie", teacherCookie)
      .send({
        examId: exam.id,
        courseId: 5,
        studentId,
        score: 100,
        isAbsent: false,
      });

    scoreId = response.body.data.id;

    await request.post("/reviews").set("Cookie", studentCookie).send({
      examId: exam.id,
      courseId: 5,
    });
  });

  afterAll(async () => {
    await request.delete("/scores/" + scoreId).set("Cookie", teacherCookie);
  });

  it("updates review", async () => {
    const response = await request
      .patch("/reviews/" + scoreId)
      .set("Cookie", teacherCookie)
      .send({ reviewStatus: 3 });
    expect(response.status).toEqual(204);
  });

  it("returns 400 when data format is invalid", async () => {
    const response = await request
      .patch("/reviews/" + scoreId)
      .set("Cookie", teacherCookie)
      .send({ reviewStatus: "3" });
    expect(response.status).toEqual(400);
  });

  it("returns 401 when not logged in", async () => {
    const response = await request
      .patch("/reviews/" + scoreId)
      .send({ reviewStatus: 3 });
    expect(response.status).toEqual(401);
  });

  it("returns 403 when logged in as student", async () => {
    const response = await request
      .patch("/reviews/" + scoreId)
      .set("Cookie", studentCookie)
      .send({ reviewStatus: 3 });
    expect(response.status).toEqual(403);
  });

  it("returns 404 when review does not exist", async () => {
    const response = await request
      .patch("/reviews/00000000-0000-0000-0000-000000000000")
      .set("Cookie", teacherCookie)
      .send({ reviewStatus: 3 });
    expect(response.status).toEqual(404);
  });
});

describe("DELETE /reviews/:id", () => {
  let scoreId: string;

  beforeAll(async () => {
    const response = await request
      .post("/scores")
      .set("Cookie", teacherCookie)
      .send({
        examId: exam.id,
        courseId: 6,
        studentId,
        score: 100,
        isAbsent: false,
      });

    scoreId = response.body.data.id;

    await request.post("/reviews").set("Cookie", studentCookie).send({
      examId: exam.id,
      courseId: 6,
    });
  });

  afterAll(async () => {
    await request.delete("/scores/" + scoreId).set("Cookie", teacherCookie);
  });

  it("deletes review", async () => {
    const response = await request
      .delete("/reviews/" + scoreId)
      .set("Cookie", studentCookie);
    expect(response.status).toEqual(204);
  });

  it("returns 401 when not logged in", async () => {
    const response = await request.delete("/reviews/" + scoreId);
    expect(response.status).toEqual(401);
  });

  it("returns 403 when logged in as teacher", async () => {
    const response = await request
      .delete("/reviews/" + scoreId)
      .set("Cookie", teacherCookie);
    expect(response.status).toEqual(403);
  });

  it("returns 404 when review does not exist", async () => {
    const response = await request
      .delete("/reviews/00000000-0000-0000-0000-000000000000")
      .set("Cookie", studentCookie);
    expect(response.status).toEqual(404);
  });

  it("returns 422 when review is not pending", async () => {
    await request
      .patch("/reviews/" + scoreId)
      .set("Cookie", teacherCookie)
      .send({ reviewStatus: 3 });
    const response = await request
      .delete("/reviews/" + scoreId)
      .set("Cookie", studentCookie);
    expect(response.status).toEqual(422);
  });
});
