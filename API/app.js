const express = require("express");
const { getApi } = require("./controllers/api.controller");
const { getTopics } = require("./controllers/topics.controller");

const {
  /* Articles Controllers */
  getAllArticles,
  getArticleById,
  getCommentsByArticleId,
} = require("./controllers/articles.controller");

const {
  /* Error Handlers */
  serverErrorHandler,
  wrongPathHandler,
  postgresErrorHandler,
  customErrorHandler,
} = require("./utils/api.utils");
const app = express();

app.use(express.json());

app.get("/api", getApi);
app.get("/api/topics", getTopics);
app.get("/api/articles", getAllArticles);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles/:article_id/comments", getCommentsByArticleId);

// ADD: post, patch, delete here

app.use(postgresErrorHandler);
app.use(customErrorHandler);

app.use("/api/*", wrongPathHandler);

app.use(serverErrorHandler);

module.exports = app;
