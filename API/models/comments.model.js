const db = require("../../db/connection");

exports.deleteComment = (comment_id) => {
  const deleteQuery = `DELETE FROM comments
    WHERE comment_id = $1
    RETURNING *;`;
  return db.query(deleteQuery, [comment_id]);
};
