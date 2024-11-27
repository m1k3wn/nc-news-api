const request = require("supertest");
const sorted = require("jest-sorted");
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

describe("Endpoint /api/articles", () => {
  describe("GET /api/articles", () => {
    test("200 Responds with an array of all article objects correctly formatted", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).toHaveLength(13);
          articles.forEach((article) => {
            expect(article).toMatchObject({
              article_id: expect.any(Number),
              title: expect.any(String),
              topic: expect.any(String),
              author: expect.any(String),
              created_at: expect.any(String),
              article_img_url: expect.any(String),
            });
          });
        });
    });
    test("200 Responds with articles sorted by date in descending order", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).toBeSortedBy("created_at", {
            descending: true,
          });
        });
    });
    test("200 Responds without body property on returned article objects", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body: { articles } }) => {
          articles.forEach((article) => {
            expect(article).not.toHaveProperty("body");
          });
        });
    });
  });
  describe("GET /api/articles/:article_id", () => {
    test("200: Responds with formatted article for a correct article_id", () => {
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then(({ body: { article } }) => {
          expect(article).toMatchObject({
            article_id: expect.any(Number),
            title: expect.any(String),
            topic: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            created_at: expect.any(String),
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
  describe("GET /api/articles/:article_id/comments", () => {
    test("200: Responds with an array of comments for the given article_id", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then(({ body }) => {
          const { comments } = body;
          expect(Array.isArray(comments)).toBe(true);
          expect(comments.length).toBeGreaterThan(0);
          comments.forEach((comment) => {
            expect(comment).toEqual(
              expect.objectContaining({
                comment_id: expect.any(Number),
                votes: expect.any(Number),
                created_at: expect.any(String),
                author: expect.any(String),
                body: expect.any(String),
                article_id: 1,
              })
            );
          });
        });
    });
    test("200: Responds with an empty array and message when article exists but has no comments", () => {
      return request(app)
        .get("/api/articles/4/comments")
        .expect(200)
        .then(({ body }) => {
          const { comments } = body;
          expect(Array.isArray(comments)).toBe(true);
          expect(comments).toHaveLength(0);
          expect(body.message).toBe("No comments found for this article");
        });
    });
    test("400: Responds with 'Invalid request type' for non-numeric article_id", () => {
      return request(app)
        .get("/api/articles/not-a-number/comments")
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toBe("Invalid request type");
        });
    });
    test("404: Responds with 'Article does not exist' when article_id is a valid request but does not exist", () => {
      return request(app)
        .get("/api/articles/9999/comments")
        .expect(404)
        .then(({ body }) => {
          expect(body.message).toBe("Article does not exist");
        });
    });
  });
});
