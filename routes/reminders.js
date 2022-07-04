const express = require("express");
const router = express.Router();

const validation = require("../middleware/validation");
const validateObjectId = require("../middleware/validateObjectId");

const { Reminder, reminderValidation } = require("../models/reminder");
const { Task } = require("../models/task");

router.get("/", async (req, res) => {
  const { _id: userId } = req.user;

  const reminders = await Reminder.findUserReminders(userId);

  return res.send(reminders);
});

router.get("/:id", validateObjectId, async (req, res) => {
  const { _id: userId } = req.user;
  const { id: reminderId } = req.params;

  const reminder = await Reminder.findReminderById(reminderId, userId);

  return res.send(reminder);
});

router.post("/", validation(reminderValidation), async (req, res) => {
  const { _id: userId } = req.user;
  const { taskId } = req.body;

  await Task.verifyTaskId(taskId, userId);

  const reminder = await Reminder.create({ ...req.body, userId });

  return res.send(reminder);
});

router.put(
  "/:id",
  [validateObjectId, validation(reminderValidation)],
  async (req, res) => {
    const { _id: userId } = req.user;
    const { id: reminderId } = req.params;

    const reminder = await Reminder.updateReminder(
      reminderId,
      userId,
      req.body
    );

    return res.send(reminder);
  }
);

router.delete("/:id", validateObjectId, async (req, res) => {
  const { _id: userId } = req.user;
  const { id: reminderId } = req.params;

  const reminder = await Reminder.deleteReminder(reminderId, userId);

  return res.send(reminder);
});

module.exports = router;
