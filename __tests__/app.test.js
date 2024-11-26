const endpointsJson = require("../endpoints.json");
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

describe("/api general request errors", () => {
  test("500: Responds to internal server error", () => {
    return request(app)
      .get("/error-route")
      .expect(500)
      .then(({ body: { message } }) => {
        expect(message).toBe("Internal Server Error");
      });
  });
  test("404: Responds to non-existent endpoint", () => {
    return request(app)
      .get("/api/wrongpath")
      .expect(404)
      .then(({ body: { message } }) => {
        expect(message).toBe("Endpoint not found");
      });
  });
});

describe("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
  test("200: Responds with formatted GET /api documentation", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints["GET /api"]).toEqual(
          expect.objectContaining({
            description: expect.any(String),
          })
        );
      });
  });
  test("200: Responds with formatted documentation for further endpoints", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        Object.keys(endpoints).forEach((endpoint) => {
          if (endpoint !== "GET /api") {
            expect(endpoints[endpoint]).toEqual(
              expect.objectContaining({
                description: expect.any(String),
                exampleResponse: expect.any(Object),
              })
            );
          }
        });
      });
  });
});
