const express = require("express");
const router = express.Router();

const validation = require("../middleware/validation");
const validateObjectId = require("../middleware/validateObjectId");

const { Task, taskValidation } = require("../models/task");
const { Label } = require("../models/label");

router.get("/", async (req, res) => {
  const { _id: userId } = req.user;

  const tasks = await Task.findUserTasks(userId);

  return res.send(tasks);
});

router.get("/:id", validateObjectId, async (req, res) => {
  const { _id: userId } = req.user;
  const { id: taskId } = req.params;

  const task = await Task.findTaskById(taskId, userId);

  return res.send(task);
});

router.post("/", validation(taskValidation), async (req, res) => {
  const { _id: userId } = req.user;
  const { labels: labelIds } = req.body;

  await Label.verifyLabelIds(labelIds, userId);

  const task = await Task.create({ ...req.body, userId });

  return res.send(task);
});

router.put(
  "/:id",
  [validateObjectId, validation(taskValidation)],
  async (req, res) => {
    const { _id: userId } = req.user;
    const { id: taskId } = req.params;
    const { labels: labelIds } = req.body;

    await Label.verifyLabelIds(labelIds, userId);

    const task = await Task.updateTask(taskId, userId, req.body);

    return res.send(task);
  }
);

router.delete("/:id", validateObjectId, async (req, res) => {
  const { _id: userId } = req.user;
  const { id: taskId } = req.params;

  const task = await Task.deleteTask(taskId, userId);

  return res.send(task);
});

module.exports = router;
