const express = require("express");
const { getApi } = require("./controllers/api.controller");
const cors = require("cors");

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
  getArticles,
  getArticleById,
  getCommentsByArticleId,
  addCommentToArticle,
  updateArticleVotes,
} = require("./controllers/articles.controller");

const {
  /* Comments Controller */
  deleteCommentById,
  updateCommentVotes, 
} = require("./controllers/comments.controller");

const {
  /* Error Handlers */
  serverErrorHandler,
  wrongPathHandler,
  postgresErrorHandler,
  customErrorHandler,
} = require("./utils/api.utils");
const app = express();

app.use(cors());
app.use(express.json());

/* GET Requests */
app.get("/api", getApi);
app.get("/api/topics", getTopics);
app.get("/api/users", getAllUsers);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles/:article_id/comments", getCommentsByArticleId);

/* POST Requests */
app.post("/api/articles/:article_id/comments", addCommentToArticle);

/* PATCH Requests */
app.patch("/api/articles/:article_id", updateArticleVotes);
app.patch("/api/comments/:comment_id", updateCommentVotes);


/* DELETE Requests */
app.delete("/api/comments/:comment_id", deleteCommentById);

app.use(postgresErrorHandler);
app.use(customErrorHandler);

app.use("/api/*", wrongPathHandler);

/* INTERNAL Debugger */
// app.use(serverErrorHandler);

module.exports = app;
