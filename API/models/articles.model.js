const db = require("../../db/connection");

exports.fetchArticles = (sort_by, order, topic) => {
  let sqlQuery = `SELECT
  article_id,
  title,
  topic,
  author,
  created_at,
  votes,
  article_img_url
   FROM articles`;
  const queryValues = [];

  if (topic) {
    sqlQuery += ` WHERE topic = $1`;
    queryValues.push(topic);
  }
  if (sort_by) {
    sqlQuery += ` ORDER BY ${sort_by} ${order};`;
  }

  return db.query(sqlQuery, queryValues).then(({ rows }) => {
    return rows;
  });
};

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

exports.selectCommentsByArticleId = (article_id) => {
  const query = `SELECT 
  comment_id, 
  votes, 
  created_at, 
  author, 
  body, 
  article_id
FROM comments
WHERE article_id = $1
ORDER BY created_at DESC;`;

  return db.query(query, [article_id]).then(({ rows }) => {
    return rows;
  });
};

exports.insertUserComment = (article_id, username, body) => {
  const insertQuery = `INSERT INTO comments (article_id, author, body)
  VALUES ($1, $2, $3)
  RETURNING *;
`;
  const values = [article_id, username, body];
  return db.query(insertQuery, values).then(({ rows }) => {
    return rows[0];
  });
};

exports.updateVotesByArticleId = (article_id, inc_votes) => {
  const voteUpdateQuery = `UPDATE articles
  SET votes = votes + $2
  WHERE article_id = $1
  RETURNING *`;
  const values = [article_id, inc_votes];
  return db.query(voteUpdateQuery, values).then(({ rows }) => {
    return rows[0];
  });
};
