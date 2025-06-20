import Koa from "koa";
import json from "koa-json";
import passport from "koa-passport";
import { router } from "../routes/hotel";
import request from "supertest";
const app: Koa = new Koa();
app.use(json());
app.use(passport.initialize());
app.use(router.middleware());
app.listen(3001);

describe("a simple api endpoint", () => {
  test("POST to hotel endpoint should return 401", async () => {
    const result = await request(app.callback()).post("/api/v1/hotel");
    expect(result.statusCode).toEqual(401);
  });
  test("POST to hotel endpoint should return 200", async () => {
    const result = await request(app.callback())
      .post("/api/v1/hotel")
      .set("Authorization", "Basic Y2FuZHk6MTIzNDU2");
    expect(result.statusCode).toEqual(200);
  });
});
