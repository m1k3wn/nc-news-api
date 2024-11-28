const express = require("express");
const { getApi } = require("./controllers/api.controller");
const {
  /* Topics Controller */
  getTopics,
} = require("./controllers/topics.controller");

const {
  /* Users Controller */
  getAllUsers,
} = require("./controllers/users.controller");

const {
  /* Articles Controller */
  getAllArticles,
  getArticleById,
  getCommentsByArticleId,
  addCommentToArticle,
  updateArticleVotes,
} = require("./controllers/articles.controller");

const { deleteCommentById } = require("./controllers/comments.controller");

const {
  /* Error Handlers */
  serverErrorHandler,
  wrongPathHandler,
  postgresErrorHandler,
  customErrorHandler,
} = require("./utils/api.utils");
const app = express();

app.use(express.json());

/* GET Requests */
app.get("/api", getApi);
app.get("/api/topics", getTopics);
app.get("/api/users", getAllUsers);
app.get("/api/articles", getAllArticles);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles/:article_id/comments", getCommentsByArticleId);

/* POST Requests */
app.post("/api/articles/:article_id/comments", addCommentToArticle);

/* PATCH Requests */
app.patch("/api/articles/:article_id", updateArticleVotes);

/* PATCH Requests */
app.delete("/api/comments/:comment_id", deleteCommentById);

app.use(postgresErrorHandler);
app.use(customErrorHandler);

app.use("/api/*", wrongPathHandler);

// app.use(serverErrorHandler);

module.exports = app;
