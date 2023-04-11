import { app } from "app";
import supertest from "supertest";
import { describe, expect, it } from "vitest";
import { STUDENT_ID, student } from "./global.setup";

const request = supertest(app);

describe("GET /auth", () => {
  it("returns account", async () => {
    const response = await request.get("/auth").set("Authorization", student);
    expect(response.status).toEqual(200);
    expect(response.body.data).toMatchObject({
      id: STUDENT_ID,
      name: expect.any(String),
      role: expect.any(Number),
    });
  });

  it("returns 401 when not logged in", async () => {
    const response = await request.get("/auth");
    expect(response.status).toEqual(401);
    expect(response.body.error).toBeDefined();
  });

  it("returns 401 when token is invalid", async () => {
    const response = await request
      .get("/auth")
      .set("Authorization", "Bearer invalid");
    expect(response.status).toEqual(401);
    expect(response.body.error).toBeDefined();
  });
});

describe("POST /auth/login", () => {
  it("returns token", async () => {
    const response = await request.post("/auth/login").send({
      id: STUDENT_ID,
      password: STUDENT_ID,
    });
    expect(response.status).toEqual(200);
    expect(response.body.data).toMatch(/^[\w-]+\.[\w-]+\.[\w-]+$/);
  });

  it("returns 400 when data format is invalid", async () => {
    const response = await request.post("/auth/login").send({
      id: 0,
      password: false,
    });
    expect(response.status).toEqual(400);
    expect(response.body.error).toBeDefined();
  });

  it("returns 401 when credentials are invalid", async () => {
    const response = await request.post("/auth/login").send({
      id: STUDENT_ID,
      password: "invalid",
    });
    expect(response.status).toEqual(401);
    expect(response.body.error).toBeDefined();
  });
});
