const mongoose = require("mongoose");
const Joi = require("joi");

const statusList = ["", "todo", "doing", "complete"];

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
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true } // automatically sets createdAt & updatedAt
);

mongoose.Schema.Types.String.checkRequired((v) => typeof v === "string");

const Task = mongoose.model("Task", taskSchema);

// Validation - Joi
// USED: Joi.object().fork([fields], callback()) - callback maps each field supplied in fields array, become required

const taskValidationSchema = {
  title: Joi.string().max(100).allow(""),
  content: Joi.string().max(5000).allow(""),
  status: Joi.string()
    .valid(...statusList)
    .allow(""),
};
const fields = Object.keys(taskValidationSchema);

function taskValidation(task) {
  const schema = Joi.object(taskValidationSchema).fork(
    fields,
    (field) => field.required() // all fields become required
  );

  return schema.validate(task);
}

function taskPatchValidation(task) {
  const schema = Joi.object(taskValidationSchema).min(1).label("task");

  return schema.validate(task);
}

exports.Task = Task;
exports.taskValidation = taskValidation;
exports.taskPatchValidation = taskPatchValidation;
