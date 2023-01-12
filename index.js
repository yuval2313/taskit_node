const express = require("express");
const app = express();

require("./startup/config");
require("./startup/cors")(app);
require("./startup/routes")(app);
require("./startup/db")();

const nodeEnv = process.env.NODE_ENV;
if (nodeEnv === "production") require("./startup/prod")(app);

const port = process.env.PORT;
const server = app.listen(port, () =>
  console.log(`listening on port ${port}...`)
);

module.exports = server;
