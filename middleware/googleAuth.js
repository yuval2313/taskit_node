const { validateToken } = require("../helpers/google");

module.exports = async function (req, res, next) {
  const token = req.header("x-auth-token");
  const payload = await validateToken(token);

  const { sub: googleId } = payload;
  req.user = { googleId };
  next();
};
