const {
  /* models */
  selectArticleById,
  checkArticleExists,
  fetchArticles,
} = require("../models/articles.model");

exports.getAllArticles = (_, response) => {
  fetchArticles().then((articles) => {
    response.status(200).send({ articles });
  });
};

exports.getArticleById = (request, response, next) => {
  const { article_id } = request.params;
  //returns a promise:
  checkArticleExists(article_id)
    // wrapped with anonymous callback function 
    .then(() => selectArticleById(article_id))
    .then((article) => response.status(200).send({ article }))
    .catch(next);
};

////Refactored from: 
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
