const db = require("../../db/connection");
//Check article exists
exports.checkArticleExists = (article_id) => {
  const query = `SELECT * FROM articles WHERE article_id = $1`;
  return db.query(query, [article_id]).then(({ rows }) => {
    if (!rows.length) {
      return Promise.reject({ status: 404, message: "Article does not exist" });
    }
    return true;
  });
};

// Validate username
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

// FOR DEBUGGING
// // 500 Internal Server Error (debugger):
// exports.serverErrorHandler = (error, request, response, next) => {
//   console.log("Error caught in 500 handler:", error);
//   response.status(500).send({
//     message: "Internal Server Error",
//   });
// };
