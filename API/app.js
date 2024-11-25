const express = require("express");
//controllers
const { getApi } = require("./controllers/api.controller");
const { getTopics } = require("./controllers/topics.controller");
//error handling middleware
const { serverErrorHandler, wrongPathHandler } = require("./utils/api.utils");
const app = express();

app.use(express.json());

// get requests
app.get("/api", getApi);
app.get("/api/topics", getTopics);

// patch
// post
// delete

// // error handling
app.use("/api/*", wrongPathHandler);
// internal server error (test block)
app.use("*", serverErrorHandler);

module.exports = app;
