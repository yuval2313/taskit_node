const express = require("express");
require("express-async-errors");

const users = require("../routes/users");
const login = require("../routes/login");
const tasks = require("../routes/tasks");
const labels = require("../routes/labels");
const reminders = require("../routes/reminders");

const auth = require("../middleware/auth");
const error = require("../middleware/error");

module.exports = (app) => {
  app.use(express.json());
  app.use("/api/users", users);
  app.use("/api/login", login);
  app.use("/api/tasks", auth, tasks);
  app.use("/api/labels", auth, labels);
  app.use("/api/reminders", auth, reminders);
  app.use(error);
};
