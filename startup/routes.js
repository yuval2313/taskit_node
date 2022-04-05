const express = require("express");
require("express-async-errors");

const users = require("../routes/users");
const login = require("../routes/login");
const tasks = require("../routes/tasks");
const labels = require("../routes/labels");

const error = require("../middleware/error");
const auth = require("../middleware/auth");

module.exports = (app) => {
  app.use(express.json());
  app.use("/api/users", users);
  app.use("/api/login", login);
  app.use("/api/tasks", auth, tasks);
  app.use("/api/labels", auth, labels);
  app.use(error);
};
