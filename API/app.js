const express = require("express");
const { getApi } = require("./controllers/api.controller");
const app = express();

app.use(express.json());

// get
app.get("/api", getApi);
// patch
// post
// delete

//error handling

module.exports = app;
