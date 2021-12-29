const express = require("express");
require("express-async-errors");

const users = require("../routes/users");
const login = require("../routes/login");
const tasks = require("../routes/tasks");

const error = require("../middleware/error");
const auth = require("../middleware/auth");

module.exports = (app) => {
  app.use(express.json());
  app.use("/api/users", users);
  app.use("/api/login", login);
  app.use("/api/tasks", auth, tasks);
  app.use(error);
};
