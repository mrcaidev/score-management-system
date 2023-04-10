import { app } from "app";
import supertest from "supertest";
import { describe, expect, it } from "vitest";

const request = supertest(app);

describe("GET /healthz", () => {
  it("returns 200", async () => {
    const response = await request.get("/healthz");
    expect(response.status).toEqual(200);
  });
});
