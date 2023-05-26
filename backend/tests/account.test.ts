import { app } from "app";
import supertest from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { studentCookie, teacherCookie } from "./setup";

const request = supertest(app);

describe("GET /accounts", () => {
  it("finds all accounts", async () => {
    const response = await request
      .get("/accounts")
      .set("Cookie", teacherCookie);
    expect(response.status).toEqual(200);
    for (const item of response.body.data) {
      expect(item).toMatchObject({
        id: expect.any(String),
        name: expect.any(String),
        role: expect.any(Number),
      });
    }
  });

  it("finds all accounts with specific role", async () => {
    const response = await request
      .get("/accounts")
      .query({ role: 1 })
      .set("Cookie", teacherCookie);
    expect(response.status).toEqual(200);
    for (const item of response.body.data) {
      expect(item).toMatchObject({
        id: expect.any(String),
        name: expect.any(String),
        role: 1,
      });
    }
  });

  it("returns 401 when not logged in", async () => {
    const response = await request.get("/accounts");
    expect(response.status).toEqual(401);
  });

  it("returns 403 when logged in as student", async () => {
    const response = await request
      .get("/accounts")
      .set("Cookie", studentCookie);
    expect(response.status).toEqual(403);
  });
});

describe("POST /accounts", () => {
  afterAll(async () => {
    await request.delete("/accounts/1").set("Cookie", teacherCookie);
  });

  it("creates account", async () => {
    const response = await request
      .post("/accounts")
      .set("Cookie", teacherCookie)
      .send({ id: "1", name: "1" });
    expect(response.status).toEqual(201);
    expect(response.body.data).toMatchObject({
      id: "1",
      name: "1",
      role: 1,
    });
  });

  it("returns 400 when data format is invalid", async () => {
    const response = await request
      .post("/accounts")
      .set("Cookie", teacherCookie)
      .send({ id: 1, name: false });
    expect(response.status).toEqual(400);
  });

  it("returns 401 when not logged in", async () => {
    const response = await request
      .post("/accounts")
      .send({ id: "1", name: "1" });
    expect(response.status).toEqual(401);
  });

  it("returns 403 when logged in as student", async () => {
    const response = await request
      .post("/accounts")
      .set("Cookie", studentCookie)
      .send({ id: "1", name: "1" });
    expect(response.status).toEqual(403);
  });

  it("returns 409 when id already exists", async () => {
    const response = await request
      .post("/accounts")
      .set("Cookie", teacherCookie)
      .send({ id: "1", name: "1" });
    expect(response.status).toEqual(409);
  });
});

describe("PATCH /accounts/:id", () => {
  beforeAll(async () => {
    await request.post("/accounts").set("Cookie", teacherCookie).send({
      id: "2",
      name: "2",
    });
  });

  afterAll(async () => {
    await request.delete("/accounts/2").set("Cookie", teacherCookie);
  });

  it("updates account", async () => {
    const response = await request
      .patch("/accounts/2")
      .set("Cookie", teacherCookie)
      .send({ name: "22" });
    expect(response.status).toEqual(204);
  });

  it("returns 400 when data format is invalid", async () => {
    const response = await request
      .patch("/accounts/2")
      .set("Cookie", teacherCookie)
      .send({ name: 0 });
    expect(response.status).toEqual(400);
  });

  it("returns 401 when not logged in", async () => {
    const response = await request.patch("/accounts/2").send({ name: "22" });
    expect(response.status).toEqual(401);
  });

  it("returns 403 when logged in as student", async () => {
    const response = await request
      .patch("/accounts/2")
      .set("Cookie", studentCookie)
      .send({ name: "22" });
    expect(response.status).toEqual(403);
  });

  it("returns 404 when id does not exist", async () => {
    const response = await request
      .patch("/accounts/0")
      .set("Cookie", teacherCookie)
      .send({ name: "22" });
    expect(response.status).toEqual(404);
  });
});

describe("DELETE /accounts/:id", () => {
  beforeAll(async () => {
    await request.post("/accounts").set("Cookie", teacherCookie).send({
      id: "3",
      name: "3",
    });
  });

  it("deletes account", async () => {
    const response = await request
      .delete("/accounts/3")
      .set("Cookie", teacherCookie);
    expect(response.status).toEqual(204);
  });

  it("returns 401 when not logged in", async () => {
    const response = await request.delete("/accounts/3");
    expect(response.status).toEqual(401);
  });

  it("returns 403 when logged in as student", async () => {
    const response = await request
      .delete("/accounts/3")
      .set("Cookie", studentCookie);
    expect(response.status).toEqual(403);
  });

  it("returns 404 when id does not exist", async () => {
    const response = await request
      .delete("/accounts/0")
      .set("Cookie", teacherCookie);
    expect(response.status).toEqual(404);
  });
});
