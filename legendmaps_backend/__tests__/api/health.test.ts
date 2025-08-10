import request from "supertest";
import { createApp } from "../../src/app";

describe("API smoke", () => {
  const app = createApp();

  test("mounts /api and responds 404 on unknown routes", async () => {
    const res = await request(app).get("/api/unknown").expect(404);
    expect(res.status).toBe(404);
  });
});