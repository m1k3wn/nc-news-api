const {
  /* models */
  selectArticleById,
  checkArticleExists,
  fetchArticles,
} = require("../models/articles.model");

exports.getArticles = (request, response) => {
  fetchArticles().then((articles) => {
    response.status(200).send({ articles });
  });
};

exports.getArticleById = (request, response, next) => {
  const { article_id } = request.params;
  // console.log(request.params, "<<<-- request params ");
  // console.log(request.query, "<<<-- request query ");
  const promises = [selectArticleById(article_id)];
  if (article_id) {
    promises.push(checkArticleExists(article_id));
  }
  Promise.all(promises)
    .then(([article]) => {
      response.status(200).send({ article });
    })
    .catch((error) => {
      next(error);
    });
};
