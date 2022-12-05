const HttpError = require("../errors/HttpError");

module.exports = async function (req, res, next) {
  const { refreshToken } = req.user;

  if (!refreshToken)
    throw new HttpError({
      statusCode: 403,
      message: "Current google account is not authorized!",
    });

  next();
};
