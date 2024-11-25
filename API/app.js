const express = require("express");
const { getApi } = require("./controllers/api.controller");
const { getTopics } = require("./controllers/topics.controller");
const app = express();

app.use(express.json());

// get requests
app.get("/api", getApi);
app.get("/api/topics", getTopics);

// patch
// post
// delete

//error handling

module.exports = app;
