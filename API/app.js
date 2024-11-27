const express = require("express");
//controllers
const { getApi } = require("./controllers/api.controller");
const { getTopics } = require("./controllers/topics.controller");
const {
  getAllArticles,
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
app.get("/api/articles", getAllArticles);
app.get("/api/articles/:article_id", getArticleById);
// comments endpoint goes here

// ADD: post, patch, delete here

app.use(postgresErrorHandler);
app.use(customErrorHandler);

app.use("/api/*", wrongPathHandler);

app.use(serverErrorHandler);

module.exports = app;
