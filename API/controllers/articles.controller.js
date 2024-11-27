const {
  /* models */
  checkArticleExists,
  fetchArticles,
  selectArticleById,
  selectCommentsByArticleId,
} = require("../models/articles.model");

exports.getAllArticles = (_, response) => {
  fetchArticles().then((articles) => {
    response.status(200).send({ articles });
  });
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

////getArticleById was Refactored from (stephens example):
/////// Will likely re-instate this once handling queries
// exports.getArticleById = (request, response, next) => {
//   const { article_id } = request.params;
//   const promises = [selectArticleById(article_id)];
//   if (article_id) {
//     promises.push(checkArticleExists(article_id));
//   }
//   Promise.all(promises)
//     .then(([article]) => {
//       response.status(200).send({ article });
//     })
//     .catch((error) => {
//       next(error);
//     });
// };
