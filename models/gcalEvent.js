const Joi = require("joi");

const extendedPropertiesSchema = {
  private: Joi.object({
    taskIt: Joi.boolean().required(),
  }).required(),
};
const dateSchema = { dateTime: Joi.date().required() };

const validationSchema = {
  summary: Joi.string().max(100).allow("").required(),
  description: Joi.string().max(5000).allow("").required(),
  colorId: Joi.string().required(),
  start: Joi.object(dateSchema).required(),
  end: Joi.object(dateSchema).required(),
  extendedProperties: Joi.object(extendedPropertiesSchema).required(),
};

function gcalEventValidation(eventBody) {
  const schema = Joi.object(validationSchema);
  return schema.validate(eventBody);
}

module.exports.gcalEventValidation = gcalEventValidation;
