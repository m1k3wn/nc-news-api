const db = require("../../db/connection");

// fetches all articles without body by date descending
exports.fetchArticles = () => {
  return db
    .query(
      `SELECT 
      article_id,
      title,
      topic,
      author,
      created_at,
      votes,
      article_img_url
       FROM articles ORDER BY created_at DESC`
    )
    .then(({ rows }) => {
      return rows;
    });
};

// verifies if passed :article_id returns an existing article or empty array
exports.checkArticleExists = (article_id) => {
  const query = `SELECT * FROM articles WHERE article_id = $1`;
  const values = [article_id];
  return db.query(query, values).then(({ rows }) => {
    if (!rows.length) {
      return Promise.reject({ status: 404, message: "Article does not exist" });
    }
    return true;
  });
};

// fetchs by specific :article_id (add sortBy logic into here later)
exports.selectArticleById = (article_id) => {
  let sqlQuery = `SELECT * FROM articles `;
  const queryValues = [];
  if (article_id) {
    sqlQuery += `WHERE article_id=$1`;
    queryValues.push(article_id);
  }
  return db.query(sqlQuery, queryValues).then(({ rows }) => {
    return rows[0];
  });
};
