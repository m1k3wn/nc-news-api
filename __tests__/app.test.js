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

describe("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
  test("200: Responds with correctly formatted GET /api documentation", () => {
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
  test("200: Responds with correctly formatted documentation for further endpoints", () => {
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
