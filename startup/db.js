const mongoose = require("mongoose");
const logger = require("./logging");

module.exports = function () {
  const { NODE_ENV, DB_URL, DB_USERNAME, DB_PASSWORD, DB_HOST } = process.env;

  let dbUrl = DB_URL;

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
      logger.info(`Connected to ${dbUrl} Successfully!`);

      if (NODE_ENV === "production")
        logger
          .addMongoDBTransport(dbUrl)
          .then(logger.info(`Logging to database...`));
    });
};
