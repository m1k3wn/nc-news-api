const request = require("supertest");
const db = require("../db/connection");
const app = require("../API/app");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  return db.end();
});

describe("GET /api/articles", () => {
  describe("GET /api/articles/:article_id", () => {
    test("200: Responds with formatted article for a correct article_id", () => {
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then(({ body: { article } }) => {
          expect.objectContaining({
            article_id: expect.any(String),
            title: expect.any(String),
            topic: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            created_at: expect.any(Number),
            article_img_url: expect.any(String),
          });
        });
    });
    test("404: Responds with status and error message for a valid but non-existent article_id", () => {
      return request(app)
        .get("/api/articles/99999")
        .expect(404)
        .then(({ body: { message } }) => {
          expect(message).toBe("Article does not exist");
        });
    });
    test("400: Responds with status and error message for invalid article_id", () => {
      return request(app)
        .get("/api/articles/invalidEndpoint")
        .expect(400)
        .then(({ body: { message } }) => {
          expect(message).toBe("Invalid request type");
        });
    });
  });
});
