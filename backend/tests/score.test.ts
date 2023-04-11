import { app } from "app";
import supertest from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { STUDENT_ID, student, teacher } from "./global.setup";

const request = supertest(app);

describe("GET /scores", () => {
  it("finds his own scores when logged in as student", async () => {
    const response = await request.get("/scores").set("Authorization", student);
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
          id: STUDENT_ID,
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
    const response = await request.get("/scores").set("Authorization", teacher);
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
    const examResponse = await request
      .get("/exams")
      .set("Authorization", teacher);
    if (examResponse.body.data.length === 0) {
      return;
    }
    const examId = examResponse.body.data[0].id;
    const response = await request
      .get("/scores")
      .query({ examId })
      .set("Authorization", teacher);
    for (const item of response.body.data) {
      expect(item).toMatchObject({ exam: { id: examId } });
    }
  });

  it("returns 401 when not logged in", async () => {
    const response = await request.get("/scores");
    expect(response.status).toEqual(401);
    expect(response.body.error).toBeDefined();
  });
});

describe("POST /scores", () => {
  let scoreId: string;
  let examId: string;
  let courseId: number;
  let studentId: string;
  let maxScore: number;

  afterAll(async () => {
    await request.delete("/scores/" + scoreId).set("Authorization", teacher);
  });

  it("creates score", async () => {
    const examResponse = await request
      .get("/exams")
      .set("Authorization", teacher);
    if (examResponse.body.data.length === 0) {
      return;
    }
    examId = examResponse.body.data[0].id;

    const courseResponse = await request
      .get("/courses")
      .set("Authorization", teacher);
    if (courseResponse.body.data.length === 0) {
      return;
    }
    courseId = courseResponse.body.data[0].id;
    maxScore = courseResponse.body.data[0].maxScore;

    const studentResponse = await request
      .get("/accounts")
      .query({ role: 1 })
      .set("Authorization", teacher);
    if (studentResponse.body.data.length === 0) {
      return;
    }
    studentId = studentResponse.body.data[0].id;

    const response = await request
      .post("/scores")
      .set("Authorization", teacher)
      .send({
        examId,
        courseId,
        studentId,
        score: 100,
        isAbsent: false,
      });
    expect(response.status).toEqual(201);
    expect(response.body.data).toMatchObject({
      id: expect.any(String),
      exam: { id: examId },
      course: { id: courseId },
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
      .set("Authorization", teacher)
      .send({
        examId: 0,
        courseId: "0",
        studentId: false,
        score: "100",
        isAbsent: "false",
      });
    expect(response.status).toEqual(400);
    expect(response.body.error).toBeDefined();
  });

  it("returns 401 when not logged in", async () => {
    const response = await request.post("/scores");
    expect(response.status).toEqual(401);
    expect(response.body.error).toBeDefined();
  });

  it("returns 403 when logged in as student", async () => {
    const response = await request
      .post("/scores")
      .set("Authorization", student);
    expect(response.status).toEqual(403);
    expect(response.body.error).toBeDefined();
  });

  it("returns 404 when exam id is not found", async () => {
    const response = await request
      .post("/scores")
      .set("Authorization", teacher)
      .send({
        examId: "00000000-0000-0000-0000-000000000000",
        courseId,
        studentId,
        score: 100,
        isAbsent: false,
      });
    expect(response.status).toEqual(404);
    expect(response.body.error).toBeDefined();
  });

  it("returns 404 when course id is not found", async () => {
    const response = await request
      .post("/scores")
      .set("Authorization", teacher)
      .send({
        examId,
        courseId: 100,
        studentId,
        score: 100,
        isAbsent: false,
      });
    expect(response.status).toEqual(404);
    expect(response.body.error).toBeDefined();
  });

  it("returns 404 when student id is not found", async () => {
    const response = await request
      .post("/scores")
      .set("Authorization", teacher)
      .send({
        examId,
        courseId,
        studentId: "0",
        score: 100,
        isAbsent: false,
      });
    expect(response.status).toEqual(404);
    expect(response.body.error).toBeDefined();
  });

  it("returns 409 when score already exists", async () => {
    const response = await request
      .post("/scores")
      .set("Authorization", teacher)
      .send({
        examId,
        courseId,
        studentId,
        score: 100,
        isAbsent: false,
      });
    expect(response.status).toEqual(409);
    expect(response.body.error).toBeDefined();
  });

  it("returns 422 when score exceeds max score", async () => {
    const response = await request
      .post("/scores")
      .set("Authorization", teacher)
      .send({
        examId,
        courseId: courseId + 1,
        studentId,
        score: maxScore + 1,
        isAbsent: false,
      });
    expect(response.status).toEqual(422);
    expect(response.body.error).toBeDefined();
  });
});

describe("PATCH /scores/:id", () => {
  let scoreId: string;
  let examId: string;
  let courseId: number;
  let studentId: string;
  let maxScore: number;

  beforeAll(async () => {
    const examResponse = await request
      .get("/exams")
      .set("Authorization", teacher);
    if (examResponse.body.data.length === 0) {
      return;
    }
    examId = examResponse.body.data[0].id;

    const courseResponse = await request
      .get("/courses")
      .set("Authorization", teacher);
    if (courseResponse.body.data.length === 0) {
      return;
    }
    courseId = courseResponse.body.data[0].id;
    maxScore = courseResponse.body.data[0].maxScore;

    const studentResponse = await request
      .get("/accounts")
      .query({ role: 1 })
      .set("Authorization", teacher);
    if (studentResponse.body.data.length === 0) {
      return;
    }
    studentId = studentResponse.body.data[0].id;

    const response = await request
      .post("/scores")
      .set("Authorization", teacher)
      .send({
        examId,
        courseId,
        studentId,
        score: 100,
        isAbsent: false,
      });
    scoreId = response.body.data.id;
  });

  afterAll(async () => {
    await request.delete("/scores/" + scoreId).set("Authorization", teacher);
  });

  it("updates score", async () => {
    const response = await request
      .patch("/scores/" + scoreId)
      .set("Authorization", teacher)
      .send({
        examId,
        courseId,
        studentId,
        score: 90,
        isAbsent: false,
      });
    expect(response.status).toEqual(204);
  });

  it("returns 400 when data format is invalid", async () => {
    const response = await request
      .patch("/scores/" + scoreId)
      .set("Authorization", teacher)
      .send({
        examId: 0,
        courseId: "0",
        studentId: false,
        score: "100",
        isAbsent: "false",
      });

    expect(response.status).toEqual(400);
    expect(response.body.error).toBeDefined();
  });

  it("returns 401 when not logged in", async () => {
    const response = await request.patch("/scores/" + scoreId);
    expect(response.status).toEqual(401);
    expect(response.body.error).toBeDefined();
  });

  it("returns 403 when logged in as student", async () => {
    const response = await request
      .patch("/scores/" + scoreId)
      .set("Authorization", student);
    expect(response.status).toEqual(403);
    expect(response.body.error).toBeDefined();
  });

  it("returns 404 when score id is not found", async () => {
    const response = await request
      .patch("/scores/00000000-0000-0000-0000-000000000000")
      .set("Authorization", teacher)
      .send({
        examId,
        courseId,
        studentId,
        score: 100,
        isAbsent: false,
      });
    expect(response.status).toEqual(404);
    expect(response.body.error).toBeDefined();
  });

  it("returns 422 when score exceeds max score", async () => {
    const response = await request
      .patch("/scores/" + scoreId)
      .set("Authorization", teacher)
      .send({
        examId,
        courseId,
        studentId,
        score: maxScore + 1,
        isAbsent: false,
      });
    expect(response.status).toEqual(422);
    expect(response.body.error).toBeDefined();
  });
});

describe("DELETE /scores/:id", () => {
  let scoreId: string;
  let examId: string;
  let courseId: number;
  let studentId: string;

  beforeAll(async () => {
    const examResponse = await request
      .get("/exams")
      .set("Authorization", teacher);
    if (examResponse.body.data.length === 0) {
      return;
    }
    examId = examResponse.body.data[0].id;

    const courseResponse = await request
      .get("/courses")
      .set("Authorization", teacher);
    if (courseResponse.body.data.length === 0) {
      return;
    }
    courseId = courseResponse.body.data[0].id;

    const studentResponse = await request
      .get("/accounts")
      .query({ role: 1 })
      .set("Authorization", teacher);
    if (studentResponse.body.data.length === 0) {
      return;
    }
    studentId = studentResponse.body.data[0].id;

    const response = await request
      .post("/scores")
      .set("Authorization", teacher)
      .send({
        examId,
        courseId,
        studentId,
        score: 100,
        isAbsent: false,
      });
    scoreId = response.body.data.id;
  });

  it("deletes score", async () => {
    const response = await request
      .delete("/scores/" + scoreId)
      .set("Authorization", teacher);
    expect(response.status).toEqual(204);
  });

  it("returns 401 when not logged in", async () => {
    const response = await request.delete("/scores/" + scoreId);
    expect(response.status).toEqual(401);
    expect(response.body.error).toBeDefined();
  });

  it("returns 403 when logged in as student", async () => {
    const response = await request
      .delete("/scores/" + scoreId)
      .set("Authorization", student);
    expect(response.status).toEqual(403);
    expect(response.body.error).toBeDefined();
  });

  it("returns 404 when score id is not found", async () => {
    const response = await request
      .delete("/scores/00000000-0000-0000-0000-000000000000")
      .set("Authorization", teacher);
    expect(response.status).toEqual(404);
    expect(response.body.error).toBeDefined();
  });
});
