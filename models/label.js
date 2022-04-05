const mongoose = require("mongoose");
const Joi = require("joi");

const labelSchema = new mongoose.Schema({
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
});

const Label = mongoose.model("Label", labelSchema);

const validationSchema = {
  name: Joi.string().min(1).max(50).required(),
};

function labelValidation(label) {
  const schema = Joi.object(validationSchema);
  return schema.validate(label);
}

exports.Label = Label;
exports.labelSchema = labelSchema;
exports.labelValidation = labelValidation;
