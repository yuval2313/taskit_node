const express = require("express");
const router = express.Router();

const { validateToken } = require("../helpers/google");
const { User } = require("../models/user");

router.post("/", async (req, res) => {
  const { credential: token } = req.body;
  const payload = await validateToken(token);

  const { sub: googleId, email, name, picture } = payload;

  const user = await User.findUserByGoogleId(googleId);
  if (!user) {
    await User.create({ googleId, email, name, picture });
  }

  res.send(token);
});

module.exports = router;
