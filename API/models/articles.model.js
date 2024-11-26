const db = require("../../db/connection");

exports.checkArticleExists = (article_id) => {
  const query = `SELECT * FROM articles WHERE article_id = $1`;
  const values = [article_id];
  return db.query(query, values).then(({ rows }) => {
    if (!rows.length) {
      return Promise.reject({ status: 404, message: "Article does not exist" });
    }
  });
};

exports.selectArticles = (articleId) => {
  const query = `SELECT * FROM articles WHERE article_id = $1`;
  const values = [articleId];
  return db.query(query, values).then(({ rows }) => {
    return rows[0];
  });
};
