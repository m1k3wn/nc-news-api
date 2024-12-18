const { response } = require("../app");

const {
  /* models */
  deleteComment,
  updateCommentVotes,
} = require("../models/comments.model");

/* Util Functions */
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

exports.updateCommentVotes = (request, response, next) => {
  const { comment_id } = request.params;
  const { inc_votes } = request.body;

  if (typeof inc_votes === "undefined") {
    return response.status(400).send({ message: "Invalid vote increment" });
  }
  if (typeof inc_votes !== "number") {
    return response.status(400).send({ message: "Invalid vote increment" });
  }
  
  Promise.all([validateCommentId(comment_id), checkCommentExists(comment_id)])
    .then(() => {
      return updateCommentVotes(comment_id, inc_votes);
    })
    .then((updatedComment) => {
      response.status(200).send({ comment: updatedComment });
    })
    .catch(next);
};
