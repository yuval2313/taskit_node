const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const token = req.header("x-auth-token");
  if (!token) return res.status(401).send("No Authentication Provided!");

  try {
    const key = process.env.JWTKEY;
    const decoded = jwt.verify(token, key);
    req.user = decoded;
    next();
  } catch (ex) {
    return res.status(400).send("Invalid Authentication!");
  }
};
