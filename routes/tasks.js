const express = require("express");
const router = express.Router();

const validation = require("../middleware/validation");
const validateObjectId = require("../middleware/validateObjectId");

const { Task, taskValidation, taskPatchValidation } = require("../models/task");

// Retrieve

router.get("/", async (req, res) => {
  const { _id: userId } = req.user;

  const tasks = await Task.find({ userId });

  if (!tasks || tasks.length === 0)
    return res.status(404).send("No tasks found for current user");

  return res.send(tasks);
});

router.get("/:id", validateObjectId, async (req, res) => {
  const { _id: userId } = req.user;
  const { id: taskId } = req.params;

  const task = await Task.findOne({ userId, _id: taskId });

  if (!task) return res.status(404).send("Task with the given id not found");

  return res.send(task);
});

// Create

router.post("/", validation(taskValidation), async (req, res) => {
  const { _id: userId } = req.user;

  const task = new Task(req.body);
  task.userId = userId;

  await task.save();

  return res.send(task);
});

// Update
// FIXME: Perhaps lose PUT and leave PATCH

router.put(
  "/:id",
  [validateObjectId, validation(taskValidation)],
  async (req, res) => {
    const { _id: userId } = req.user;
    const { id: taskId } = req.params;

    const task = await Task.findOneAndUpdate(
      { userId, _id: taskId },
      req.body,
      {
        new: true,
      }
    );

    if (!task)
      return res.status(404).send("Task with the given id was not found");

    return res.send(task);
  }
);

// PATCH: Uses different validation function

router.patch(
  "/:id",
  [validateObjectId, validation(taskPatchValidation)],
  async (req, res) => {
    const { _id: userId } = req.user;
    const { id: taskId } = req.params;

    const task = await Task.findOneAndUpdate(
      { userId, _id: taskId },
      req.body,
      {
        new: true,
      }
    );

    if (!task)
      return res.status(404).send("Task with the given id was not found");

    return res.send(task);
  }
);

// Delete

router.delete("/:id", validateObjectId, async (req, res) => {
  const { _id: userId } = req.user;
  const { id: taskId } = req.params;

  const task = await Task.findOneAndDelete({ userId, _id: taskId });

  if (!task) return res.status(404).send("Task with the given id not found");

  return res.send(task);
});

module.exports = router;
