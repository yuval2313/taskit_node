const HttpError = require("../errors/HttpError");

module.exports = function (validator) {
  return (req, res, next) => {
    const { error } = validator(req.body);
    if (error)
      throw new HttpError({
        statusCode: 400,
        message: error.details[0].message,
      });

    next();
  };
};
