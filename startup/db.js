const mongoose = require("mongoose");
//TODO: use logger

module.exports = function () {
  const { NODE_ENV, DBURL, DB_USERNAME, DB_PASSWORD, DB_HOST } = process.env;

  let dbUrl = DBURL;

  if (NODE_ENV === "production")
    dbUrl = `mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}/taskit`;

  mongoose
    .connect(dbUrl, {
      retryWrites: true,
      w: "majority",
      useUnifiedTopology: true,
      useNewUrlParser: true,
    })
    .then(() => {
      console.log(`Connected to ${dbUrl} Successfully!`);
    });
};
