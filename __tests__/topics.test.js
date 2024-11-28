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

describe("/api/topics Endpoint", () => {
  describe("GET /api/topics", () => {
    test("200: Should respond with an array of all topics correctly formatted", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body: { topics } }) => {
          expect(topics).toHaveLength(3);
          topics.forEach((topic) => {
            expect(topic).toHaveProperty("description");
            expect(topic).toHaveProperty("slug");
            expect(typeof topic.description && typeof topic.slug).toBe(
              "string"
            );
          });
        });
    });
    test("404: Should repond with status and message for non-existent endpoint", () => {
      return request(app)
        .get("/api/topics/wrongpath")
        .expect(404)
        .then(({ body: { message } }) => {
          expect(message).toBe("Endpoint not found");
        });
    });
  });
});
