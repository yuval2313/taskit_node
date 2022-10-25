const express = require("express");
require("express-async-errors");

const login = require("../routes/login");
const users = require("../routes/users");
const tasks = require("../routes/tasks");
const labels = require("../routes/labels");

const googleAuth = require("../middleware/googleAuth");
const auth = require("../middleware/auth");
const error = require("../middleware/error");

module.exports = (app) => {
  app.use(express.json());
  app.use("/api/login", login);
  app.use("/api/users", [googleAuth, auth], users);
  app.use("/api/tasks", [googleAuth, auth], tasks);
  app.use("/api/labels", [googleAuth, auth], labels);
  app.use(error);
};
