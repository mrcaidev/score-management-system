import { app } from "app";
import supertest from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { student, teacher } from "./global.setup";

const request = supertest(app);

describe("GET /accounts", () => {
  it("finds all accounts", async () => {
    const response = await request
      .get("/accounts")
      .set("Authorization", teacher);
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
      .get("/accounts?role=1")
      .set("Authorization", teacher);
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
    expect(response.body.error).toBeDefined();
  });

  it("returns 403 when logged in as student", async () => {
    const response = await request
      .get("/accounts")
      .set("Authorization", student);
    expect(response.status).toEqual(403);
    expect(response.body.error).toBeDefined();
  });
});

describe("POST /accounts", () => {
  afterAll(async () => {
    await request.delete("/accounts/1").set("Authorization", teacher);
  });

  it("creates account", async () => {
    const response = await request
      .post("/accounts")
      .set("Authorization", teacher)
      .send({ id: "1", name: "test" });
    expect(response.status).toEqual(201);
    expect(response.body.data).toMatchObject({
      id: "1",
      name: "test",
      role: 1,
    });
  });

  it("returns 400 when data format is invalid", async () => {
    const response = await request
      .post("/accounts")
      .set("Authorization", teacher)
      .send({ id: 1, name: false });
    expect(response.status).toEqual(400);
    expect(response.body.error).toBeDefined();
  });

  it("returns 401 when not logged in", async () => {
    const response = await request
      .post("/accounts")
      .send({ id: "1", name: "test" });
    expect(response.status).toEqual(401);
    expect(response.body.error).toBeDefined();
  });

  it("returns 403 when logged in as student", async () => {
    const response = await request
      .post("/accounts")
      .set("Authorization", student)
      .send({ id: "1", name: "test" });
    expect(response.status).toEqual(403);
    expect(response.body.error).toBeDefined();
  });

  it("returns 409 when id already exists", async () => {
    const response = await request
      .post("/accounts")
      .set("Authorization", teacher)
      .send({ id: "1", name: "test" });
    expect(response.status).toEqual(409);
    expect(response.body.error).toBeDefined();
  });
});

describe("PATCH /accounts/:id", () => {
  beforeAll(async () => {
    await request.post("/accounts").set("Authorization", teacher).send({
      id: "1",
      name: "test",
    });
  });

  afterAll(async () => {
    await request.delete("/accounts/1").set("Authorization", teacher);
  });

  it("updates account", async () => {
    const response = await request
      .patch("/accounts/1")
      .set("Authorization", teacher)
      .send({ name: "update" });
    expect(response.status).toEqual(204);
  });

  it("returns 400 when data format is invalid", async () => {
    const response = await request
      .patch("/accounts/1")
      .set("Authorization", teacher)
      .send({ name: 0 });
    expect(response.status).toEqual(400);
    expect(response.body.error).toBeDefined();
  });

  it("returns 401 when not logged in", async () => {
    const response = await request
      .patch("/accounts/1")
      .send({ name: "update" });
    expect(response.status).toEqual(401);
    expect(response.body.error).toBeDefined();
  });

  it("returns 403 when logged in as student", async () => {
    const response = await request
      .patch("/accounts/1")
      .set("Authorization", student)
      .send({ name: "update" });
    expect(response.status).toEqual(403);
    expect(response.body.error).toBeDefined();
  });

  it("returns 404 when id does not exist", async () => {
    const response = await request
      .patch("/accounts/0")
      .set("Authorization", teacher)
      .send({ name: "update" });
    expect(response.status).toEqual(404);
    expect(response.body.error).toBeDefined();
  });
});

describe("DELETE /accounts/:id", () => {
  beforeAll(async () => {
    await request.post("/accounts").set("Authorization", teacher).send({
      id: "1",
      name: "test",
    });
  });

  it("deletes account", async () => {
    const response = await request
      .delete("/accounts/1")
      .set("Authorization", teacher);
    expect(response.status).toEqual(204);
  });

  it("returns 401 when not logged in", async () => {
    const response = await request.delete("/accounts/1");
    expect(response.status).toEqual(401);
    expect(response.body.error).toBeDefined();
  });

  it("returns 403 when logged in as student", async () => {
    const response = await request
      .delete("/accounts/1")
      .set("Authorization", student);
    expect(response.status).toEqual(403);
    expect(response.body.error).toBeDefined();
  });

  it("returns 404 when id does not exist", async () => {
    const response = await request
      .delete("/accounts/0")
      .set("Authorization", teacher);
    expect(response.status).toEqual(404);
    expect(response.body.error).toBeDefined();
  });
});
