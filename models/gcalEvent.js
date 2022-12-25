const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const extendedPropertiesSchema = {
  private: Joi.object({
    taskIt: Joi.boolean().required(),
    taskId: Joi.objectId().required(),
  }).required(),
};

const dateSchema = { dateTime: Joi.date().required() };

const remindersSchema = {
  useDefault: Joi.boolean().required(),
  overrides: Joi.array().items(
    Joi.object({
      method: Joi.string().valid("popup").required(),
      minutes: Joi.number().required(),
    })
  ),
};

const validationSchema = {
  summary: Joi.string().max(100).allow("").required(),
  description: Joi.string().max(5000).allow("").required(),
  colorId: Joi.string().required(),
  start: Joi.object(dateSchema).required(),
  end: Joi.object(dateSchema).required(),
  reminders: Joi.object(remindersSchema).required(),
  extendedProperties: Joi.object(extendedPropertiesSchema).required(),
};

function gcalEventValidation(eventBody) {
  const schema = Joi.object(validationSchema);
  return schema.validate(eventBody);
}

module.exports.gcalEventValidation = gcalEventValidation;
