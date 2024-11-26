const express = require("express");
//controllers
const { getApi } = require("./controllers/api.controller");
const { getTopics } = require("./controllers/topics.controller");
const {
  getArticles,
  getArticleById,
} = require("./controllers/articles.controller");
//error handling middleware
const {
  serverErrorHandler,
  wrongPathHandler,
  postgresErrorHandler,
  customErrorHandler,
} = require("./utils/api.utils");
const app = express();

app.use(express.json());

// get requests
app.get("/api", getApi);
app.get("/api/topics", getTopics);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id", getArticleById);

// patch
// post
// delete

app.use(postgresErrorHandler);
app.use(customErrorHandler);

// // KEEP AT BOTTOM
// refactor to app.all
app.use("/api/*", wrongPathHandler);
// internal server error (test block)
app.use("/*", serverErrorHandler);

module.exports = app;
