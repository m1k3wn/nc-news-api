const { response } = require("../app");
const {
  /* models */
  fetchArticles,
  selectArticleById,
  selectCommentsByArticleId,
  insertUserComment,
  updateVotesByArticleId,
} = require("../models/articles.model");

const {
  /* Validation Middleware */
  checkUserExists,
  checkArticleExists,
  validateSortQuery,
  validateTopics,
} = require("../utils/api.utils");

exports.getArticles = (request, response, next) => {
  // removed default assignment from controller
  let { sort_by, order, topic } = request.query;

  // all validation grouped in promise.all
  Promise.all([
    topic ? validateTopics(topic) : Promise.resolve(),
    validateSortQuery(sort_by, order),
  ])
    .then(() => fetchArticles(sort_by, order, topic))
    .then((articles) => {
      if (topic && !articles.length) {
        response.status(200).send({
          // refactors return for no articles found
          articles: [],
          message: "No articles found for this topic",
        });
      }
      response.status(200).send({ articles });
    })
    .catch(next);
};

exports.getArticleById = (request, response, next) => {
  const { article_id } = request.params;
  checkArticleExists(article_id)
    .then(() => {
      selectArticleById(article_id).then((article) =>
        response.status(200).send({ article })
      );
    })
    .catch(next);
};

exports.getCommentsByArticleId = (request, response, next) => {
  const { article_id } = request.params;
  checkArticleExists(article_id)
    // wraps model invocation with callback to await checkArticleExists resolution
    .then(() => {
      return selectCommentsByArticleId(article_id);
    })
    .then((comments) => {
      if (!comments.length) {
        response
          .status(200)
          .send({ comments, message: "No comments found for this article" });
      }
      response.status(200).send({ comments });
    })
    .catch(next);
};

exports.addCommentToArticle = (request, response, next) => {
  const { article_id } = request.params;
  const { username, body } = request.body;

  if (!username && !body) {
    return next({ status: 400, message: "Required fields are missing" });
  } else if (!body) {
    return next({ status: 400, message: "Request did not contain comment" });
  }
  checkUserExists(username)
    .then(() => {
      return checkArticleExists(article_id);
    })
    .then(() => {
      return insertUserComment(article_id, username, body);
    })
    .then((comment) => {
      response.status(201).send({ comment });
    })
    .catch(next);
};

exports.updateArticleVotes = (request, response, next) => {
  const { article_id } = request.params;
  const { inc_votes } = request.body;
  checkArticleExists(article_id)
    .then(() => {
      return updateVotesByArticleId(article_id, inc_votes);
    })
    .then((article) => {
      response.status(200).send({ article });
    })
    .catch(next);
};
