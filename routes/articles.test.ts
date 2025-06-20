import Koa from "koa";
import json from "koa-json";
import passport from "koa-passport";
import { router } from "../routes/articles";
import request from "supertest";
const app: Koa = new Koa();
app.use(json());
app.use(passport.initialize());
app.use(router.middleware());
app.listen(3000);

describe("a simple api endpoint", () => {
  test("Get all article", async () => {
    const result = await request(app.callback()).get("/api/v1/articles");
    expect(result.statusCode).toEqual(200);
  });
  test("Post an article", async () => {
    const result = await request(app.callback())
      .post("/api/v1/articles")
      .set("Authorization", "Basic Y2FuZHk6MTIzNDU2")
      .send({
        title: "123421321",
        alltext: "213",
        summary: "214213",
        description: "213213",
        imageurl:
          "http://localhost:10888/api/v1/images/512f982a-5bdb-43de-9808-8d1ca1e58852",
        authorid: 24,
        published: false,
      });
    expect(result.statusCode).toEqual(201);
  });
});
