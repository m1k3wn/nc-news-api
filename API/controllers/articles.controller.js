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
} = require("../utils/api.utils");

// add sort controller and if no sort_by move getArticles logic into that block
exports.getArticles = (request, response, next) => {
  let { sort_by, order } = request.query;

  sort_by = sort_by || "created_at";
  order = order || "DESC";
  Promise.resolve(validateSortQuery(sort_by, order))
    .then(() => fetchArticles(sort_by, order))
    .then((articles) => response.status(200).send({ articles }))
    .catch(next);
};

exports.getArticleById = (request, response, next) => {
  const { article_id } = request.params;
  checkArticleExists(article_id)
    .then(() => selectArticleById(article_id))
    .then((article) => response.status(200).send({ article }))
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
