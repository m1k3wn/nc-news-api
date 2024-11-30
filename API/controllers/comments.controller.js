const { response } = require("../app");

const {
  /* models */
  deleteComment,
} = require("../models/comments.model");

const { validateCommentId, checkCommentExists } = require("../utils/api.utils");

exports.deleteCommentById = (request, response, next) => {
  const { comment_id } = request.params;

  // all util validation checks wrapped in promise.all
  Promise.all([validateCommentId(comment_id), checkCommentExists(comment_id)])
    .then(() => deleteComment(comment_id))
    .then(() => {
      response.status(204).send();
    })
    .catch(next);
};
