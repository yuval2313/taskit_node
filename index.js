const express = require("express");
const app = express();

require("./startup/config");
require("./startup/routes")(app);
require("./startup/db")();

const port = process.env.PORT;
const server = app.listen(port, () =>
  console.log(`listening on port ${port}...`)
);

module.exports = server;
