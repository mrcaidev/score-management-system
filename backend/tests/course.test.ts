import { app } from "app";
import supertest from "supertest";
import { describe, expect, it } from "vitest";

const request = supertest(app);

describe("GET /courses", () => {
  it("finds all courses", async () => {
    const response = await request.get("/courses");
    expect(response.status).toEqual(200);
    for (const item of response.body.data) {
      expect(item).toMatchObject({
        id: expect.any(Number),
        name: expect.any(String),
        maxScore: expect.any(Number),
      });
    }
  });
});
