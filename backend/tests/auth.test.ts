import { app } from "app";
import supertest from "supertest";
import { describe, expect, it } from "vitest";
import { studentCookie, studentId } from "./setup";

const request = supertest(app);

describe("GET /auth", () => {
  it("returns the requestor's account", async () => {
    const response = await request.get("/auth").set("Cookie", studentCookie);
    expect(response.status).toEqual(200);
    expect(response.body.data).toMatchObject({
      id: studentId,
      name: expect.any(String),
      role: expect.any(Number),
    });
  });

  it("returns 401 when not logged in", async () => {
    const response = await request.get("/auth");
    expect(response.status).toEqual(401);
  });

  it("returns 401 when token is invalid", async () => {
    const response = await request.get("/auth").set("Cookie", "token=invalid");
    expect(response.status).toEqual(401);
  });
});

describe("POST /auth/login", () => {
  it("sets cookie", async () => {
    const response = await request.post("/auth/login").send({
      id: studentId,
      password: studentId,
    });
    expect(response.status).toEqual(204);
  });

  it("returns 400 when data format is invalid", async () => {
    const response = await request.post("/auth/login").send({
      id: 0,
      password: false,
    });
    expect(response.status).toEqual(400);
  });

  it("returns 401 when credentials are invalid", async () => {
    const response = await request.post("/auth/login").send({
      id: studentId,
      password: "invalid",
    });
    expect(response.status).toEqual(401);
  });
});
