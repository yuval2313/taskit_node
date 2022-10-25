const HttpError = require("../errors/HttpError");
const { User } = require("../models/user");

module.exports = async function (req, res, next) {
  const { googleId } = req.user;
  const user = await User.findUserByGoogleId(googleId);

  if (!user)
    throw new HttpError({
      statusCode: 401,
      message: "Current google account is not a registered user!",
    });

  req.user = user;
  next();
};
