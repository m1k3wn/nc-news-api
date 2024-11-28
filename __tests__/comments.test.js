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

describe("/api/comments Endpoint", () => {
  describe("DELETE Requests /api/comments/:comment_id", () => {
    test("204: Deletes given comment by comment_id", () => {
      return request(app)
        .delete("/api/comments/1")
        .expect(204)
        .then((response) => {
          expect(response.body).toEqual({});
        })
        .then(() => {
          return db.query(`SELECT * FROM comments WHERE comment_id=1;`);
        })
        .then(({ rows }) => {
          expect(rows.length).toBe(0);
        });
    });
    test("404: Responds with status and message for non-existent comment_id", () => {
      return request(app)
        .delete("/api/comments/9999")
        .expect(404)
        .then(({ body: { message } }) => {
          expect(message).toBe("Comment not found");
        });
    });
    test("400: Responds with status and message for invalid comment_id", () => {
      return request(app)
        .delete("/api/comments/sql-attempt")
        .expect(400)
        .then(({ body: { message } }) => {
          expect(message).toBe("Invalid comment id");
        });
    });
  });
});
