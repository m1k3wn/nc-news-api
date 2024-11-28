const { response } = require("../app");

const {
  /* models */
  deleteComment,
} = require("../models/comments.model");

exports.deleteCommentById = (request, response, next) => {
  const { comment_id } = request.params;
  if (isNaN(Number(comment_id))) {
    return next({ status: 400, message: "Invalid comment id" });
  }
  deleteComment(comment_id)
    .then((result) => {
      if (!result.rowCount) {
        return next({ status: 404, message: "Comment not found" });
      }
      response.status(204).send();
    })
    .catch(next);
};
