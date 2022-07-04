const mongoose = require("mongoose");
const HttpError = require("../errors/HttpError");
const { Task } = require("./task");

const Joi = require("joi");

const labelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      minlength: 1,
      maxlength: 50,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

labelSchema.statics.findUserLabels = async function (userId) {
  const labels = await this.find({ userId });
  if (!labels || !labels.length)
    throw new HttpError({
      statusCode: 404,
      message: "No labels found for current user",
    });

  return labels;
};

labelSchema.statics.findLabelById = async function (labelId, userId) {
  const label = await this.findOne({ _id: labelId, userId });
  if (!label)
    throw new HttpError({
      statusCode: 404,
      message: "Label with the given id was not found",
    });

  return label;
};

labelSchema.statics.updateLabel = async function (labelId, userId, body) {
  const label = await this.findOneAndUpdate({ _id: labelId, userId }, body, {
    new: true,
  });
  if (!label)
    throw new HttpError({
      statusCode: 404,
      message: "Label with the given id was not found",
    });

  return label;
};

labelSchema.statics.deleteLabel = async function (labelId, userId) {
  const session = await mongoose.connection.startSession();
  session.startTransaction();

  const label = await this.findOneAndDelete(
    { _id: labelId, userId },
    { session }
  );

  if (!label)
    throw new HttpError({
      statusCode: 404,
      message: "Label with the given ID was not found",
    });

  await Task.removeLabel(labelId, userId, session);

  await session.commitTransaction();
  session.endSession();

  return label;
};

labelSchema.statics.verifyLabelIds = async function (labelIds, userId) {
  const labels = await this.find({
    _id: { $in: labelIds },
    userId: userId,
  });

  if (labelIds.length && labels.length !== labelIds.length)
    throw new HttpError({
      statusCode: 400,
      message: "One or more invalid / duplicate label ids!",
    });
};

const Label = mongoose.model("Label", labelSchema);

const validationSchema = {
  name: Joi.string().min(1).max(50).required(),
};

function labelValidation(label) {
  const schema = Joi.object(validationSchema);
  return schema.validate(label);
}

exports.Label = Label;
exports.labelValidation = labelValidation;
