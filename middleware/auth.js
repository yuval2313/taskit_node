const jwt = require("jsonwebtoken");
const HttpError = require("../errors/HttpError");

module.exports = function (req, res, next) {
  const token = req.header("x-auth-token");
  if (!token)
    throw new HttpError({
      statusCode: 401,
      message: "No Authentication Provided!",
    });

  try {
    const key = process.env.JWTKEY;
    const decoded = jwt.verify(token, key);
    req.user = decoded;
    next();
  } catch (ex) {
    throw new HttpError({
      statusCode: 400,
      message: "Invalid Authentication!",
    });
  }
};
