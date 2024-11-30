const db = require("../../db/connection");

const { checkArticleExists, validSortColumns } = require("../utils/api.utils");

exports.fetchArticles = (sort_by = "created_at", order = "DESC", topic) => {
  // order assignment moved to model model
  order = order.toUpperCase() === "ASC" ? "ASC" : "DESC";

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
  // removes redundant if block, orders by defaults
  sqlQuery += ` ORDER BY ${sort_by} ${order};`;

  return db.query(sqlQuery, queryValues).then(
    ({ rows }) =>
      // changed to implicit return
      rows
  );
};

exports.selectArticleById = (article_id) => {
  let sqlQuery = `SELECT articles.article_id,
  articles.title,
  articles.topic,
  articles.author,
  articles.created_at,
  articles.body,
  articles.votes,
  articles.article_img_url,
  COUNT(comments.comment_id) AS comment_count
  FROM articles
  LEFT JOIN comments ON articles.article_id = comments.article_id
  WHERE articles.article_id = $1
  GROUP BY articles.article_id
  ORDER BY comment_count DESC;`;
  return db.query(sqlQuery, [article_id]).then(({ rows }) => {
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
