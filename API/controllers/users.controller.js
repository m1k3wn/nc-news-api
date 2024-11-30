const {
  /* models */
  fetchAllUsers,
} = require("../models/users.model");

exports.getAllUsers = (request, response, next) => {
  fetchAllUsers()
    .then((users) => {
      response.status(200).send({ users });
    })
    .catch(next);
};
