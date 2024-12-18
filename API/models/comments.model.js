const db = require("../../db/connection");

exports.deleteComment = (comment_id) => {
  const deleteQuery = `DELETE FROM comments
    WHERE comment_id = $1;`;
  return db.query(deleteQuery, [comment_id]);
};

exports.updateCommentVotes = (comment_id, inc_votes) => {
  const updateQuery = `
    UPDATE comments
    SET votes = votes + $1
    WHERE comment_id = $2
    RETURNING *;
  `;

  return db
    .query(updateQuery, [inc_votes, comment_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Comment not found" });
      }
      return rows[0]; 
    });
};