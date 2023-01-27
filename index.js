const express = require("express");
const logger = require("./startup/logging");
const app = express();

require("./startup/config");
require("./startup/cors")(app);
require("./startup/routes")(app);
require("./startup/db")();

const { NODE_ENV, PORT } = process.env;

if (NODE_ENV === "production") require("./startup/prod")(app);
const server = app.listen(PORT, () =>
  logger.info(`listening on port ${PORT}...`)
);

module.exports = server;
