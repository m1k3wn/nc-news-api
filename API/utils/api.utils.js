// postgres errors

// custom errors
exports.customErrorHandler = (error, request, response, next) => {
  if (error.status && error.message) {
    response.status(error.status).send({ message: error.message });
  } else {
    next(error);
  }
};

// not found error
exports.wrongPathHandler = (request, response) => {
  response.status(404).send({ message: "Endpoint not found" });
};

// 500 server error
exports.serverErrorHandler = (request, response) => {
  response.status(500).send({ message: "Internal Server Error" });
};
