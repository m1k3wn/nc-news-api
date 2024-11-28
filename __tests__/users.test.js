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

describe("/api/users Endpoint", () => {
  describe("GET Requests /api/users", () => {
    test("200: Responds with array of user objects correctly formatted", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then(({ body: { users } }) => {
          expect(users).toHaveLength(4);
          users.forEach((user) => {
            expect(user).toMatchObject({
              username: expect.any(String),
              name: expect.any(String),
              avatar_url: expect.any(String),
            });
          });
        });
    });
    test("404: Responds with status and message for non-existent endpoint", () => {
      return request(app)
        .get("/api/users/wrongpath")
        .expect(404)
        .then(({ body: { message } }) => {
          expect(message).toBe("Endpoint not found");
        });
    });
  });
});
