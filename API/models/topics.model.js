const db = require("../../db/connection");

exports.selectTopics = () => {
  return db
    .query(`SELECT * FROM topics ORDER BY slug;`)
    .then(({ rows }) => rows);
};
