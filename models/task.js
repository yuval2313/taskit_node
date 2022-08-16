const mongoose = require("mongoose");
const HttpError = require("../errors/HttpError");

const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const statusList = ["", "todo", "doing", "complete"];
const priorityList = ["", "low", "medium", "high", "urgent"];

// Model - Mongoose

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      maxlength: 100,
      required: true,
    },
    content: {
      type: String,
      maxlength: 5000,
      required: true,
    },
    status: {
      type: String,
      enum: statusList,
      required: true,
    },
    priority: {
      type: String,
      enum: priorityList,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    labels: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Label" }],
      validate: (val) => val.length <= 50,
      required: true,
    },
  },
  { timestamps: true } // automatically sets createdAt & updatedAt
);

mongoose.Schema.Types.String.checkRequired((v) => typeof v === "string");

taskSchema.statics.findUserTasks = async function (userId) {
  const tasks = await this.find({ userId });
  if (!tasks || !tasks.length)
    throw new HttpError({
      statusCode: 404,
      message: "No tasks found for current user",
    });

  return tasks;
};

taskSchema.statics.findTaskById = async function (taskId, userId) {
  const task = await this.findOne({ _id: taskId, userId });
  if (!task)
    throw new HttpError({
      statusCode: 404,
      message: "Task with the given id was not found",
    });

  return task;
};

taskSchema.statics.updateTask = async function (taskId, userId, body) {
  const task = await this.findOneAndUpdate({ _id: taskId, userId }, body, {
    new: true,
  });
  if (!task)
    throw new HttpError({
      statusCode: 404,
      message: "Task with the given id was not found",
    });

  return task;
};

taskSchema.statics.deleteTask = async function (taskId, userId) {
  const task = await this.findOneAndDelete({ _id: taskId, userId });

  if (!task) {
    throw new HttpError({
      statusCode: 404,
      message: "Task with the given id was not found",
    });
  }

  return task;
};

taskSchema.statics.removeLabel = async function (labelId, userId, session) {
  await this.updateMany(
    {
      labels: mongoose.Types.ObjectId(labelId),
      userId,
    },
    {
      $pull: {
        labels: labelId,
      },
    },
    { session }
  );
};

const Task = mongoose.model("Task", taskSchema);

// Validation - Joi

const validationSchema = {
  title: Joi.string().max(100).allow(""),
  content: Joi.string().max(5000).allow(""),
  status: Joi.string()
    .valid(...statusList)
    .allow(""),
  priority: Joi.string()
    .valid(...priorityList)
    .allow(""),
  labels: Joi.array().items(Joi.objectId()).max(50).allow(null),
};
const fields = Object.keys(validationSchema);

function taskValidation(task) {
  const schema = Joi.object(validationSchema).fork(fields, (field) =>
    field.required()
  );
  return schema.validate(task);
}

function taskUpdateValidation(task) {
  const schema = Joi.object(validationSchema).min(1).label("task");
  return schema.validate(task);
}

exports.Task = Task;
exports.taskValidation = taskValidation;
exports.taskUpdateValidation = taskUpdateValidation;
