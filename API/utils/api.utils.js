const db = require("../../db/connection");
exports.validSortColumns = [
  "article_id",
  "title",
  "topic",
  "author",
  "created_at",
  "votes",
  "article_img_url",
];

/* Articles utils */
exports.validateTopics = (topic) => {
  const validTopicPattern = /^[a-z0-9-]+$/i;
  //combined tests for SQL injection
  if (!validTopicPattern.test(topic)) {
    return Promise.reject({ status: 400, message: "Invalid topic format" });
  }
  // checks for non-numeric topic
  if (Number(+topic)) {
    return Promise.reject({ status: 400, message: "Invalid topic format" });
  }
  const query = `SELECT * FROM topics WHERE slug = $1`;
  return db.query(query, [topic]).then(({ rows }) => {
    if (!rows.length) {
      return Promise.reject({ status: 404, message: "Topic does not exist" });
    }
    return true;
  });
};

exports.validateSortQuery = (sort_by, order) => {
  // refactored to use regex for stricter test
  const validOrderPattern = /^(ASC|DESC)$/i;

  if (sort_by && !exports.validSortColumns.includes(sort_by)) {
    return Promise.reject({ status: 400, message: "Invalid category request" });
  }

  if (order && !validOrderPattern.test(order)) {
    return Promise.reject({ status: 400, message: "Invalid sort request" });
  }
  return Promise.resolve(true);
};

exports.checkArticleExists = (article_id) => {
  const query = `SELECT * FROM articles WHERE article_id = $1`;
  return db.query(query, [article_id]).then(({ rows }) => {
    if (!rows.length) {
      return Promise.reject({ status: 404, message: "Article does not exist" });
    }
    return true;
  });
};

/* Comments utils */
exports.validateCommentId = (comment_id) => {
  const numericId = +comment_id;

  if (isNaN(numericId) || !Number.isInteger(numericId) || numericId <= 0) {
    return Promise.reject({ status: 400, message: "Invalid comment id" });
  }
  return Promise.resolve(true);
};
exports.checkCommentExists = (comment_id) => {
  const query = `SELECT * FROM comments WHERE comment_id = $1`;
  return db.query(query, [comment_id]).then(({ rows }) => {
    if (!rows.length) {
      return Promise.reject({ status: 404, message: "Comment not found" });
    }
    // automatically wrapped in a promise as is within .then block
    return true;
  });
};

/* Users utils */
exports.checkUserExists = (username) => {
  const usernameCheckQuery = `SELECT * FROM users WHERE username = $1`;
  return db.query(usernameCheckQuery, [username]).then(({ rows }) => {
    if (!rows.length) {
      return Promise.reject({ status: 404, message: "User not found" });
    }
    return true;
  });
};

// * ERROR HANDLERS *//

// Postgres Code Error Handler
exports.postgresErrorHandler = (error, request, response, next) => {
  if (error.code) {
    const postgresErrorMap = {
      "22P02": { status: 400, message: "Invalid request type" },
      // 23503: { status: 400, message: "Foreign key violation" },
      // 23505: { status: 400, message: "Duplicate key value" },
    };
    const mappedError = postgresErrorMap[error.code];
    if (mappedError) {
      response
        .status(mappedError.status)
        .send({ message: mappedError.message });
    }
  }
  next(error);
};

// Custom Error Handler
exports.customErrorHandler = (error, request, response, next) => {
  if (error.status && error.message) {
    response.status(error.status).send({ message: error.message });
  } else {
    next(error);
  }
};

// Wrong path Handler
exports.wrongPathHandler = (request, response) => {
  response.status(404).send({ message: "Endpoint not found" });
};

// DEBUGGER
// 500 Internal Server Error (Internal use only):
// exports.serverErrorHandler = (error, request, response, next) => {
//   console.log("Error caught in 500 handler:", error);
//   response.status(500).send({
//     message: "Internal Server Error",
//   });
// };
