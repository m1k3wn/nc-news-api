exports.postgresErrorHandler = (error, request, response, next) => {
  // if error body has .code its a psql error
  if (error.code) {
    const postgresErrorMap = {
      "22P02": { status: 400, message: "Invalid request type" },
    };
    const mappedError = postgresErrorMap[error.code];
    if (mappedError) {
      response
        .status(mappedError.status)
        .send({ message: mappedError.message });
    }
  } else {
    //passes to next middleware utility function
    next(error);
  }
};

// custom error returned from rejected promise
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
