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

describe("/api/articles Endpoint", () => {
  describe("GET Requests /api/articles", () => {
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
      test("200 Responds with articles default sorted by created_at in descending order", () => {
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
      test("404: Responds with 'Article does not exist' when article_id is a valid data type but unknwon route", () => {
        return request(app)
          .get("/api/articles/9999/comments")
          .expect(404)
          .then(({ body }) => {
            expect(body.message).toBe("Article does not exist");
          });
      });
    });
    describe("GET /api/articles?sort_by queries", () => {
      test("200: Responds with articles sorted by valid column in default descending order", () => {
        return request(app)
          .get("/api/articles?sort_by=topic")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).toBeSortedBy("topic", { descending: true });
          });
      });
      test("200: Responds with articles sorted by valid column in ascending order", () => {
        return request(app)
          .get("/api/articles?sort_by=author&order=asc")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).toBeSortedBy("author", { descending: false });
          });
      });
      test("400: Responds with status and message for invalid sort parameter", () => {
        return request(app)
          .get("/api/articles?sort_by=sneaky-sql")
          .expect(400)
          .then(({ body: { message } }) => {
            expect(message).toBe("Invalid category request");
          });
      });
      test("200: Prevents invalid category SQL injection by assigning default sort_by and order 'descending' in controller", () => {
        return request(app)
          .get("/api/articles?sneakysql=asc")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).toBeSortedBy("created_at", { descending: true });
          });
      });
    });
    describe("GET /api/articles?topic= queries", () => {
      test("200: Responds with status and articles filtered by specified topic", () => {
        return request(app)
          .get("/api/articles?topic=cats")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(Array.isArray(articles)).toBe(true);
            expect(articles).toHaveLength(1);
            expect(articles[0]).toMatchObject({
              article_id: expect.any(Number),
              title: "UNCOVERED: catspiracy to bring down democracy",
              topic: "cats",
              author: "rogersop",
              created_at: expect.any(String),
              article_img_url:
                "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
            });
          });
      });
      test("404: Responds with status and `Topic does not exist` for non-existent topic", () => {
        return request(app)
          .get("/api/articles?topic=notpets")
          .expect(404)
          .then(({ body: { message } }) => {
            expect(message).toBe("Topic does not exist");
          });
      });
      test("400: Responds with status and 'Invalid topic format' for incorrect topic format", () => {
        return request(app)
          .get("/api/articles?topic=5678")
          .expect(400)
          .then(({ body: { message } }) => {
            expect(message).toBe("Invalid topic format");
          });
      });
    });
  });
  describe("POST Requests /api/articles/:article_id/comments", () => {
    test("201 Posts new comment with article_id matching :article_id and responds with posted comment", () => {
      return request(app)
        .post("/api/articles/1/comments")
        .send({ username: "lurker", body: "A new comment!" })
        .expect(201)
        .then(({ body: { comment } }) => {
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            body: expect.any(String),
            votes: expect.any(Number),
            author: "lurker",
            article_id: 1,
            created_at: expect.any(String),
          });
        });
    });
    test("400 Responds with 'Required fields are missing' message for empty request body", () => {
      return request(app)
        .post("/api/articles/1/comments")
        .send({})
        .expect(400)
        .then(({ body: { message } }) => {
          expect(message).toBe("Required fields are missing");
        });
    });
    test("400 Responds with 'Request did not contain comment' message for empty comment", () => {
      return request(app)
        .post("/api/articles/1/comments")
        .send({ username: "lurker", comment: "" })
        .expect(400)
        .then(({ body: { message } }) => {
          expect(message).toBe("Request did not contain comment");
        });
    });
    test("404 Responds with 'User not found' message for unknown username", () => {
      return request(app)
        .post("/api/articles/1/comments")
        .send({
          username: "non_existent_user",
          body: "hasn't found his place in the world",
        })
        .expect(404)
        .then(({ body: { message } }) => {
          expect(message).toBe("User not found");
        });
    });
    test("404 Responds with status and 'Article does not exist' message for a non-existent article_id", () => {
      return request(app)
        .post("/api/articles/8888/comments")
        .send({ username: "lurker", body: "doesn't know where he's going" })
        .expect(404)
        .then(({ body: { message } }) => {
          expect(message).toBe("Article does not exist");
        });
    });
  });
  describe("PATCH Requests /api/articles/:article_id", () => {
    test("200 Positively increments votes for article matching article_id and responds with updated article", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: 10 })
        .expect(200)
        .then(({ body: { article } }) => {
          expect(article).toMatchObject({
            article_id: 1,
            title: "Living in the shadow of a great man",
            topic: "mitch",
            author: "butter_bridge",
            created_at: expect.any(String),
            votes: 110,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          });
        });
    });
    test("200 Negatively increments votes for article matching article_id and responds with updated article", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: -10 })
        .expect(200)
        .then(({ body: { article } }) => {
          expect(article).toMatchObject({
            article_id: 1,
            title: "Living in the shadow of a great man",
            topic: "mitch",
            author: "butter_bridge",
            created_at: expect.any(String),
            votes: 90,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          });
        });
    });
    test("400 Responds with 'Invalid request type' for non-numeric vote request", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: "SQL-attempt" })
        .expect(400)
        .then(({ body: { message } }) => {
          expect(message).toBe("Invalid request type");
        });
    });
    test("404 Responds with 'Article does not exist' for numeric but non-existing article_id", () => {
      return request(app)
        .patch("/api/articles/99999")
        .send({ inc_votes: 10 })
        .expect(404)
        .then(({ body: { message } }) => {
          expect(message).toBe("Article does not exist");
        });
    });
  });
});
