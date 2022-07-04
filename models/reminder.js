const mongoose = require("mongoose");
const HttpError = require("../errors/HttpError");

const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const hour = 1 * 60 * 60 * 1000;

const reminderSchema = new mongoose.Schema(
  {
    dateTime: {
      type: Date,
      validate: {
        validator: (v) => v && v.getTime() >= Date.now(),
        message: "Reminder must be in the future",
      },
      required: true,
    },
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      required: true,
      immutable: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

reminderSchema.statics.findUserReminders = async function (userId) {
  const reminders = await this.find({ userId });
  if (!reminders || !reminders.length)
    throw new HttpError({
      statusCode: 404,
      message: "No reminders found for current user",
    });

  return reminders;
};

reminderSchema.statics.findReminderById = async function (reminderId, userId) {
  const reminder = await this.findOne({ _id: reminderId, userId });
  if (!reminder)
    throw new HttpError({
      statusCode: 404,
      message: "Reminder with the given id was not found",
    });

  return reminder;
};

reminderSchema.statics.updateReminder = async function (
  reminderId,
  userId,
  body
) {
  const session = await mongoose.connection.startSession();
  session.startTransaction();

  const reminder = await this.findOneAndUpdate(
    { _id: reminderId, userId },
    body,
    { new: true, session }
  );

  if (!reminder) {
    throw new HttpError({
      statusCode: 404,
      message: "Reminder with the given id was not found",
    });
  }

  if (reminder.taskId.toString() !== body.taskId) {
    await session.abortTransaction();
    throw new HttpError({
      statusCode: 400,
      message: `Reminder's "taskId" property is immutable`,
    });
  }

  await session.commitTransaction();
  session.endSession();

  return reminder;
};

reminderSchema.statics.deleteReminder = async function (reminderId, userId) {
  const reminder = await this.findOneAndDelete({ _id: reminderId, userId });

  if (!reminder) {
    throw new HttpError({
      statusCode: 404,
      message: "Reminder with the given id was not found",
    });
  }

  return reminder;
};

const Reminder = mongoose.model("Reminder", reminderSchema);

const validationSchema = {
  dateTime: Joi.date()
    .custom((v, helpers) =>
      v.getTime() < Date.now() ? helpers.error("date.min") : v
    )
    .required()
    .messages({
      "date.min": `"dateTime" must be in the future`,
    }),
  taskId: Joi.objectId().required(),
};

function reminderValidation(reminder) {
  const schema = Joi.object(validationSchema);
  return schema.validate(reminder);
}

exports.Reminder = Reminder;
exports.reminderValidation = reminderValidation;
