const logger = require("../startup/logging");

module.exports = function (err, req, res, next) {
  if (err.name === "HttpError")
    return res.status(err.statusCode).send(err.message);
  else {
    logger.error("Uncaught Error:", err);
    return res.status(500).send(`Something Failed: ${err.message}`);
  }
};
