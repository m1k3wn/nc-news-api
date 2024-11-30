const {
  /* Api Utility Functions */
  validateTopics,
  validateSortQuery,
  validateCommentId,
  checkArticleExists,
  checkCommentExists,
  checkUserExists,
} = require("../API/utils/api.utils");

const db = require("../db/connection");
// Using jest Mock to learn how to simulate database calls/responses in testing

// Mock the database connection
jest.mock("../db/connection", () => ({
  query: jest.fn(),
}));

describe("Input validation functions", () => {
  // reset mock before each test that queries the mock database
  beforeEach(() => {
    jest.clearAllMocks();
  });
  describe("validateTopics Function", () => {
    test("TRUE: accepts valid topic format", () => {
      // MOCKS returned values from simulated database
      db.query.mockResolvedValue({ rows: [{ slug: "cats" }] });
      // invokes function being tested
      return validateTopics("cats").then((result) => {
        expect(result).toBe(true);
      });
    });
    test("400: rejects invalid characters", () => {
      // no need to call database here as function tests this input without a database call
      return validateTopics("cats; DROP TABLE").catch((error) => {
        expect(error).toEqual({
          status: 400,
          message: "Invalid topic format",
        });
      });
    });
    test("400: rejects numeric topics", () => {
      return validateTopics("123").catch((error) => {
        expect(error).toEqual({
          status: 400,
          message: "Invalid topic format",
        });
      });
    });
    test("404: rejects non-existent topics", () => {
      // passes this result after the db.query CALL within the fucntion being tested
      db.query.mockResolvedValue({ rows: [] });
      return validateTopics("nonExistentTopic").catch((error) => {
        expect(error).toEqual({
          status: 404,
          message: "Topic does not exist",
        });
      });
    });
  });
  describe("validateSortQuery Function", () => {
    test("TRUE: accepts valid sort_by and order", () => {
      return validateSortQuery("created_at", "DESC").then((result) => {
        // expects util function to resolve true
        expect(result).toBe(true);
      });
    });
    test("400: rejects invalid sort column", () => {
      return (
        validateSortQuery("invalid_column", "DESC")
          // catches error returned by util function being tested
          .catch((error) => {
            expect(error).toEqual({
              status: 400,
              message: "Invalid category request",
            });
          })
      );
    });
    test("400: rejects invalid order value", () => {
      return (
        validateSortQuery("created_at", "SQLattempt")
          // catches error from util function and expects error object returned
          .catch((error) => {
            expect(error).toEqual({
              status: 400,
              message: "Invalid sort request",
            });
          })
      );
    });
    test("TRUE: accepts case-insensitive order values", () => {
      return validateSortQuery("created_at", "asc").then((result) => {
        expect(result).toBe(true);
      });
    });
  });
  describe("validateCommentId Function", () => {
    test("TRUE: accepts valid comment id", () => {
      return validateCommentId("1").then((result) => {
        expect(result).toBe(true);
      });
    });
    test("400: rejects non-numeric id", () => {
      return validateCommentId("abc").catch((error) => {
        expect(error).toEqual({
          status: 400,
          message: "Invalid comment id",
        });
      });
    });
    test("400: rejects decimal numbers", () => {
      return validateCommentId("1.5").catch((error) => {
        expect(error).toEqual({
          status: 400,
          message: "Invalid comment id",
        });
      });
    });
    test("400: ejects negative numbers", () => {
      return validateCommentId("-1").catch((error) => {
        expect(error).toEqual({
          status: 400,
          message: "Invalid comment id",
        });
      });
    });
  });
});

describe("Database Check Functions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  describe("checkArticleExists Function", () => {
    test("TRUE: returns true for existing article", () => {
      // ARRANGE : Simulates the database call within the util function
      db.query.mockResolvedValue({ rows: [{ article_id: 1 }] });
      // ACT : invokes the util function being tested
      return (
        checkArticleExists(1)
          // ASSERT : inspects the result
          .then((result) => {
            expect(result).toBe(true);
          })
      );
    });
    test("404: rejects for non-existent article", () => {
      // simluates an empty array being returned
      db.query.mockResolvedValue({ rows: [] });
      return (
        checkArticleExists(999)
          // inspects the error returned from util function
          .catch((error) => {
            expect(error).toEqual({
              status: 404,
              message: "Article does not exist",
            });
          })
      );
    });
  });
  describe("checkCommentExists", () => {
    test("TRUE: returns true for existing comment", () => {
      db.query.mockResolvedValue({ rows: [{ comment_id: 1 }] });
      return checkCommentExists(1).then((result) => {
        expect(result).toBe(true);
      });
    });
    test("404: rejects for non-existent comment", () => {
      db.query.mockResolvedValue({ rows: [] });
      return checkCommentExists(999).catch((error) => {
        expect(error).toEqual({
          status: 404,
          message: "Comment not found",
        });
      });
    });
  });
  describe("checkUserExists", () => {
    test("TRUE: returns true for existing user", () => {
      db.query.mockResolvedValue({ rows: [{ username: "testuser" }] });
      return checkUserExists("testuser").then((result) => {
        expect(result).toBe(true);
      });
    });
    test("404: rejects for non-existent user", () => {
      db.query.mockResolvedValue({ rows: [] });
      return checkUserExists("nonexistent").catch((err) => {
        expect(err).toEqual({
          status: 404,
          message: "User not found",
        });
      });
    });
  });
});
