const {
  /* models */
  selectArticles,
  checkArticleExists,
} = require("../models/articles.model");

exports.getArticles = (request, response, next) => {
  const { article_id } = request.params;
  const promises = [selectArticles(article_id)];
  if (article_id) {
    promises.push(checkArticleExists(article_id));
  }
  Promise.all(promises)
    .then(([article]) => {
      response.status(200).send({ article });
    })
    .catch(next);
};
