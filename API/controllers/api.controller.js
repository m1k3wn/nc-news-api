const endpointsJson = require("../../endpoints.json");

exports.getApi = (req, res) => {
  console.log("endpoints sent to client");
  res.status(200).send({ endpoints: endpointsJson });
};
